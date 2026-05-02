import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/prefs_service.dart';

enum RankTier { bronze, silver, gold, platinum, diamond, champion }

extension RankTierExt on RankTier {
  String get displayName {
    switch (this) {
      case RankTier.bronze:   return 'Bronze';
      case RankTier.silver:   return 'Silver';
      case RankTier.gold:     return 'Gold';
      case RankTier.platinum: return 'Platinum';
      case RankTier.diamond:  return 'Diamond';
      case RankTier.champion: return 'Champion';
    }
  }

  String get color {
    switch (this) {
      case RankTier.bronze:   return 'CD7F32';
      case RankTier.silver:   return 'C0C0C0';
      case RankTier.gold:     return 'FFD700';
      case RankTier.platinum: return '00CED1';
      case RankTier.diamond:  return 'B9F2FF';
      case RankTier.champion: return 'FF4500';
    }
  }

  IconData get icon {
    switch (this) {
      case RankTier.bronze:   return Icons.shield_outlined;
      case RankTier.silver:   return Icons.shield;
      case RankTier.gold:     return Icons.workspace_premium;
      case RankTier.platinum: return Icons.diamond_outlined;
      case RankTier.diamond:  return Icons.diamond;
      case RankTier.champion: return Icons.emoji_events;
    }
  }
}

RankTier rankTierFromPoints(int rp) {
  if (rp >= 2500) return RankTier.champion;
  if (rp >= 2000) return RankTier.diamond;
  if (rp >= 1500) return RankTier.platinum;
  if (rp >= 1000) return RankTier.gold;
  if (rp >= 500)  return RankTier.silver;
  return RankTier.bronze;
}

int pointsForNextTier(RankTier tier) {
  switch (tier) {
    case RankTier.bronze:   return 500;
    case RankTier.silver:   return 1000;
    case RankTier.gold:     return 1500;
    case RankTier.platinum: return 2000;
    case RankTier.diamond:  return 2500;
    case RankTier.champion: return 2500;
  }
}

class PlayerProvider extends ChangeNotifier {
  static const _coinsKey = 'player_coins';
  static const _unlockedKey = 'unlocked_hero_ids';
  static const _winsKey = 'player_wins';
  static const _lossesKey = 'player_losses';
  static const _rankPointsKey = 'rank_points';
  static const _rankedWinsKey = 'ranked_wins';
  static const _rankedLossesKey = 'ranked_losses';

  final PrefsService _prefs = PrefsService();
  String _playerName = 'Hero';
  bool _isDarkTheme = true;
  int _totalWins = 0;
  int _totalLosses = 0;
  int _coins = 100;
  int _rankPoints = 0;
  int _rankedWins = 0;
  int _rankedLosses = 0;
  final Set<int> _unlockedHeroIds = {};

  String get playerName => _playerName;
  bool get isDarkTheme => _isDarkTheme;
  int get totalWins => _totalWins;
  int get totalLosses => _totalLosses;
  int get totalBattles => _totalWins + _totalLosses;
  int get coins => _coins;
  int get rankPoints => _rankPoints;
  int get rankedWins => _rankedWins;
  int get rankedLosses => _rankedLosses;
  int get rankedBattles => _rankedWins + _rankedLosses;
  RankTier get rankTier => rankTierFromPoints(_rankPoints);
  Set<int> get unlockedHeroIds => _unlockedHeroIds;

  double get winRate =>
      totalBattles == 0 ? 0 : (_totalWins / totalBattles * 100);
  double get rankedWinRate =>
      rankedBattles == 0 ? 0 : (_rankedWins / rankedBattles * 100);

  /// Coin cost to unlock a hero, based on rarity (totalPower).
  int unlockCost(int totalPower) {
    if (totalPower >= 450) return 200; // legendary
    if (totalPower >= 350) return 100; // epic
    if (totalPower >= 250) return 50;  // rare
    if (totalPower >= 150) return 25;  // uncommon
    return 10; // common
  }

  bool isHeroUnlocked(int heroId) => _unlockedHeroIds.contains(heroId);

  bool canUnlock(int cost) => _coins >= cost;

  /// Call once from SplashScreen after app starts.
  Future<void> loadFromPrefs() async {
    _playerName = await _prefs.loadPlayerName() ?? 'Hero';
    _isDarkTheme = await _prefs.loadThemeDark();

    final prefs = await SharedPreferences.getInstance();
    _coins = prefs.getInt(_coinsKey) ?? 100;
    _totalWins = prefs.getInt(_winsKey) ?? 0;
    _totalLosses = prefs.getInt(_lossesKey) ?? 0;
    _rankPoints = prefs.getInt(_rankPointsKey) ?? 0;
    _rankedWins = prefs.getInt(_rankedWinsKey) ?? 0;
    _rankedLosses = prefs.getInt(_rankedLossesKey) ?? 0;

    final raw = prefs.getString(_unlockedKey);
    if (raw != null) {
      final list = jsonDecode(raw) as List;
      _unlockedHeroIds.addAll(list.cast<int>());
    }

    // brief splash delay
    await Future.delayed(const Duration(seconds: 2));

    notifyListeners();
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_coinsKey, _coins);
    await prefs.setInt(_winsKey, _totalWins);
    await prefs.setInt(_lossesKey, _totalLosses);
    await prefs.setInt(_rankPointsKey, _rankPoints);
    await prefs.setInt(_rankedWinsKey, _rankedWins);
    await prefs.setInt(_rankedLossesKey, _rankedLosses);
    await prefs.setString(
        _unlockedKey, jsonEncode(_unlockedHeroIds.toList()));
  }

  /// Award coins for winning a battle.
  void addBattleWinReward({bool isRanked = false}) {
    _totalWins++;
    _coins += 30;
    if (isRanked) {
      _rankedWins++;
      _rankPoints += 25;
      _coins += 10; // bonus coins for ranked
    }
    _save();
    notifyListeners();
  }

  /// Small consolation coins for losing.
  void addBattleLossReward({bool isRanked = false}) {
    _totalLosses++;
    _coins += 5;
    if (isRanked) {
      _rankedLosses++;
      _rankPoints = (_rankPoints - 15).clamp(0, 999999);
    }
    _save();
    notifyListeners();
  }

  /// Unlock a hero. Returns true if successful.
  bool unlockHero(int heroId, int cost) {
    if (_coins < cost) return false;
    _coins -= cost;
    _unlockedHeroIds.add(heroId);
    _save();
    notifyListeners();
    return true;
  }

  void incrementWins() {
    _totalWins++;
    _save();
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkTheme = !_isDarkTheme;
    _prefs.saveThemeDark(_isDarkTheme);
    notifyListeners();
  }
}
