class HistoryModel {
  final int id;
  final String playerName;
  final String result;
  final DateTime date;

  HistoryModel({
    required this.id,
    required this.playerName,
    required this.result,
    required this.date,
  });

  factory HistoryModel.fromJson(Map<String, dynamic> json) {
    return HistoryModel(
      id: json['id'],
      playerName: json['playerName'],
      result: json['result'],
      date: DateTime.parse(json['date']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'playerName': playerName,
    'result': result,
    'date': date.toIso8601String(),
  };
}
