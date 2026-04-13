import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hero Roster'),
        actions: [
          IconButton(
            icon: const Icon(Icons.style),
            onPressed: () => print('Go to deck builder'),
          ),
          Positioned(
            right: 6,
            top: 6,
            child: const CircleAvatar(
              radius: 8,
              child: Text('5', style: TextStyle(fontSize: 10))
            )
          ),  
        ],
      ),
      body: Placeholder(),
    );
  }
}