import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/combat_provider.dart';
import 'providers/squad_provider.dart';
import 'providers/warrior_search_provider.dart';
import 'providers/profile_provider.dart';
import 'router/app_router.dart';

void main() => runApp(const RealmClashApp());

class RealmClashApp extends StatelessWidget {
  const RealmClashApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
        ChangeNotifierProvider(create: (_) => SquadProvider()),
        ChangeNotifierProvider(create: (_) => CombatProvider()),
        ChangeNotifierProvider(create: (_) => WarriorSearchProvider()),
      ],
      child: Selector<ProfileProvider, bool>(
        selector: (_, p) => p.darkMode,
        builder: (_, dark, __) => MaterialApp(
          title: 'Realm Clash',
          debugShowCheckedModeBanner: false,
          theme: dark ? _dark() : _light(),
          initialRoute: Routes.splash,
          onGenerateRoute: AppRouter.onGenerateRoute,
        ),
      ),
    );
  }

  // Deep purple + amber accent — visually distinct from the original's green
  ThemeData _dark() => ThemeData(
    colorSchemeSeed: const Color(0xFF7C3AED), // violet-600
    brightness: Brightness.dark,
    useMaterial3: true,
  );

  ThemeData _light() => ThemeData(
    colorSchemeSeed: const Color(0xFF7C3AED),
    brightness: Brightness.light,
    useMaterial3: true,
  );
}
