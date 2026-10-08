import 'package:flutter/material.dart';

import 'data/study_model.dart';

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

class StudyLibraryPage extends StatelessWidget {
  const StudyLibraryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sanctuary Studies'),
        actions: [
          IconButton(
            tooltip: 'Data model',
            onPressed: () {},
            icon: const Icon(Icons.account_tree_outlined),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Study library', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text('Offline-first research, ready to travel with you.'),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Your first study', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  const Text('Create a study on desktop or mobile, then build its sources, notes, people, places, events, and tags.'),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add),
                    label: const Text('New study'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          const Text('Study structure'),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: studySections.map((section) => Chip(label: Text(section))).toList(),
          ),
        ],
      ),
    );
  }
}
