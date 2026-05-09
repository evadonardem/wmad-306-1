import 'package:adopt_a_dog/screens/breed_list_screen.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const AdoptADogApp());
}

class AdoptADogApp extends StatelessWidget {
  const AdoptADogApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Adopt-a-Dog',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.teal,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF2F7F5),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0D634B),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        cardTheme: CardThemeData(
          color: Colors.white,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
      ),
      home: const BreedListScreen(),
    );
  }
}
