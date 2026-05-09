class BattleRecord {
  final int id;
  final int playerId;
  final String result;
  final List<String>? log;

  BattleRecord({
    required this.id,
    required this.playerId,
    required this.result,
    this.log,
  });

  factory BattleRecord.fromMap(Map<String, dynamic> map) {
    print("Fetched log: ${map['log'] ?? ''}");
    return BattleRecord(
      id: map['id'],
      playerId: map['playerId'],
      result: map['result'],
      log: map['log'] != null ? (map['log'] as String).split('|') : [],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'playerId': playerId,
      'result': result,
      'log': log?.join('|') ?? '',
    };
  }
}
