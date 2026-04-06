import 'package:flutter/material.dart';
import '../models/dog.dart';
import '../services/dog_management_service.dart';

class DogFormScreen extends StatefulWidget {
  final Dog? existingDog;
  final String shelterId;

  const DogFormScreen({
    super.key,
    this.existingDog,
    required this.shelterId,
  });

  @override
  State<DogFormScreen> createState() => _DogFormScreenState();
}

class _DogFormScreenState extends State<DogFormScreen> {
  late final DogManagementService _dogService;
  late final GlobalKey<FormState> _formKey;

  // Form controllers
  late TextEditingController _nameController;
  late TextEditingController _breedController;
  late TextEditingController _ageController;
  late TextEditingController _weightController;
  late TextEditingController _descriptionController;
  late TextEditingController _colorController;

  // Dropdown selections
  String _gender = 'male';
  String _energyLevel = 'medium';
  String _maintenanceLevel = 'medium';
  String _healthStatus = 'healthy';

  // Multi-select arrays
  List<String> _subBreeds = [];
  List<String> _vaccinations = [];
  List<String> _behaviors = [];

  bool _isAvailable = true;

  // Common options
  static const List<String> genderOptions = ['male', 'female'];
  static const List<String> energyLevelOptions = ['low', 'medium', 'high'];
  static const List<String> maintenanceLevelOptions = [
    'low',
    'medium',
    'high'
  ];
  static const List<String> healthStatusOptions = [
    'healthy',
    'special-needs',
    'recovering'
  ];
  static const List<String> vaccinationOptions = [
    'rabies',
    'distemper',
    'parvovirus',
    'bordetella',
    'leptospirosis',
    'heartworm',
    'flea-tick',
    'microchip'
  ];
  static const List<String> behaviorOptions = [
    'friendly',
    'playful',
    'protective',
    'calm',
    'energetic',
    'shy',
    'social',
    'independent',
    'good-with-kids',
    'good-with-dogs'
  ];

  @override
  void initState() {
    super.initState();
    _dogService = DogManagementService();
    _formKey = GlobalKey<FormState>();

    _nameController = TextEditingController();
    _breedController = TextEditingController();
    _ageController = TextEditingController();
    _weightController = TextEditingController();
    _descriptionController = TextEditingController();
    _colorController = TextEditingController();

    if (widget.existingDog != null) {
      _populateFormFromDog(widget.existingDog!);
    }
  }

  void _populateFormFromDog(Dog dog) {
    _nameController.text = dog.name;
    _breedController.text = dog.breed;
    _ageController.text = dog.age?.toString() ?? '';
    _weightController.text = dog.weight?.toString() ?? '';
    _descriptionController.text = dog.description ?? '';
    _colorController.text = dog.color ?? '';

    _subBreeds = List.from(dog.subBreeds);
    _gender = dog.gender ?? 'male';
    _energyLevel = dog.energyLevel;
    _maintenanceLevel = dog.maintenanceLevel;
    _healthStatus = dog.healthStatus;
    _vaccinations = List.from(dog.vaccinations);
    _behaviors = List.from(dog.behaviors);
    _isAvailable = dog.isAvailable ?? true;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _breedController.dispose();
    _ageController.dispose();
    _weightController.dispose();
    _descriptionController.dispose();
    _colorController.dispose();
    super.dispose();
  }

