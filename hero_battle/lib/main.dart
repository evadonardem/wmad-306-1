import 'package:flutter/material.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'dart:io';
import 'package:provider/provider.dart';
import 'router/app_router.dart';
import 'providers/deck_provider.dart';
import 'providers/battle_provider.dart';
import 'providers/player_provider.dart';
import 'providers/hero_search_provider.dart';
import 'services/preferences_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize sqflite FFI for desktop (Windows, macOS, Linux)
  if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }
  await PreferencesService.init();
  runApp(const HeroBattleApp());
}

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(create: (_) => DeckProvider()),
        ChangeNotifierProvider(create: (_) => BattleProvider()),
        ChangeNotifierProvider(create: (_) => HeroSearchProvider()),
      ],
      child: Consumer<PlayerProvider>(
        builder: (context, playerProvider, _) {
          return MaterialApp(
            title: 'Hero Battle',
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              fontFamily: 'Montserrat',
              scaffoldBackgroundColor: const Color(0xFFFDE6F2), // pastel pink
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFFE573C7), // soft pink
                brightness: Brightness.light,
                surface: const Color(0xFFF8BBD0), // lighter pink
                primary: const Color(0xFFE573C7), // pink
                secondary: const Color(0xFFBA68C8), // lavender
                onPrimary: Colors.white,
                onSurface: Colors.black87,
              ),
              appBarTheme: const AppBarTheme(
                backgroundColor: Color(0xFFE573C7),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(24),
                  ),
                ),
              ),
              cardTheme: CardThemeData(
                color: const Color(0xFFF8BBD0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                elevation: 4,
              ),
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE573C7),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  textStyle: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              inputDecorationTheme: InputDecorationTheme(
                filled: true,
                fillColor: const Color(0xFFF8BBD0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
              ),
              sliderTheme: SliderThemeData(
                activeTrackColor: const Color(0xFFE573C7),
                inactiveTrackColor: const Color(0xFFF8BBD0),
                thumbColor: const Color(0xFFBA68C8),
                overlayColor: const Color(0x29E573C7),
              ),
              textTheme: ThemeData.light().textTheme.copyWith(
                headlineMedium: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFE573C7),
                ),
                titleMedium: const TextStyle(fontFamily: 'Montserrat'),
                bodyMedium: const TextStyle(fontFamily: 'Montserrat'),
              ),
              useMaterial3: true,
            ),
            darkTheme: ThemeData(
              fontFamily: 'Montserrat',
              scaffoldBackgroundColor: const Color(0xFF232B3A),
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFFBA68C8),
                brightness: Brightness.dark,
                surface: const Color(0xFF232B3A),
                primary: const Color(0xFFBA68C8),
                secondary: const Color(0xFFE573C7),
                onPrimary: Colors.white,
                onSurface: Colors.white,
              ),
              appBarTheme: const AppBarTheme(
                backgroundColor: Color(0xFF232B3A),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(24),
                  ),
                ),
              ),
              cardTheme: CardThemeData(
                color: const Color(0xFF232B3A),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                elevation: 4,
              ),
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFBA68C8),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  textStyle: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              inputDecorationTheme: InputDecorationTheme(
                filled: true,
                fillColor: const Color(0xFF232B3A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
              ),
              sliderTheme: SliderThemeData(
                activeTrackColor: const Color(0xFFBA68C8),
                inactiveTrackColor: const Color(0xFF232B3A),
                thumbColor: const Color(0xFFE573C7),
                overlayColor: const Color(0x29BA68C8),
              ),
              textTheme: ThemeData.dark().textTheme.copyWith(
                headlineMedium: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFBA68C8),
                ),
                titleMedium: const TextStyle(fontFamily: 'Montserrat'),
                bodyMedium: const TextStyle(fontFamily: 'Montserrat'),
              ),
              useMaterial3: true,
            ),
            themeMode: playerProvider.isDarkTheme
                ? ThemeMode.dark
                : ThemeMode.light,
            initialRoute: '/',
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }
}
