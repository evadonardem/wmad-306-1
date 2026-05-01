import 'package:flutter/material.dart';
import '../models/breed.dart';
import '../services/dog_api_service.dart';
import 'breed_detail_screen.dart'; // <--- CRITICAL IMPORT
import 'favorites_screen.dart';

class BreedListScreen extends StatefulWidget {
  const BreedListScreen({super.key});

  @override
  State<BreedListScreen> createState() => _BreedListScreenState();
}

class _BreedListScreenState extends State<BreedListScreen> {
  List<Breed> _allBreeds = []; 
  List<Breed> _filteredBreeds = []; 
  bool _isLoading = true;
  
  String _searchQuery = "";
  String _selectedCategory = "All";

  final List<String> _categories = ["All", "Terrier", "Hound", "Retriever", "Spaniel", "Sheepdog"];

  @override
  void initState() {
    super.initState();
    _fetchInitialData();
  }

  void _fetchInitialData() async {
    try {
      final breeds = await DogApiService.fetchBreeds();
      setState(() {
        _allBreeds = breeds;
        _filteredBreeds = breeds;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilter() {
    setState(() {
      _filteredBreeds = _allBreeds.where((breed) {
        final matchesSearch = breed.name.toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesCategory = _selectedCategory == "All" || 
                                breed.name.toLowerCase().contains(_selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Adopt-a-Dog"),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const FavoritesScreen()),
            ).then((_) => setState(() {})),
            icon: const Icon(Icons.favorite),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Search for a breed...",
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                    onChanged: (value) {
                      _searchQuery = value;
                      _applyFilter();
                    },
                  ),
                ),
                SizedBox(
                  height: 50,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final cat = _categories[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4.0),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: _selectedCategory == cat,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategory = selected ? cat : "All";
                              _applyFilter();
                            });
                          },
                        ),
                      );
                    },
                  ),
                ),
                const Divider(),
                Expanded(
                  child: _filteredBreeds.isEmpty
                      ? const Center(child: Text("No dogs match your search."))
                      : ListView.builder(
                          itemCount: _filteredBreeds.length,
                          itemBuilder: (context, index) {
                            final breed = _filteredBreeds[index];
                            return ListTile(
                              title: Text(breed.displayName()),
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => BreedDetailScreen(breed: breed),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}