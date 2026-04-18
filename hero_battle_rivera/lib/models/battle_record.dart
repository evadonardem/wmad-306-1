import 'dart:convert';

class BattleRecord {
  const BattleRecord({
    this.id,
    required this.playerHero,
    required this.aiHero,
    required this.playerWon,
    required this.roundsPlayed,
    required this.playedAt,
    this.playerName = '',
    this.opponentName = '',
    this.playerDeckName = 'Current Deck',
    this.playerDeckId,
    this.opponentDeckName = 'Opponent Deck',
    this.playerDeckHeroes = const <String>[],
    this.opponentDeckHeroes = const <String>[],
    this.matchResults = const <String>[],
    this.overallResult = '',
  });

  final int? id;
  final String playerHero;
  final String aiHero;
  final bool playerWon;
  final int roundsPlayed;
  final String playedAt;
  final String playerName;
  final String opponentName;
  final String playerDeckName;
  final int? playerDeckId;
  final String opponentDeckName;
  final List<String> playerDeckHeroes;
  final List<String> opponentDeckHeroes;
  final List<String> matchResults;
  final String overallResult;

  String get normalizedOverallResult {
    return _resolveOverallResult(raw: overallResult, playerWon: playerWon);
  }

  String get overallResultLabel {
    final normalized = normalizedOverallResult;
    if (normalized == 'victory') return 'Victory';
    if (normalized == 'defeat') return 'Defeat';
    if (normalized == 'draw') return 'Draw';
    return playerWon ? 'Victory' : 'Defeat';
  }

  bool get isDraw => normalizedOverallResult == 'draw';

  bool get isVictory => normalizedOverallResult == 'victory';

  bool get isDefeat => normalizedOverallResult == 'defeat';

  factory BattleRecord.fromMap(Map<String, dynamic> map) {
    final playerWon = (map['player_won'] as int? ?? 0) == 1;
    final playerHero = (map['player_hero'] ?? '').toString();
    final aiHero = (map['ai_hero'] ?? '').toString();
    final rawPlayerDeckId = map['player_deck_id'];
    final playerDeckId = rawPlayerDeckId is int
        ? rawPlayerDeckId
        : rawPlayerDeckId is num
        ? rawPlayerDeckId.toInt()
        : null;

    final playerDeckHeroes = _decodeList(map['player_deck_heroes']);
    final opponentDeckHeroes = _decodeList(map['opponent_deck_heroes']);

    final fallbackPlayerDeckHeroes =
        playerDeckHeroes.isEmpty && playerHero.isNotEmpty
        ? <String>[playerHero]
        : playerDeckHeroes;

    final fallbackOpponentDeckHeroes =
        opponentDeckHeroes.isEmpty && aiHero.isNotEmpty
        ? <String>[aiHero]
        : opponentDeckHeroes;

    return BattleRecord(
      id: map['id'] as int?,
      playerHero: playerHero,
      aiHero: aiHero,
      playerWon: playerWon,
      roundsPlayed: map['rounds_played'] as int? ?? 0,
      playedAt: (map['played_at'] ?? '').toString(),
      playerName: (map['player_name'] ?? '').toString(),
      opponentName: (map['opponent_name'] ?? '').toString(),
      playerDeckName: (map['player_deck_name'] ?? 'Current Deck').toString(),
      playerDeckId: playerDeckId,
      opponentDeckName: (map['opponent_deck_name'] ?? 'Opponent Deck')
          .toString(),
      playerDeckHeroes: fallbackPlayerDeckHeroes,
      opponentDeckHeroes: fallbackOpponentDeckHeroes,
      matchResults: _decodeList(map['match_results']),
      overallResult: _resolveOverallResult(
        raw: (map['overall_result'] ?? '').toString(),
        playerWon: playerWon,
      ),
    );
  }

  Map<String, dynamic> toMap() {
    final normalizedOverall = _resolveOverallResult(
      raw: overallResult,
      playerWon: playerWon,
    );

    return <String, dynamic>{
      if (id != null) 'id': id,
      'player_hero': playerHero,
      'ai_hero': aiHero,
      'player_won': playerWon ? 1 : 0,
      'rounds_played': roundsPlayed,
      'played_at': playedAt,
      'player_name': playerName,
      'opponent_name': opponentName,
      'player_deck_name': playerDeckName,
      'player_deck_id': playerDeckId,
      'opponent_deck_name': opponentDeckName,
      'player_deck_heroes': jsonEncode(playerDeckHeroes),
      'opponent_deck_heroes': jsonEncode(opponentDeckHeroes),
      'match_results': jsonEncode(matchResults),
      'overall_result': normalizedOverall,
    };
  }

  static List<String> _decodeList(dynamic raw) {
    if (raw is! String || raw.trim().isEmpty) {
      return const <String>[];
    }

    try {
      final decoded = jsonDecode(raw);
      if (decoded is List) {
        return decoded
            .where((item) => item != null)
            .map((item) => item.toString())
            .toList(growable: false);
      }
    } catch (_) {
      return const <String>[];
    }

    return const <String>[];
  }

  static String _resolveOverallResult({
    required String raw,
    required bool playerWon,
  }) {
    final normalized = raw.trim().toLowerCase();
    if (normalized == 'victory' ||
        normalized == 'defeat' ||
        normalized == 'draw') {
      return normalized;
    }

    return playerWon ? 'victory' : 'defeat';
  }
}