  Future<void> _saveDog() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    try {
      final dog = Dog(
        id: widget.existingDog?.id ?? '',
        name: _nameController.text.trim(),
        breed: _breedController.text.trim(),
        subBreeds: _subBreeds,
        age: int.tryParse(_ageController.text),
        description: _descriptionController.text.trim(),
        imageUrls: widget.existingDog?.imageUrls ?? [],
        shelterId: widget.shelterId,
        energyLevel: _energyLevel,
        maintenanceLevel: _maintenanceLevel,
        healthStatus: _healthStatus,
        vaccinations: _vaccinations,
        gender: _gender,
        weight: double.tryParse(_weightController.text),
        color: _colorController.text.trim(),
        behaviors: _behaviors,
        adoptionPending: widget.existingDog?.adoptionPending ?? false,
        adoptedAt: widget.existingDog?.adoptedAt,
        createdAt: widget.existingDog?.createdAt ?? DateTime.now(),
        isAvailable: _isAvailable,
      );

      if (widget.existingDog != null) {
        await _dogService.updateDog(widget.existingDog!.id ?? '', dog);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Dog profile updated successfully!')),
          );
        }
      } else {
        final dogId = await _dogService.createDog(
          shelterId: widget.shelterId,
          dog: dog,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Dog listing created successfully!')),
          );
          Navigator.pop(context, dogId);
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving dog: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.existingDog != null ? 'Edit Dog Profile' : 'Add New Dog'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Basic Information Section
                _buildSectionTitle('Basic Information'),
                const SizedBox(height: 12),

                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Dog Name *',
                    hintText: 'e.g., Max, Bella',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.pets),
                  ),
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Please enter dog name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                TextFormField(
                  controller: _breedController,
                  decoration: const InputDecoration(
                    labelText: 'Primary Breed *',
                    hintText: 'e.g., Labrador Retriever',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.category),
                  ),
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Please enter breed';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),

                _buildSubBreedInput(),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _ageController,
                        decoration: const InputDecoration(
                          labelText: 'Age (months)',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.calendar_today),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value?.isEmpty ?? true) return null;
                          if (int.tryParse(value!) == null) {
                            return 'Enter valid number';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _gender,
                        decoration: const InputDecoration(
                          labelText: 'Gender *',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.wc),
                        ),
                        items: genderOptions
                            .map((g) => DropdownMenuItem(
                                  value: g,
                                  child: Text(
                                    g.capitalize(),
                                  ),
                                ))
                            .toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => _gender = value);
                          }
                        },
                        validator: (value) {
                          if (value == null) {
                            return 'Select gender';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _weightController,
                        decoration: const InputDecoration(
                          labelText: 'Weight (kg)',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.scale),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value?.isEmpty ?? true) return null;
                          if (double.tryParse(value!) == null) {
                            return 'Enter valid number';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _colorController,
                        decoration: const InputDecoration(
                          labelText: 'Color',
                          hintText: 'e.g., Brown, Black',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.palette),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                TextFormField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description *',
                    hintText: 'Tell us about this dog...',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.description),
                  ),
                  maxLines: 4,
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Please enter description';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Personality Section
                _buildSectionTitle('Personality & Traits'),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _energyLevel,
                        decoration: const InputDecoration(
                          labelText: 'Energy Level *',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.bolt),
                        ),
                        items: energyLevelOptions
                            .map((e) => DropdownMenuItem(
                                  value: e,
                                  child: Text(e.capitalize()),
                                ))
                            .toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => _energyLevel = value);
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _maintenanceLevel,
                        decoration: const InputDecoration(
                          labelText: 'Maintenance *',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.build),
                        ),
                        items: maintenanceLevelOptions
                            .map((m) => DropdownMenuItem(
                                  value: m,
                                  child: Text(m.capitalize()),
                                ))
                            .toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => _maintenanceLevel = value);
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                _buildBehaviorSelector(),
                const SizedBox(height: 24),

                // Health Section
                _buildSectionTitle('Health Information'),
                const SizedBox(height: 12),

                DropdownButtonFormField<String>(
                  initialValue: _healthStatus,
                  decoration: const InputDecoration(
                    labelText: 'Health Status *',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.local_hospital),
                  ),
                  items: healthStatusOptions
                      .map((h) => DropdownMenuItem(
                            value: h,
                            child: Text(h.capitalize()),
                          ))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _healthStatus = value);
                    }
                  },
                ),
                const SizedBox(height: 12),

                _buildVaccinationSelector(),
                const SizedBox(height: 24),

                // Availability Section
                _buildSectionTitle('Availability'),
                const SizedBox(height: 12),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Available for Adoption'),
                        Switch(
                          value: _isAvailable,
                          onChanged: (value) {
                            setState(() => _isAvailable = value);
                          },
                          activeThumbColor: const Color(0xFF7C51C2),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _saveDog,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF7C51C2),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: Text(
                          widget.existingDog != null ? 'Update' : 'Create',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF7C51C2),
          ),
    );
  }

  Widget _buildSubBreedInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Sub-breeds (Optional)'),
        const SizedBox(height: 8),
        if (_subBreeds.isNotEmpty)
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _subBreeds
                .map((breed) => Chip(
                      label: Text(breed),
                      onDeleted: () {
                        setState(() => _subBreeds.remove(breed));
                      },
                      backgroundColor: const Color(0xFF7C51C2).withOpacity(0.1),
                    ))
                .toList(),
          ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Add sub-breed',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
                items: const [
                  DropdownMenuItem(
                    value: '',
                    child: Text('Select to add...'),
                  ),
                ],
                onChanged: (value) {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBehaviorSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Behaviors (Select all that apply)'),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: behaviorOptions
              .map((behavior) => FilterChip(
                    label: Text(behavior.capitalize()),
                    selected: _behaviors.contains(behavior),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _behaviors.add(behavior);
                        } else {
                          _behaviors.remove(behavior);
                        }
                      });
                    },
                    backgroundColor:
                        const Color(0xFF7C51C2).withOpacity(0.1),
                    selectedColor:
                        const Color(0xFF7C51C2).withOpacity(0.3),
                  ))
              .toList(),
        ),
      ],
    );
  }

  Widget _buildVaccinationSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Vaccinations (Select all that apply)'),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: vaccinationOptions
              .map((vaccination) => FilterChip(
                    label: Text(vaccination.capitalize()),
                    selected: _vaccinations.contains(vaccination),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _vaccinations.add(vaccination);
                        } else {
                          _vaccinations.remove(vaccination);
                        }
                      });
                    },
                    backgroundColor: Colors.green.withOpacity(0.1),
                    selectedColor: Colors.green.withOpacity(0.3),
                  ))
              .toList(),
        ),
      ],
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).replaceAll('-', ' ')}';
  }
}
