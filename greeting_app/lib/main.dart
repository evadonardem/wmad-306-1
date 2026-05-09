import 'dart:math';

import 'package:flutter/material.dart';

void main() {
  runApp(const GreetingApp());
}

class GreetingApp extends StatelessWidget {
  const GreetingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Greeting App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF6C63FF),
        useMaterial3: true,
      ),
      home: const GreetingScreen(),
    );
  }
}

class GreetingScreen extends StatefulWidget {
  const GreetingScreen({super.key});

  @override
  State<GreetingScreen> createState() => _GreetingScreenState();
}

class _GreetingScreenState extends State<GreetingScreen> {
  // List of greeting messages to choose from randomly
  final List<String> _greetings = [
    'Hello, World! 👋',
    'Hey there! 😊',
    'Welcome! 🎉',
    'Hi, beautiful day! ☀️',
    'Good vibes only! ✨',
    'Howdy, partner! 🤠',
    'Salutations! 🌟',
    'Yo! What\'s up? 💪',
    'Nice to see you! 😄',
    'Greetings, traveler! 🧳',
    'Hope you\'re having a great day! 🌈',
    'Keep shining! ⭐',
  ];

  // The currently displayed greeting
  String _currentGreeting = 'Tap the button to get a greeting!';

  // Random number generator
  final Random _random = Random();

  /// Picks a random greeting from the list and updates the screen.
  void _changeGreeting() {
    setState(() {
      _currentGreeting = _greetings[_random.nextInt(_greetings.length)];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Greeting App'),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Greeting display card
              Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32.0,
                    vertical: 40.0,
                  ),
                  child: Text(
                    _currentGreeting,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              const SizedBox(height: 40),
              // Greet button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _changeGreeting,
                  icon: const Icon(Icons.shuffle),
                  label: const Text('Get a Greeting'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    textStyle: const TextStyle(fontSize: 18),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}