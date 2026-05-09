import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/warrior_model.dart';
import '../../providers/squad_provider.dart';
import '../../providers/warrior_search_provider.dart';
import '../../router/app_router.dart';
import '../../services/api_service.dart';
import '../../widgets/warrior_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _api = ApiService();
  final _searchCtrl = TextEditingController();
  late Future<List<WarriorModel>> _future;

  @override
  void initState() {
    super.initState();
    _future = _bootstrap();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<List<WarriorModel>> _bootstrap() async {
    final searchProv = context.read<WarriorSearchProvider>();
    final last = await searchProv.loadLastSearch();
    if (mounted && last.isNotEmpty) {
      _searchCtrl.text = last;
      return searchProv.search(last, _api);
    }
    return _loadRandom();
  }

  Future<List<WarriorModel>> _loadRandom() async {
    try {
      return await _api.fetchRandomRoster(count: 20);
    } catch (_) {
      return fallbackWarriors;
    }
  }

  void _onSearch(String value) {
    final q = value.trim();
    final sp = context.read<WarriorSearchProvider>();
    setState(() {
      _future = q.isEmpty
          ? sp.search('', _api).then((_) => _loadRandom())
          : sp.search(q, _api);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Warrior Roster'),
        actions: [
          IconButton(
            tooltip: 'Match history',
            icon: const Icon(Icons.history_edu_rounded),
            onPressed: () => Navigator.pushNamed(context, Routes.history),
          ),
          IconButton(
            tooltip: 'Profile',
            icon: const Icon(Icons.manage_accounts_rounded),
            onPressed: () => Navigator.pushNamed(context, Routes.profile),
          ),
          Consumer<SquadProvider>(
            builder: (_, squad, __) => Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  tooltip: 'My Squad',
                  icon: const Icon(Icons.groups_rounded),
                  onPressed: () =>
                      Navigator.pushNamed(context, Routes.squad),
                ),
                if (squad.rosterSize > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: CircleAvatar(
                      radius: 8,
                      child: Text(
                        '${squad.rosterSize}',
                        style: const TextStyle(fontSize: 10),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
            child: TextField(
              controller: _searchCtrl,
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                labelText: 'Search warriors',
                hintText: 'e.g. Thor, Venom, Flash…',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.send_rounded),
                      tooltip: 'Search',
                      onPressed: () => _onSearch(_searchCtrl.text),
                    ),
                    IconButton(
                      icon: const Icon(Icons.clear),
                      tooltip: 'Clear',
                      onPressed: () {
                        _searchCtrl.clear();
                        _onSearch('');
                      },
                    ),
                  ],
                ),
                border: const OutlineInputBorder(),
              ),
              onSubmitted: _onSearch,
            ),
          ),
          Consumer<WarriorSearchProvider>(
            builder: (_, sp, __) {
              if (!sp.hasQuery && !sp.isLoading) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.fromLTRB(12, 6, 12, 0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    sp.isLoading
                        ? 'Searching…'
                        : sp.error ?? 'Results for "${sp.query}"',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 8),
          Expanded(
            child: FutureBuilder<List<WarriorModel>>(
              future: _future,
              builder: (_, snap) {
                if (snap.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snap.hasError) {
                  return Center(child: Text('Error: ${snap.error}'));
                }
                final list = snap.data ?? [];
                if (list.isEmpty) {
                  return const Center(child: Text('No warriors found.'));
                }
                // List view instead of grid
                return ListView.builder(
                  itemCount: list.length,
                  padding: const EdgeInsets.only(bottom: 16),
                  itemBuilder: (_, i) => WarriorCard(warrior: list[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
