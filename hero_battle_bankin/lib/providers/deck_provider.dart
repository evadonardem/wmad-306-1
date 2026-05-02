import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/hero_model.dart';
import '../services/database_service.dart';

class DeckProvider extends ChangeNotifier {
  static const int maxDeckSize = 5;

  // --- NEW: GLOBAL UPGRADE VAULT ---
  // Stores the highest star level achieved for every hero: { "hero_id": stars }
  final Map<String, int> _globalUpgrades = {};

  final Map<String, List<HeroModel>> _savedTeams = {
    'Team 1': [],
    'Team 2': [],
    'Team 3': [],
  };

  String _activeTeamName = 'Team 1';

  // --- GETTERS ---
  List<HeroModel> get deck => List.unmodifiable(_savedTeams[_activeTeamName] ?? []);
  String get activeTeamName => _activeTeamName;
  Map<String, List<HeroModel>> get allTeams => _savedTeams;
  Map<String, int> get globalUpgrades => _globalUpgrades; // Exposed for Home Screen sync
  bool get isFull => deck.length >= maxDeckSize;
  int get deckSize => deck.length;
  int get totalAttackPower => deck.fold(0, (sum, hero) => sum + hero.attack);

  // --- MATCHMAKING & ELIGIBILITY ---
  String get matchmakingTier {
    int power = totalAttackPower;
    if (power == 0) return "No Team";
    if (power <= 1000) return "Beginner (1k Limit) 🛡️";
    if (power <= 2500) return "Veteran (2.5k Limit) ⚔️";
    return "Legendary (No Limit) 🔥";
  }

  bool isEligible(int limit) {
    if (limit == -1) return true; 
    return totalAttackPower <= limit;
  }

  // --- PERSISTENCE: LOADING ---
  Future<void> loadDeck() async {
    try {
      final List<Map<String, dynamic>> savedData = await DatabaseService().loadDecks();
      
      if (savedData.isNotEmpty) {
        for (var row in savedData) {
          final String teamName = row['name'];
          final String heroesJson = row['heroes'];
          
          if (_savedTeams.containsKey(teamName)) {
            final List<dynamic> decoded = jsonDecode(heroesJson);
            final List<HeroModel> loadedHeroes = decoded
                .map((item) => HeroModel.fromJson(item))
                .toList();
            
            _savedTeams[teamName] = loadedHeroes;

            // Update Global Vault with stars from loaded heroes
            for (var hero in loadedHeroes) {
              if (hero.stars > (_globalUpgrades[hero.id] ?? 0)) {
                _globalUpgrades[hero.id] = hero.stars;
              }
            }
          }
        }
        _syncStarsAcrossAllTeams();
        notifyListeners();
        debugPrint('✅ Teams and Global Upgrades loaded.');
      }
    } catch (e) {
      debugPrint('❌ Error loading deck: $e');
    }
  }

  // --- UPGRADE LOGIC (The "Stick" Fix) ---
  void upgradeHeroStars(String heroId) {
    // 1. Update the Global Vault first
    int currentStars = _globalUpgrades[heroId] ?? 0;
    if (currentStars < 5) {
      _globalUpgrades[heroId] = currentStars + 1;

      // 2. Apply this change to every team that contains this hero
      _syncStarsAcrossAllTeams();

      // 3. Persist and Notify
      saveDeckToDb(); 
      notifyListeners();
    }
  }

  // Helper to ensure all teams reflect the global vault star count
  void _syncStarsAcrossAllTeams() {
    _savedTeams.forEach((teamName, teamList) {
      for (int i = 0; i < teamList.length; i++) {
        String id = teamList[i].id;
        if (_globalUpgrades.containsKey(id)) {
          teamList[i] = teamList[i].copyWith(stars: _globalUpgrades[id]);
        }
      }
    });
  }

  // --- SQUAD MANAGEMENT ---
  bool isInDeck(HeroModel hero) => deck.any((h) => h.id == hero.id);

  void addToDeck(HeroModel hero) {
    if (validateAddition(hero) == null) {
      // When adding, automatically apply stars from the global vault
      final upgradedHero = hero.copyWith(stars: _globalUpgrades[hero.id] ?? 0);
      _savedTeams[_activeTeamName]!.add(upgradedHero);
      saveDeckToDb();
      notifyListeners(); 
    }
  }

  void removeFromDeck(HeroModel hero) {
    _savedTeams[_activeTeamName]!.removeWhere((h) => h.id == hero.id);
    saveDeckToDb();
    notifyListeners();
  }

  void setActiveTeam(String name) {
    if (_savedTeams.containsKey(name)) {
      _activeTeamName = name;
      notifyListeners();
    }
  }

  String? validateAddition(HeroModel hero) {
    if (isFull) return 'Deck is full! (Max 5)';
    if (isInDeck(hero)) return 'Hero is already in your deck!';
    return null;
  }

  Future<void> saveDeckToDb() async {
    await DatabaseService().saveDeck(_activeTeamName, deck);
  }
}