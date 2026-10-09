import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

import 'study_model.dart';

class StudyRepository {
  StudyRepository._(this._databaseFile);

  final File _databaseFile;
  Map<String, dynamic> _database = _emptyDatabase();

  static Map<String, dynamic> _emptyDatabase() => {
        'schema_version': 1,
        'studies': <Map<String, dynamic>>[],
        'sources': <Map<String, dynamic>>[],
        'notes': <Map<String, dynamic>>[],
        'entities': <Map<String, dynamic>>[],
        'relationships': <Map<String, dynamic>>[],
        'tags': <Map<String, dynamic>>[],
        'study_tags': <Map<String, dynamic>>[],
      };

  static Future<StudyRepository> open() async {
    final directory = await getApplicationDocumentsDirectory();
    final repository = StudyRepository._(File('${directory.path}${Platform.pathSeparator}sanctuary-studies-data.json'));
    await repository._load();
    return repository;
  }

  Future<void> _load() async {
    if (!_databaseFile.existsSync()) return;
    final decoded = jsonDecode(await _databaseFile.readAsString());
    if (decoded is! Map<String, dynamic> || decoded['schema_version'] is! num || (decoded['schema_version'] as num).toInt() > 1) {
      throw const FormatException('Unsupported Sanctuary Studies data version.');
    }
    final migrated = _emptyDatabase();
    for (final table in migrated.keys) {
      if (decoded[table] is List) migrated[table] = List<Map<String, dynamic>>.from((decoded[table] as List).map((row) => Map<String, dynamic>.from(row as Map)));
    }
    _database = migrated;
  }

  Future<void> _save() async {
    await _databaseFile.parent.create(recursive: true);
    final temporary = File('${_databaseFile.path}.${DateTime.now().microsecondsSinceEpoch}.tmp');
    await temporary.writeAsString(const JsonEncoder.withIndent('  ').convert(_database));
    await temporary.rename(_databaseFile.path);
  }

  List<Study> get studies => (_database['studies'] as List<dynamic>)
      .map((row) => Study.fromJson(Map<String, dynamic>.from(row as Map)))
      .where((study) => study.deletedAt == null)
      .toList(growable: false);

  int countRecords(String studyId, String section) {
    final table = {'sources': 'sources', 'notes': 'notes', 'people': 'entities', 'places': 'entities', 'events': 'entities', 'tags': 'tags'}[section];
    if (table == null) return 0;
    final entityType = {'people': 'person', 'places': 'place', 'events': 'event'}[section];
    return (_database[table] as List).where((row) => row['study_id'] == studyId && (entityType == null || row['entity_type'] == entityType)).length;
  }

  Future<Study> createStudy(String title, String description) async {
    final cleanTitle = title.trim();
    if (cleanTitle.isEmpty) throw const FormatException('A study title is required.');
    final now = DateTime.now().toUtc();
    final study = Study(id: '${now.microsecondsSinceEpoch}', title: cleanTitle, description: description.trim(), status: 'draft', createdAt: now, updatedAt: now);
    (_database['studies'] as List).add(study.toJson());
    await _save();
    return study;
  }

  Future<void> addRecord(String studyId, String section, Map<String, String> payload) async {
    if (!studies.any((study) => study.id == studyId)) throw const FormatException('The selected study does not exist.');
    final name = (payload['title'] ?? payload['name'] ?? '').trim();
    if (name.isEmpty) throw const FormatException('A record name or title is required.');
    final now = DateTime.now().toUtc().toIso8601String();
    final record = <String, dynamic>{'id': '${DateTime.now().microsecondsSinceEpoch}', 'study_id': studyId, 'created_at': now, 'updated_at': now, ...payload};
    if (section == 'people' || section == 'places' || section == 'events') {
      record['entity_type'] = {'people': 'person', 'places': 'place', 'events': 'event'}[section];
      record['name'] = name;
      (_database['entities'] as List).add(record);
    } else if (section == 'tags') {
      (_database['tags'] as List).add(record);
      (_database['study_tags'] as List).add({'study_id': studyId, 'tag_id': record['id']});
    } else if (section == 'sources' || section == 'notes') {
      (_database[section] as List).add(record);
    } else {
      throw const FormatException('Unsupported study section.');
    }
    await _save();
  }

  Future<String?> exportBundle() async {
    final path = await FilePicker.platform.saveFile(fileName: 'sanctuary-studies.ssbundle', bytes: Uint8List.fromList(utf8.encode(jsonEncode({'format': 'sanctuary-studies-bundle', 'format_version': 1, 'schema_version': 1, 'exported_at': DateTime.now().toUtc().toIso8601String(), 'source': 'Sanctuary Studies mobile', 'data': _database}))));
    return path;
  }

  Future<void> importBundle() async {
    final result = await FilePicker.platform.pickFiles(withData: true, type: FileType.custom, allowedExtensions: ['ssbundle', 'json']);
    if (result == null || result.files.single.bytes == null) return;
    final decoded = jsonDecode(utf8.decode(result.files.single.bytes!));
    if (decoded is! Map<String, dynamic> || decoded['format'] != 'sanctuary-studies-bundle' || decoded['data'] is! Map<String, dynamic>) throw const FormatException('The selected file is not a supported Sanctuary Studies bundle.');
    _database = Map<String, dynamic>.from(decoded['data'] as Map);
    await _save();
  }
}
