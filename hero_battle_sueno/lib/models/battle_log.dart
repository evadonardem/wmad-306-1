class BattleLog {
  String opponent;
  bool won;
  DateTime date;

  BattleLog({required this.opponent, required this.won, required this.date});

  Map<String, dynamic> toJson() => {
    'opponent': opponent,
    'won': won,
    'date': date.toIso8601String(),
  };

  factory BattleLog.fromJson(Map<String, dynamic> json) => BattleLog(
    opponent: json['opponent'],
    won: json['won'],
    date: DateTime.parse(json['date']),
  );
}
