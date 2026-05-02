import 'package:flutter_test/flutter_test.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/providers/battle_provider.dart';

void main() {
  test(
    'keeps final heroes readable after the last opponent is eliminated',
    () async {
      final battle = BattleProvider();
      final player = _hero(
        id: '1',
        name: 'Heavy Hitter',
        intelligence: 100,
        strength: 100,
        speed: 100,
        durability: 100,
        power: 100,
        combat: 100,
      );
      final opponents = [
        _hero(id: '2', name: 'First Target', speed: 1, durability: 1, power: 1),
        _hero(id: '3', name: 'Final Target', speed: 1, durability: 1, power: 1),
      ];

      battle.startTeamBattle(playerTeam: [player], aiTeam: opponents);

      await battle.playerAttack(special: false);
      await battle.playerAttack(special: false);

      expect(battle.isComplete, isTrue);
      expect(battle.playerWon, isTrue);
      expect(battle.playerHero, isNotNull);
      expect(battle.aiHero, isNotNull);
      expect(battle.aiActiveNumber, opponents.length);
      expect(battle.aiRemaining, 0);
    },
  );

  test('prepared battle waits for Play before the faster AI attacks', () async {
    final battle = BattleProvider();
    final player = _hero(
      id: '1',
      name: 'Slow Hero',
      speed: 1,
      durability: 100,
      power: 100,
    );
    final opponent = _hero(
      id: '2',
      name: 'Fast Villain',
      strength: 100,
      speed: 100,
      combat: 100,
    );

    battle.prepareTeamBattle(playerTeam: [player], aiTeam: [opponent]);

    expect(battle.awaitingPlay, isTrue);
    expect(battle.playerTurn, isFalse);
    expect(battle.playerHp, player.maxHp);

    battle.playPreparedBattle();

    expect(battle.awaitingPlay, isFalse);
    expect(battle.playerHp, lessThan(player.maxHp));
  });
}

HeroModel _hero({
  required String id,
  required String name,
  int intelligence = 50,
  int strength = 50,
  int speed = 50,
  int durability = 50,
  int power = 50,
  int combat = 50,
}) {
  return HeroModel(
    id: id,
    name: name,
    imageUrl: '',
    publisher: 'Test',
    alignment: 'good',
    fullName: name,
    powerStats: PowerStats(
      intelligence: intelligence,
      strength: strength,
      speed: speed,
      durability: durability,
      power: power,
      combat: combat,
    ),
  );
}
