// Lightweight DTO referenced by §3.3. The provider holds the live values;
// this class exists for cases where we need to pass a snapshot around.

class PlayerStats {
  final String name;
  final int totalWins;
  final bool isDarkTheme;

  const PlayerStats({
    required this.name,
    required this.totalWins,
    required this.isDarkTheme,
  });

  Map<String, dynamic> toMap() => {
        'name': name,
        'totalWins': totalWins,
        'isDarkTheme': isDarkTheme ? 1 : 0,
      };

  factory PlayerStats.fromMap(Map<String, dynamic> map) => PlayerStats(
        name: map['name'] as String,
        totalWins: map['totalWins'] as int,
        isDarkTheme: (map['isDarkTheme'] as int) == 1,
      );
}
