import 'package:adopt_a_dog/providers/dog_provider.dart';
import 'package:adopt_a_dog/screens/breed_list_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const AdoptADogApp());
}

class AdoptADogApp extends StatelessWidget {
  const AdoptADogApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => DogProvider(),
      child: MaterialApp(
        title: 'Adopt-a-Dog',
        debugShowCheckedModeBanner: false,
        theme: _buildTheme(),
        home: const BreedListScreen(),
      ),
    );
  }

  ThemeData _buildTheme() {
    const seedColor = Color(0xFF2D6A4F); // deep forest green

    return ThemeData(
      colorSchemeSeed: seedColor,
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Nunito',
      scaffoldBackgroundColor: const Color(0xFFF4F7F4),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF2D6A4F),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 22,
          fontWeight: FontWeight.w800,
          color: Colors.white,
          letterSpacing: 0.3,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}
