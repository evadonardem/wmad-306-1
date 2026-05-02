import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _editName(BuildContext context, PlayerProvider player) async {
    final controller = TextEditingController(text: player.playerName);
    final newName = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Edit Player Name', style: TextStyle(color: Color(0xFFE2D9F3))),
        content: TextField(
          controller: controller,
          style: const TextStyle(color: Color(0xFFE2D9F3)),
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Your name',
            hintStyle: const TextStyle(color: Color(0xFF666666)),
            filled: true,
            fillColor: const Color(0xFF0D0D1A),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF7B2FBE)),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF666666))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, controller.text),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7B2FBE),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Save', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
    if (newName != null && newName.trim().isNotEmpty) {
      await player.updatePlayerName(newName.trim());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Profile', style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600)),
      ),
      body: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          return SingleChildScrollView(
            child: Column(
              children: [
                // Profile header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 28),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Color(0xFF1A0A2E), Color(0xFF0D0D1A)],
                    ),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 80, height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF7B2FBE),
                          border: Border.all(color: const Color(0xFFA855F7), width: 2),
                        ),
                        child: const Center(child: Text('🦸', style: TextStyle(fontSize: 36))),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        player.playerName,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFE2D9F3)),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1A1A2E),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF7B2FBE).withOpacity(0.4)),
                        ),
                        child: Text(
                          player.totalBattles == 0
                              ? 'Rookie Hero'
                              : player.winRate >= 70
                                  ? 'Legendary Hero'
                                  : player.winRate >= 50
                                      ? 'Seasoned Hero'
                                      : 'Rising Hero',
                          style: const TextStyle(fontSize: 12, color: Color(0xFF9370DB)),
                        ),
                      ),
                    ],
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stats row
                      Row(
                        children: [
                          _StatChip(label: 'Battles', value: '${player.totalBattles}', color: const Color(0xFF9370DB)),
                          const SizedBox(width: 10),
                          _StatChip(label: 'Wins', value: '${player.totalWins}', color: const Color(0xFF4ADE80)),
                          const SizedBox(width: 10),
                          _StatChip(
                            label: 'Win Rate',
                            value: '${player.winRate.toStringAsFixed(0)}%',
                            color: const Color(0xFFFBBF24),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Settings label
                      const Text(
                        'SETTINGS',
                        style: TextStyle(fontSize: 11, color: Color(0xFF666666), letterSpacing: 2),
                      ),
                      const SizedBox(height: 12),

                      // Theme toggle (Exercise 3)
                      _PrefRow(
                        icon: Icons.dark_mode_rounded,
                        iconColor: const Color(0xFF9370DB),
                        title: 'Dark Mode',
                        subtitle: 'SharedPreferences • persists on restart',
                        trailing: Switch(
                          value: player.isDarkTheme,
                          onChanged: (_) => player.toggleTheme(),
                          activeColor: const Color(0xFF7B2FBE),
                          activeTrackColor: const Color(0xFF3A1A5E),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Edit name
                      _PrefRow(
                        icon: Icons.person_rounded,
                        iconColor: const Color(0xFF60A5FA),
                        title: 'Player Name',
                        subtitle: player.playerName,
                        trailing: IconButton(
                          icon: const Icon(Icons.edit_rounded, color: Color(0xFF9370DB), size: 20),
                          onPressed: () => _editName(context, player),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Navigation label
                      const Text(
                        'NAVIGATION',
                        style: TextStyle(fontSize: 11, color: Color(0xFF666666), letterSpacing: 2),
                      ),
                      const SizedBox(height: 12),

                      // Battle history link
                      _PrefRow(
                        icon: Icons.history_rounded,
                        iconColor: const Color(0xFFFBBF24),
                        title: 'Battle History',
                        subtitle: 'SQLite records — played battles',
                        trailing: IconButton(
                          icon: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF9370DB), size: 16),
                          onPressed: () => Navigator.pushNamed(context, RouteNames.history),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Deck builder link
                      _PrefRow(
                        icon: Icons.style_rounded,
                        iconColor: const Color(0xFFA855F7),
                        title: 'Deck Builder',
                        subtitle: 'Build and manage your hero deck',
                        trailing: IconButton(
                          icon: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF9370DB), size: 16),
                          onPressed: () => Navigator.pushNamed(context, RouteNames.deckBuilder),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // App info
                      Center(
                        child: Column(
                          children: [
                            const Text('Hero Battle', style: TextStyle(fontSize: 13, color: Color(0xFF444444))),
                            const SizedBox(height: 2),
                            const Text('Flutter Edition • v1.0.0', style: TextStyle(fontSize: 11, color: Color(0xFF333333))),
                            const SizedBox(height: 6),
                            Text(
                              'Built by Allen Ray Teligo',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF555566)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _StatChip({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF666666))),
          ],
        ),
      ),
    );
  }
}

class _PrefRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final Widget trailing;

  const _PrefRow({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
      ),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, color: Color(0xFFE2D9F3), fontWeight: FontWeight.w500)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF666666))),
              ],
            ),
          ),
          trailing,
        ],
      ),
    );
  }
}
