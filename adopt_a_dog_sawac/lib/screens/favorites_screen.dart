import 'package:flutter/material.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Favorite')),
      body: Placeholder(),
      floatingActionButton: FloatingActionButton(
        onPressed: null,
        child: const Icon(Icons.delete),
      ),
    );
  }
}
