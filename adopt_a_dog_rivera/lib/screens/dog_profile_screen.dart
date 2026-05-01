import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/dog.dart';
import '../services/dog_management_service.dart';

class DogProfileScreen extends StatefulWidget {
  final String dogId;
  final Dog? initialDog;

  const DogProfileScreen({
    super.key,
    required this.dogId,
    this.initialDog,
  });

  @override
  State<DogProfileScreen> createState() => _DogProfileScreenState();
}

class _DogProfileScreenState extends State<DogProfileScreen> {
  late final DogManagementService _dogService;
  late Stream<Dog?> _dogStream;
  Dog? _currentDog;

  @override
  void initState() {
    super.initState();
    _dogService = DogManagementService();
    _dogStream = _dogService.watchDog(widget.dogId);
    _currentDog = widget.initialDog;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dog Profile'),
        elevation: 0,
      ),
      body: StreamBuilder<Dog?>(
        stream: _dogStream,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Error loading dog profile: ${snapshot.error}'),
            );
          }

          final dog = snapshot.data ?? _currentDog;
          if (dog == null) {
            return const Center(child: Text('Dog not found'));
          }

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image Carousel
                _buildImageCarousel(dog),

                // Dog Info Card
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name and Basic Info
                      _buildNameSection(dog),
                      const SizedBox(height: 24),

                      // Quick Stats
                      _buildQuickStats(dog),
                      const SizedBox(height: 24),

                      // Description
                      _buildDescriptionSection(dog),
                      const SizedBox(height: 24),

                      // Characteristics Grid
                      _buildCharacteristicsGrid(dog),
                      const SizedBox(height: 24),

                      // Health & Vaccination
                      _buildHealthSection(dog),
                      const SizedBox(height: 24),

                      // Behaviors
                      _buildBehaviorsSection(dog),
                      const SizedBox(height: 24),

                      // Adoption Status
                      _buildAdoptionStatusSection(dog),
                      const SizedBox(height: 32),

                      // Action Buttons
                      _buildActionButtons(context, dog),
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

  Widget _buildImageCarousel(Dog dog) {
    final imageUrls = dog.imageUrls.isNotEmpty
        ? dog.imageUrls
        : [
            'https://via.placeholder.com/400x300?text=No+Image',
          ];

    return SizedBox(
      height: 300,
      child: PageView.builder(
        itemCount: imageUrls.length,
        itemBuilder: (context, index) {
          return Container(
            decoration: BoxDecoration(
              color: Colors.grey[300],
            ),
            child: CachedNetworkImage(
              imageUrl: imageUrls[index],
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                color: Colors.grey[300],
                child: const Center(child: CircularProgressIndicator()),
              ),
              errorWidget: (context, url, error) => Container(
                color: Colors.grey[300],
                child: const Center(
                  child: Icon(Icons.image_not_supported, size: 64),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildNameSection(Dog dog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    dog.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF7C51C2),
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${dog.breed}${dog.subBreeds.isNotEmpty ? ' • ${dog.subBreeds.join(", ")}' : ''}',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickStats(Dog dog) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildStatItem(
          icon: Icons.cake,
          label: 'Age',
          value: dog.getAgeDisplay(),
        ),
        _buildStatItem(
          icon: Icons.male,
          label: 'Gender',
          value: _capitalize(dog.gender ?? 'Unknown'),
        ),
        _buildStatItem(
          icon: Icons.monitor_weight,
          label: 'Weight',
          value: dog.weight != null ? '${dog.weight} kg' : 'N/A',
        ),
        _buildStatItem(
          icon: Icons.favorite_border,
          label: 'Color',
          value: dog.color ?? 'Unknown',
        ),
      ],
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF7C51C2), size: 24),
        const SizedBox(height: 8),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[600],
              ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildDescriptionSection(Dog dog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'About',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 8),
        Text(
          dog.description ?? 'No description available',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildCharacteristicsGrid(Dog dog) {
    final characteristics = [
      ('Energy Level', _capitalize(dog.energyLevel), Colors.orange),
      ('Maintenance', _capitalize(dog.maintenanceLevel), Colors.green),
      ('Readiness', '${dog.getAdoptionReadiness()}%', Colors.blue),
      ('Needs', dog.hasSpecialNeeds() ? 'Special Care' : 'Standard', Colors.red),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Characteristics',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: characteristics
              .map(
                (char) => _buildCharacteristicCard(
                  char.$1,
                  char.$2,
                  char.$3,
                ),
              )
              .toList(),
        ),
      ],
    );
  }

  Widget _buildCharacteristicCard(String label, String value, Color color) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: color.withOpacity(0.3), width: 2),
        borderRadius: BorderRadius.circular(8),
        color: color.withOpacity(0.05),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w600,
                ),
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthSection(Dog dog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Health Information',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow('Health Status', _capitalize(dog.healthStatus)),
              const Divider(),
              _buildInfoRow('Vaccinations', dog.vaccinations.join(', ')),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBehaviorsSection(Dog dog) {
    if (dog.behaviors.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Behaviors',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: dog.behaviors
              .map(
                (behavior) => Chip(
                  label: Text(_capitalize(behavior)),
                  backgroundColor: const Color(0xFF7C51C2).withOpacity(0.1),
                  labelStyle: const TextStyle(
                    color: Color(0xFF7C51C2),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              )
              .toList(),
        ),
      ],
    );
  }

  Widget _buildAdoptionStatusSection(Dog dog) {
    Color statusColor;
    String statusText;

    if (!(dog.isAvailable ?? true)) {
      statusColor = Colors.red;
      statusText = 'Adopted';
    } else if (dog.adoptionPending) {
      statusColor = Colors.orange;
      statusText = 'Adoption Pending';
    } else {
      statusColor = Colors.green;
      statusText = 'Available for Adoption';
    }

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        border: Border.all(color: statusColor, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      child: Row(
        children: [
          Icon(
            (dog.isAvailable ?? true)
                ? (dog.adoptionPending ? Icons.schedule : Icons.check_circle)
                : Icons.done_all,
            color: statusColor,
          ),
          const SizedBox(width: 12),
          Text(
            statusText,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: statusColor,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, Dog dog) {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: (dog.isAvailable ?? true)
                ? () {
                    // Navigate to adoption application screen
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Adoption feature coming soon!'),
                      ),
                    );
                  }
                : null,
            icon: const Icon(Icons.favorite),
            label: const Text('Adopt'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
              backgroundColor: const Color(0xFF7C51C2),
              disabledBackgroundColor: Colors.grey[300],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () {
              // Share functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Share feature coming soon!'),
                ),
              );
            },
            icon: const Icon(Icons.share),
            label: const Text('Share'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}

String _capitalize(String value) {
  if (value.isEmpty) return value;
  return '${value[0].toUpperCase()}${value.substring(1)}';
}
