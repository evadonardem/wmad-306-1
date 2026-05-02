class PlayerStats {
  final String name;
  final int totalWins;
  final bool isDarkTheme;

  const PlayerStats({
    required this.name,
    required this.totalWins,
    required this.isDarkTheme,
  });

  factory PlayerStats.fromJson(Map<String, dynamic> json) => PlayerStats(
    name: json['name'] as String? ?? 'Hero',
    totalWins: json['totalWins'] as int? ?? 0,
    isDarkTheme: json['isDarkTheme'] as bool? ?? true,
  );

  Map<String, dynamic> toJson() => {
    'name': name,
    'totalWins': totalWins,
    'isDarkTheme': isDarkTheme,
  };
}
