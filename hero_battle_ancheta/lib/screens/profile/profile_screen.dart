import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/player_provider.dart';
import '../../../services/prefs_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _apiTokenController = TextEditingController();
  final _prefs = PrefsService();
  bool _isEditing = false;
  bool _isEditingToken = false;
  String? _apiToken;
  late PlayerProvider _playerProvider;

  @override
  void initState() {
    super.initState();
    
    // Initialize provider FIRST before any async operations
    _playerProvider = context.read<PlayerProvider>();
    
    // Use post-frame callback to ensure proper timing
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    _nameController.text = _playerProvider.playerName;
    _apiToken = await _prefs.loadApiToken();
    if (_apiToken != null) {
      _apiTokenController.text = _apiToken!;
      _isEditingToken = false;
    } else {
      _isEditingToken = true;
    }
    await _playerProvider.loadTotalWinsFromHistory();
    if (mounted) setState(() {});
  }

  Future<void> _saveName() async {
    final newName = _nameController.text.trim();
    if (newName.isNotEmpty) {
      await _playerProvider.updatePlayerName(newName);
      if (mounted) {
        setState(() => _isEditing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Name updated!')),
        );
      }
    }
  }

  Future<void> _saveApiToken() async {
    final token = _apiTokenController.text.trim();
    if (token.isNotEmpty) {
      await _prefs.saveApiToken(token);
      setState(() {
        _apiToken = token;
        _isEditingToken = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('API token saved! Return to Home to refresh heroes.')),
        );
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _apiTokenController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Player avatar
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    child: const Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Consumer<PlayerProvider>(
                    builder: (context, player, _) {
                      return Text(
                        player.playerName,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 4),
                  Consumer<PlayerProvider>(
                    builder: (context, player, _) {
                      return Text(
                        'Total Wins: ${player.totalWins}',
                        style: const TextStyle(fontSize: 16),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Name section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Player Name',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (_isEditing)
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                hintText: 'Enter your name',
                              ),
                              autofocus: true,
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.save),
                            onPressed: _saveName,
                          ),
                          IconButton(
                            icon: const Icon(Icons.cancel),
                            onPressed: () {
                              setState(() => _isEditing = false);
                              _nameController.text =
                                  context.read<PlayerProvider>().playerName;
                            },
                          ),
                        ],
                      )
                    else
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              context.watch<PlayerProvider>().playerName,
                              style: const TextStyle(fontSize: 16),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => setState(() => _isEditing = true),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Theme section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Appearance',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Consumer<PlayerProvider>(
                      builder: (context, player, _) {
                        return SwitchListTile(
                          title: const Text('Dark Theme'),
                          subtitle: const Text('Toggle between dark and light mode'),
                          value: player.isDarkTheme,
                          onChanged: (_) => player.toggleTheme(),
                          secondary: const Icon(Icons.dark_mode),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // API Token section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'API Configuration',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'New players need to enter a token once. If one is already saved, the app will use it automatically.',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    const SizedBox(height: 12),
                    if (_apiToken != null && !_isEditingToken)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.verified, color: Colors.green, size: 18),
                              const SizedBox(width: 8),
                              const Expanded(
                                child: Text(
                                  'Token saved and ready to use',
                                  style: TextStyle(fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          TextButton.icon(
                            onPressed: () {
                              setState(() {
                                _isEditingToken = true;
                                _apiTokenController.text = _apiToken ?? '';
                              });
                            },
                            icon: const Icon(Icons.edit),
                            label: const Text('Change token'),
                          ),
                        ],
                      )
                    else
                      Column(
                        children: [
                          TextField(
                            controller: _apiTokenController,
                            decoration: InputDecoration(
                              border: const OutlineInputBorder(),
                              hintText: 'Enter Superhero API token',
                              suffixIcon: IconButton(
                                icon: const Icon(Icons.save),
                                onPressed: _saveApiToken,
                              ),
                            ),
                            obscureText: true,
                          ),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerLeft,
                            child: TextButton(
                              onPressed: _apiToken == null
                                  ? null
                                  : () {
                                      setState(() {
                                        _isEditingToken = false;
                                        _apiTokenController.text = _apiToken ?? '';
                                      });
                                    },
                              child: const Text('Keep saved token'),
                            ),
                          ),
                        ],
                      ),
                    if (_apiToken == null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          'Get your free API token from superheroapi.com',
                          style: TextStyle(color: Colors.grey[700], fontSize: 12),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // How to Play section
            Card(
              child: ExpansionTile(
                initiallyExpanded: false,
                tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                title: const Text(
                  'How To Play This',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                subtitle: const Text('Tap to expand instructions'),
                children: [
                  Text(
                    '1. Set your API token in API Configuration to load live heroes and images.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '2. Go to Hero Roster and browse heroes. Use Back/Next to move through the roster.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '3. Open a hero card to view details and battle stats, then add heroes to your deck.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '4. Start a battle. An opponent is chosen from preloaded opponents or fallback data.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Battle Actions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Strike (Attack): Uses your hero\'s Attack stat for reliable direct damage. Good default action.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Arcane (Special Attack): Uses your hero\'s Special Attack stat. Best when your hero has high power/intelligence.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Guard (Defend): Deals no damage this turn and is meant for defensive play. Use it when low on HP or expecting heavy enemy damage.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Tip: Damage is reduced by enemy defense and has a small random variance each turn, so outcomes are not always identical.',
                    style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '5. If your hero wins and more heroes remain in your deck, continue to the next hero.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '6. Battle outcomes are saved in History. Wins update your Total Wins in Profile.',
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // About section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'About',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const ListTile(
                      leading: Icon(Icons.info),
                      title: Text('Version'),
                      subtitle: Text('1.0.0'),
                    ),
                    const ListTile(
                      leading: Icon(Icons.code),
                      title: Text('Built with'),
                      subtitle: Text('Flutter & Provider'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}