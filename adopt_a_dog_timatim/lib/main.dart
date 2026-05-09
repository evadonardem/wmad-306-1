import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/dogs_provider.dart';
import 'providers/favorites_provider.dart';
import 'screens/splash_screen.dart';
import 'services/api_service.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const PawMatchApp());
}

class PawMatchApp extends StatelessWidget {
  const PawMatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // ApiService is shared by both providers and the adoption form sheet.
        Provider<ApiService>(
          create: (_) => ApiService(),
          dispose: (_, _) {},
        ),
        ChangeNotifierProvider<DogsProvider>(
          create: (ctx) => DogsProvider(ctx.read<ApiService>()),
        ),
        ChangeNotifierProvider<FavoritesProvider>(
          create: (_) => FavoritesProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'Dog adopter',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        home: const SplashScreen(),
      ),
    );
  }
}
