import 'package:flutter/material.dart';

import 'data/study_model.dart';
import 'data/study_repository.dart';

void main() {
  runApp(const SanctuaryStudiesApp());
}

class SanctuaryStudiesApp extends StatelessWidget {
  const SanctuaryStudiesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sanctuary Studies',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF5A6F56)),
        useMaterial3: true,
      ),
      home: const StudyLibraryPage(),
    );
  }
}

class StudyLibraryPage extends StatefulWidget {
  const StudyLibraryPage({super.key});

  @override
  State<StudyLibraryPage> createState() => _StudyLibraryPageState();
}

class _StudyLibraryPageState extends State<StudyLibraryPage> {
  late Future<StudyRepository> _repository;

  @override
  void initState() {
    super.initState();
    _repository = StudyRepository.open();
  }

  Future<void> _createStudy(StudyRepository repository) async {
    final title = TextEditingController();
    final description = TextEditingController();
    final created = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create a study'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: title, autofocus: true, decoration: const InputDecoration(labelText: 'Title')),
          TextField(controller: description, decoration: const InputDecoration(labelText: 'Description')),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          FilledButton(onPressed: () async { try { await repository.createStudy(title.text, description.text); if (context.mounted) Navigator.pop(context, true); } catch (error) { if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString()))); } }, child: const Text('Create')),
        ],
      ),
    );
    title.dispose();
    description.dispose();
    if (created == true && mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<StudyRepository>(future: _repository, builder: (context, snapshot) {
      if (snapshot.hasError) return Scaffold(body: Center(child: Text('Unable to open local studies: ${snapshot.error}')));
      if (!snapshot.hasData) return const Scaffold(body: Center(child: CircularProgressIndicator()));
      final repository = snapshot.data!;
      final studies = repository.studies;
      return Scaffold(
        appBar: AppBar(title: const Text('Sanctuary Studies'), actions: [
          IconButton(tooltip: 'Import bundle', onPressed: () async { try { await repository.importBundle(); if (mounted) setState(() {}); } catch (error) { if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString()))); } }, icon: const Icon(Icons.file_open_outlined)),
          IconButton(tooltip: 'Export bundle', onPressed: () async { try { await repository.exportBundle(); if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bundle exported.'))); } catch (error) { if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString()))); } }, icon: const Icon(Icons.ios_share_outlined)),
        ]),
        floatingActionButton: FloatingActionButton.extended(onPressed: () => _createStudy(repository), icon: const Icon(Icons.add), label: const Text('New study')),
        body: studies.isEmpty ? const Center(child: Text('Create your first study to begin.')) : ListView.separated(padding: const EdgeInsets.all(16), itemCount: studies.length, separatorBuilder: (_, __) => const SizedBox(height: 10), itemBuilder: (context, index) { final study = studies[index]; return Card(child: ListTile(title: Text(study.title), subtitle: Text(study.description.isEmpty ? 'No description' : study.description), trailing: const Icon(Icons.chevron_right), onTap: () async { await Navigator.push(context, MaterialPageRoute(builder: (_) => StudyDetailPage(repository: repository, study: study))); if (mounted) setState(() {}); })); }),
      );
    });
  }
}

class StudyDetailPage extends StatefulWidget {
  const StudyDetailPage({required this.repository, required this.study, super.key});
  final StudyRepository repository;
  final Study study;

  @override
  State<StudyDetailPage> createState() => _StudyDetailPageState();
}

class _StudyDetailPageState extends State<StudyDetailPage> {
  String section = 'Sources';

  Future<void> _addRecord() async {
    final title = TextEditingController();
    final detail = TextEditingController();
    final saved = await showDialog<bool>(context: context, builder: (context) => AlertDialog(title: Text('Add $section'), content: Column(mainAxisSize: MainAxisSize.min, children: [TextField(controller: title, autofocus: true, decoration: InputDecoration(labelText: section == 'Notes' ? 'Title' : 'Name')), TextField(controller: detail, decoration: const InputDecoration(labelText: 'Description or body'))]), actions: [TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')), FilledButton(onPressed: () async { try { final key = section == 'Notes' || section == 'Sources' ? 'title' : 'name'; await widget.repository.addRecord(widget.study.id, section.toLowerCase(), {key: title.text, if (section == 'Notes') 'body': detail.text, if (section != 'Notes') 'description': detail.text}); if (context.mounted) Navigator.pop(context, true); } catch (error) { if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString()))); } }, child: const Text('Save'))]));
    title.dispose();
    detail.dispose();
    if (saved == true && mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final sections = studySections;
    return Scaffold(appBar: AppBar(title: Text(widget.study.title), actions: [IconButton(onPressed: _addRecord, icon: const Icon(Icons.add), tooltip: 'Add record')]), body: Column(children: [SingleChildScrollView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 8), child: Row(children: sections.map((item) => Padding(padding: const EdgeInsets.only(right: 6), child: ChoiceChip(label: Text(item), selected: section == item, onSelected: (_) => setState(() => section = item)))).toList())), Expanded(child: Center(child: Text('${widget.repository.countRecords(widget.study.id, section.toLowerCase())} $section')))]));
  }
}
