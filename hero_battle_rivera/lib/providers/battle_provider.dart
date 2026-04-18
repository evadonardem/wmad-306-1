import 'package:flutter/foundation.dart';

class BattleProvider extends ChangeNotifier {
  bool _inProgress = false;

  bool get inProgress => _inProgress;

  void startBattle() {
    _inProgress = true;
    notifyListeners();
  }

  void endBattle() {
    _inProgress = false;
    notifyListeners();
  }
}
