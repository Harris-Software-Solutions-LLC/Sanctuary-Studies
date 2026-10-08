class Study {
  const Study({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String title;
  final String description;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;
}

const studySections = <String>[
  'Sources',
  'Notes',
  'People',
  'Places',
  'Events',
  'Tags',
];
