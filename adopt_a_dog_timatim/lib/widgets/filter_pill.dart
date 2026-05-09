import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Rounded capsule filter button. Two states (active / inactive) animate
/// between background and text colours.
class FilterPill extends StatelessWidget {
  const FilterPill({
    super.key,
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: active ? colorScheme.primary : Colors.transparent,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(
          color: active ? colorScheme.primary : colorScheme.outlineVariant,
          width: 1.2,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(30),
          onTap: () {
            HapticFeedback.selectionClick();
            onTap();
          },
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
            child: AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 220),
              style: TextStyle(
                color: active ? colorScheme.onPrimary : colorScheme.onSurfaceVariant,
                fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                fontSize: 14,
              ),
              child: Text(label),
            ),
          ),
        ),
      ),
    );
  }
}
