import 'package:flutter/material.dart';
import '../models/player_model.dart';
import '../services/db_service.dart';
import '../services/prefs_service.dart';

class PlayerManagerProvider extends ChangeNotifier {
  List<PlayerModel> players = [];
  PlayerModel? currentPlayer;
  bool loading = false;

  PlayerManagerProvider();

  Future<void> loadPlayers() async {
    loading = true;
    notifyListeners();

    final data = await DBService.getPlayers();
    players = data.map((e) => PlayerModel.fromMap(e)).toList();

    final savedId = await PrefsService.getPlayer();

    if (players.isNotEmpty) {
      currentPlayer = savedId != null
          ? players.firstWhere(
              (p) => p.id == savedId,
              orElse: () => players.first,
            )
          : players.first;
    }

    loading = false;
    notifyListeners();
  }

  Future<void> createPlayer(String name) async {
    await DBService.createPlayer(name);
    await loadPlayers();
  }

  Future<void> selectPlayer(PlayerModel player) async {
    currentPlayer = player;
    if (player.id != null) {
      await PrefsService.savePlayer(player.id!);
    }
    notifyListeners();
  }

  Future<void> deletePlayer(int id) async {
    await DBService.deletePlayer(id);
    await loadPlayers();
    if (currentPlayer?.id == id) {
      if (players.isNotEmpty) {
        currentPlayer = players.first;
        await PrefsService.savePlayer(currentPlayer!.id!);
      } else {
        currentPlayer = null;
        await PrefsService.savePlayer(-1);
      }
    }
    notifyListeners();
  }

  Future<void> incrementWins(int id) async {
    final index = players.indexWhere((p) => p.id == id);
    if (index == -1) return;
    players[index].wins++;
    await DBService.updatePlayerStats(
      id,
      players[index].wins,
      players[index].losses,
    );
    notifyListeners();
  }

  Future<void> incrementLosses(int id) async {
    final index = players.indexWhere((p) => p.id == id);
    if (index == -1) return;
    players[index].losses++;
    await DBService.updatePlayerStats(
      id,
      players[index].wins,
      players[index].losses,
    );
    notifyListeners();
  }
}
