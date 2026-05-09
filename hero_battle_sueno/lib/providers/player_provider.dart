import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/player.dart';

class PlayerProvider extends ChangeNotifier {
  List<Player> _players = [];
  Player? currentPlayer;

  List<Player> get players => _players;

  // LOAD DATA
  Future<void> loadPlayers() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('players');

    if (data != null) {
      final decoded = jsonDecode(data) as List;
      _players = decoded.map((e) => Player.fromJson(e)).toList();
    }

    notifyListeners();
  }

  // SAVE DATA
  Future<void> savePlayers() async {
    final prefs = await SharedPreferences.getInstance();
    final data = jsonEncode(_players.map((e) => e.toJson()).toList());
    await prefs.setString('players', data);
  }

  // ADD PLAYER
  void addPlayer(String name) {
    _players.add(Player(name: name));
    savePlayers();
    notifyListeners();
  }

  // SWITCH PLAYER
  void switchPlayer(Player player) {
    currentPlayer = player;
    notifyListeners();
  }

  // ADD DECK
  void addDeck(String name, List<String> heroes) {
    currentPlayer?.decks.add({'name': name, 'heroes': heroes});

    savePlayers();
    notifyListeners();
  }

  // DELETE DECK
  void deleteDeck(int index) {
    currentPlayer?.decks.removeAt(index);
    savePlayers();
    notifyListeners();
  }

  // ADD BATTLE RESULT
  void addBattle(bool won, String opponent) {
    currentPlayer?.history.add({
      'opponent': opponent,
      'won': won,
      'date': DateTime.now().toString(),
    });

    if (won) {
      currentPlayer?.wins++;
    } else {
      currentPlayer?.losses++;
    }

    savePlayers();
    notifyListeners();
  }
}
