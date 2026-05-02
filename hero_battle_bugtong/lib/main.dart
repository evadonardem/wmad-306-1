import 'package:flutter/material.dart';

import 'src/app_store.dart';
import 'src/pages/home_page.dart';

void main() {
  runApp(const HeroBattleBootstrap());
}

class HeroBattleBootstrap extends StatefulWidget {
  const HeroBattleBootstrap({super.key});

  @override
  State<HeroBattleBootstrap> createState() => _HeroBattleBootstrapState();
}

class _HeroBattleBootstrapState extends State<HeroBattleBootstrap> {
  AppStore? _store;

  @override
  void initState() {
    super.initState();
    _initStore();
  }

  Future<void> _initStore() async {
    final store = await AppStore.load();
    if (!mounted) {
      return;
    }
    setState(() {
      _store = store;
    });
  }

  @override
  Widget build(BuildContext context) {
    final store = _store;
    if (store == null) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      );
    }
    return HeroBattleApp(store: store);
  }
}

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key, required this.store});

  final AppStore store;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: store,
      builder: (context, _) {
        final seedColor = const Color(0xFFDAA520);
        return MaterialApp(
          title: 'Hero Battle',
          debugShowCheckedModeBanner: false,
          themeMode: store.isDark ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(seedColor: seedColor),
            useMaterial3: true,
          ),
          darkTheme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: seedColor,
              brightness: Brightness.dark,
            ),
            useMaterial3: true,
          ),
          home: HomePage(store: store),
        );
      },
    );
  }
}
