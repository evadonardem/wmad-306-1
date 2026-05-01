import 'package:flutter/material.dart';

class SubBreedChips extends StatelessWidget {
  final List<String> subBreeds;
  final String selectedSubBreed;
  final ValueChanged<String?> onSubBreedSelected;

  const SubBreedChips({
    super.key,
    required this.subBreeds,
    required this.selectedSubBreed,
    required this.onSubBreedSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Color(0xFFF0F0F0)),
        ),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          children: [
            _buildChip(
              label: 'All Breeds',
              isSelected: selectedSubBreed.isEmpty,
              onTap: () => onSubBreedSelected(null),
            ),
            const SizedBox(width: 12),
            ...subBreeds.map((subBreed) => Padding(
              padding: const EdgeInsets.only(right: 12),
              child: _buildChip(
                label: subBreed,
                isSelected: selectedSubBreed == subBreed,
                onTap: () => onSubBreedSelected(subBreed),
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6B4EFF) : Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: isSelected ? const Color(0xFF6B4EFF) : const Color(0xFFE0E0E0),
            width: 1.5,
          ),
        ),
        child: Text(
          label[0].toUpperCase() + label.substring(1),
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF6B4EFF),
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}