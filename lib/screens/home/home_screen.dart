import 'package:flutter/material.dart';
import '../../services/superhero_service.dart';
import 'package:provider/provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../widgets/hero_card.dart';
import '../../models/hero_model.dart';
import '../../models/power_stats.dart';
import '../../services/superhero_api_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _alignment = 'all';
  String _publisher = 'all';
  String _sort = 'A-Z';
  double _minPower = 0;
  final TextEditingController _searchController = TextEditingController();
  late Future<List<HeroModel>> _heroesFuture;
  List<HeroModel> _allHeroes = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _heroesFuture = SuperheroApiService.fetchFamousHeroes();
    _heroesFuture.then((heroes) {
      setState(() {
        _allHeroes = heroes;
      });
    });
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFFDE6F2), // pastel pink
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                children: [
                  Text(
                    'Hero Battle',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: const Color(0xFFE573C7), // pink
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(
                      Icons.people_alt_rounded,
                      color: Color(0xFFBA68C8), // lavender
                    ),
                    onPressed: () => Navigator.pushNamed(context, '/deck'),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(
                      Icons.account_circle_rounded,
                      color: Color(0xFFE573C7), // pink
                    ),
                    onPressed: () => Navigator.pushNamed(context, '/profile'),
                  ),
                ],
              ),
            ),
            // Search & Filter Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(color: Color(0xFFE573C7)),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFFF8BBD0), // lighter pink
                        hintText: 'Search hero by name',
                        hintStyle: const TextStyle(color: Color(0xFFBA68C8)),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18),
                          borderSide: BorderSide.none,
                        ),
                        prefixIcon: const Icon(
                          Icons.search,
                          color: Color(0xFFBA68C8),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE573C7),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 16,
                      ),
                    ),
                    onPressed: () {
                      setState(() {
                        _searchQuery = _searchController.text;
                      });
                    },
                    child: const Icon(Icons.arrow_forward_rounded),
                  ),
                ],
              ),
            ),
            // Filters (Alignment, Publisher, Sort, Min Power, Reset)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
              child: Row(
                children: [
                  _FilterDropdown(
                    label: 'Alignment',
                    items: const ['all', 'good', 'bad', 'neutral'],
                    value: _alignment,
                    onChanged: (val) => setState(() => _alignment = val!),
                    dropdownColor: const Color(0xFFF8BBD0),
                    textColor: const Color(0xFFE573C7),
                  ),
                  const SizedBox(width: 8),
                  _FilterDropdown(
                    label: 'Publisher',
                    items: const [
                      'all',
                      'Marvel Comics',
                      'DC Comics',
                      'Dark Horse Comics',
                    ],
                    value: _publisher,
                    onChanged: (val) => setState(() => _publisher = val!),
                    dropdownColor: const Color(0xFFF8BBD0),
                    textColor: const Color(0xFFE573C7),
                  ),
                  const SizedBox(width: 8),
                  _FilterDropdown(
                    label: 'Sort Name',
                    items: const ['A-Z', 'Z-A'],
                    value: _sort,
                    onChanged: (val) => setState(() => _sort = val!),
                    dropdownColor: const Color(0xFFF8BBD0),
                    textColor: const Color(0xFFE573C7),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Row(
                      children: [
                        const Text(
                          'Min power:',
                          style: TextStyle(color: Colors.white70),
                        ),
                        Expanded(
                          child: Slider(
                            value: _minPower,
                            min: 0,
                            max: 100,
                            divisions: 10,
                            onChanged: (v) => setState(() => _minPower = v),
                            activeColor: Colors.deepPurpleAccent,
                            inactiveColor: Colors.white24,
                          ),
                        ),
                        TextButton(
                          onPressed: () => setState(() {
                            _alignment = 'all';
                            _publisher = 'all';
                            _sort = 'A-Z';
                            _minPower = 0;
                          }),
                          child: const Text(
                            'Reset',
                            style: TextStyle(color: Colors.white70),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            // Hero Grid
            Expanded(
              child: _allHeroes.isEmpty
                  ? FutureBuilder<List<HeroModel>>(
                      future: _heroesFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState != ConnectionState.done) {
                          return const Center(
                            child: CircularProgressIndicator(
                              color: Colors.deepPurpleAccent,
                            ),
                          );
                        }
                        if (snapshot.hasError) {
                          return Center(
                            child: Text(
                              'Error: \\${snapshot.error}',
                              style: const TextStyle(color: Colors.redAccent),
                            ),
                          );
                        }
                        final heroes = snapshot.data ?? [];
                        _allHeroes = heroes;
                        return _HeroGrid(heroes: _filterAndSort(_allHeroes));
                      },
                    )
                  : _HeroGrid(heroes: _filterAndSort(_allHeroes)),
            ),
          ],
        ),
      ),
    );
  }
}

// Modern filter dropdown widget
class _FilterDropdown extends StatelessWidget {
  final String label;
  final List<String> items;
  final String value;
  final ValueChanged<String?> onChanged;
  final Color? dropdownColor;
  final Color? textColor;

  const _FilterDropdown({
    required this.label,
    required this.items,
    required this.value,
    required this.onChanged,
    this.dropdownColor,
    this.textColor,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: value,
      items: items
          .map(
            (item) => DropdownMenuItem<String>(
              value: item,
              child: Text(item, style: TextStyle(color: textColor)),
            ),
          )
          .toList(),
      onChanged: onChanged,
      dropdownColor: dropdownColor,
      style: TextStyle(color: textColor),
      underline: Container(),
    );
  }
}

// Move filter/sort logic into _HomeScreenState
class _HeroGrid extends StatelessWidget {
  final List<HeroModel> heroes;
  const _HeroGrid({required this.heroes});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 0),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 250,
        childAspectRatio: 0.62,
        crossAxisSpacing: 18,
        mainAxisSpacing: 0,
      ),
      itemCount: heroes.length,
      itemBuilder: (context, index) {
        final hero = heroes[index];
        return HeroCard(hero: hero);
      },
    );
  }
}

// (No asset placeholder needed. Fallback is a visible network image.)

// Move filter/sort logic inside _HomeScreenState
extension _HomeScreenStateFilter on _HomeScreenState {
  List<HeroModel> _filterAndSort(List<HeroModel> heroes) {
    var filtered = heroes.where((h) {
      final matchesAlignment =
          _alignment == 'all' || (h.alignment == _alignment);
      final matchesPublisher =
          _publisher == 'all' || (h.publisher == _publisher);
      final matchesPower = h.powerStats.power >= _minPower;
      final matchesSearch =
          _searchQuery.isEmpty ||
          h.name.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesAlignment &&
          matchesPublisher &&
          matchesPower &&
          matchesSearch;
    }).toList();
    filtered.sort((a, b) {
      int cmp = a.name.toLowerCase().compareTo(b.name.toLowerCase());
      return _sort == 'A-Z' ? cmp : -cmp;
    });
    return filtered;
  }
}

// (Removed duplicate HeroGrid class. Use _HeroGrid only.)
