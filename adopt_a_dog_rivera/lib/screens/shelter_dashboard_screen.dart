import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/dog.dart';
import '../services/dog_management_service.dart';
import 'dog_form_screen.dart';
import 'dog_profile_screen.dart';

class ShelterDashboardScreen extends StatefulWidget {
  final String shelterId;
  final String shelterName;

  const ShelterDashboardScreen({
    super.key,
    required this.shelterId,
    required this.shelterName,
  });

  @override
  State<ShelterDashboardScreen> createState() => _ShelterDashboardScreenState();
}

class _ShelterDashboardScreenState extends State<ShelterDashboardScreen>
    with SingleTickerProviderStateMixin {
  late final DogManagementService _dogService;
  late TabController _tabController;
  
  Map<String, dynamic> _stats = {
    'total': 0,
    'available': 0,
    'adopted': 0,
    'pending': 0,
  };

  @override
  void initState() {
    super.initState();
    _dogService = DogManagementService();
    _tabController = TabController(length: 3, vsync: this);
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final stats = await _dogService.getAdoptionStats(widget.shelterId);
      setState(() => _stats = stats);
    } catch (e) {
      debugPrint('Error loading stats: $e');
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Shelter Dashboard'),
            Text(
              widget.shelterName,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                  ),
            ),
          ],
        ),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Statistics Cards
          _buildStatsSection(),

          // Tab navigation
          TabBar(
            controller: _tabController,
            labelColor: const Color(0xFF7C51C2),
            unselectedLabelColor: Colors.grey[600],
            indicatorColor: const Color(0xFF7C51C2),
            tabs: const [
              Tab(icon: Icon(Icons.pets), text: 'All Dogs'),
              Tab(icon: Icon(Icons.check_circle), text: 'Available'),
              Tab(icon: Icon(Icons.schedule), text: 'Pending'),
            ],
          ),

          // Tab content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildAllDogsTab(),
                _buildAvailableDogsTab(),
                _buildPendingDogsTab(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DogFormScreen(
                shelterId: widget.shelterId,
              ),
            ),
          ).then((_) => _loadStats());
        },
        backgroundColor: const Color(0xFF7C51C2),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildStatsSection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Overview',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[600],
                ),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildStatCard('Total Dogs', _stats['total'].toString(), Colors.blue),
                const SizedBox(width: 12),
                _buildStatCard('Available', _stats['available'].toString(), Colors.green),
                const SizedBox(width: 12),
                _buildStatCard('Pending', _stats['pending'].toString(), Colors.orange),
                const SizedBox(width: 12),
                _buildStatCard('Adopted', _stats['adopted'].toString(), Colors.purple),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      width: 100,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color.withOpacity(0.3), width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildAllDogsTab() {
    return StreamBuilder<List<Dog>>(
      stream: _dogService.watchDogsByShelterId(widget.shelterId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('Error loading dogs: ${snapshot.error}'),
          );
        }

        final dogs = snapshot.data ?? [];

        if (dogs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.pets, size: 64, color: Colors.grey),
                const SizedBox(height: 16),
                Text(
                  'No dogs listed yet',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => DogFormScreen(
                          shelterId: widget.shelterId,
                        ),
                      ),
                    ).then((_) => _loadStats());
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Add First Dog'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C51C2),
                  ),
                )
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadStats,
          child: ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: dogs.length,
            itemBuilder: (context, index) {
              final dog = dogs[index];
              return _buildDogListItem(dog);
            },
          ),
        );
      },
    );
  }

  Widget _buildAvailableDogsTab() {
    return StreamBuilder<List<Dog>>(
      stream: _dogService.watchDogsByShelterId(widget.shelterId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final dogs = snapshot.data ?? [];
        final availableDogs = dogs.where((d) => d.isAvailable ?? true).toList();

        if (availableDogs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.check_circle_outline,
                    size: 64, color: Colors.green),
                const SizedBox(height: 16),
                Text(
                  'No available dogs',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadStats,
          child: ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: availableDogs.length,
            itemBuilder: (context, index) {
              final dog = availableDogs[index];
              return _buildDogListItem(dog);
            },
          ),
        );
      },
    );
  }

  Widget _buildPendingDogsTab() {
    return StreamBuilder<List<Dog>>(
      stream: _dogService.watchDogsByShelterId(widget.shelterId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final dogs = snapshot.data ?? [];
        final pendingDogs =
            dogs.where((d) => d.adoptionPending || !(d.isAvailable ?? true)).toList();

        if (pendingDogs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.schedule,
                    size: 64, color: Colors.orange),
                const SizedBox(height: 16),
                Text(
                  'No pending adoptions',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadStats,
          child: ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: pendingDogs.length,
            itemBuilder: (context, index) {
              final dog = pendingDogs[index];
              return _buildDogListItem(dog);
            },
          ),
        );
      },
    );
  }

  Widget _buildDogListItem(Dog dog) {
    Color statusColor;
    String statusLabel;

    if (!(dog.isAvailable ?? true)) {
      statusColor = Colors.red;
      statusLabel = 'Adopted';
    } else if (dog.adoptionPending) {
      statusColor = Colors.orange;
      statusLabel = 'Pending';
    } else {
      statusColor = Colors.green;
      statusLabel = 'Available';
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DogProfileScreen(
                dogId: dog.id ?? '',
                initialDog: dog,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Dog Image
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: SizedBox(
                  width: 80,
                  height: 80,
                  child: CachedNetworkImage(
                    imageUrl: dog.getPrimaryImageUrl() ?? 'https://via.placeholder.com/80x80?text=No+Image',
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.grey[300],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.image_not_supported),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Dog Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      dog.name,
                      style:
                          Theme.of(context).textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      dog.breed,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Chip(
                          label: Text(
                            statusLabel,
                            style: TextStyle(
                              color: statusColor,
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          backgroundColor: statusColor.withOpacity(0.1),
                          side: BorderSide(color: statusColor, width: 1),
                          padding: EdgeInsets.zero,
                        ),
                        const SizedBox(width: 8),
                        Chip(
                          label: Text(
                            dog.getAgeDisplay(),
                            style: const TextStyle(fontSize: 12),
                          ),
                          padding: EdgeInsets.zero,
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Action Buttons
              PopupMenuButton<String>(
                onSelected: (action) async {
                  if (action == 'edit') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => DogFormScreen(
                          shelterId: widget.shelterId,
                          existingDog: dog,
                        ),
                      ),
                    ).then((_) => _loadStats());
                  } else if (action == 'delete') {
                    _showDeleteDialog(dog);
                  } else if (action == 'adopt') {
                    _markAsAdopted(dog);
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit, size: 18),
                        SizedBox(width: 8),
                        Text('Edit'),
                      ],
                    ),
                  ),
                  if ((dog.isAvailable ?? true) && !dog.adoptionPending)
                    const PopupMenuItem(
                      value: 'adopt',
                      child: Row(
                        children: [
                          Icon(Icons.check_circle, size: 18),
                          SizedBox(width: 8),
                          Text('Mark Adopted'),
                        ],
                      ),
                    ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete, size: 18, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Delete', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDeleteDialog(Dog dog) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Dog Listing?'),
        content: Text('Are you sure you want to delete ${dog.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await _dogService.deleteDog(dog.id ?? '');
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Dog listing deleted')),
                  );
                  _loadStats();
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: $e')),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Future<void> _markAsAdopted(Dog dog) async {
    try {
      await _dogService.markDogAsAdopted(dog.id ?? '');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${dog.name} marked as adopted')),
        );
        _loadStats();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }
}
