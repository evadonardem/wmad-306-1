import 'package:flutter/foundation.dart';
import '../models/warrior_model.dart';

class SquadProvider extends ChangeNotifier {
  static const int maxSquadSize = 5;

  final List<WarriorModel> _roster = [];

  List<WarriorModel> get roster => List.unmodifiable(_roster);
  int get rosterSize => _roster.length;
  bool get isFull => _roster.length >= maxSquadSize;

  bool contains(String id) => _roster.any((w) => w.id == id);

  void addWarrior(WarriorModel warrior) {
    if (isFull || contains(warrior.id)) return;
    _roster.add(warrior);
    notifyListeners();
  }

  void removeWarrior(String id) {
    _roster.removeWhere((w) => w.id == id);
    notifyListeners();
  }

  void clearRoster() {
    _roster.clear();
    notifyListeners();
  }
}
