// Persisted battle result model
class BattleRecord {
  final String id;
  final String winnerId;
  final String loserId;
  final DateTime date;

  BattleRecord({
    required this.id,
    required this.winnerId,
    required this.loserId,
    required this.date,
  });

  factory BattleRecord.fromJson(Map<String, dynamic> json) => BattleRecord(
    id: json['id'] ?? '',
    winnerId: json['winnerId'] ?? '',
    loserId: json['loserId'] ?? '',
    date: DateTime.parse(json['date'] ?? DateTime.now().toIso8601String()),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'winnerId': winnerId,
    'loserId': loserId,
    'date': date.toIso8601String(),
  };
}
