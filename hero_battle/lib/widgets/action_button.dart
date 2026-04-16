import 'package:flutter/material.dart';

class ActionButton extends StatelessWidget {
  final String label;
  final String description;
  final VoidCallback onPressed;
  final bool isEnabled;
  final Color? color;
  final IconData? icon;

  const ActionButton({
    super.key,
    required this.label,
    required this.description,
    required this.onPressed,
    this.isEnabled = true,
    this.color,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final buttonColor = color ?? Colors.purple;

    return GestureDetector(
      onTap: isEnabled ? onPressed : null,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isEnabled ? buttonColor : Colors.grey[600]!,
            width: 2,
          ),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isEnabled
                ? [
                    buttonColor.withValues(alpha: 0.3),
                    buttonColor.withValues(alpha: 0.1),
                  ]
                : [
                    Colors.grey[700]!,
                    Colors.grey[800]!,
                  ],
          ),
          boxShadow: isEnabled
              ? [
                  BoxShadow(
                    color: buttonColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : [],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null)
                Icon(
                  icon,
                  color: isEnabled ? buttonColor : Colors.grey[600],
                  size: 22,
                ),
              const SizedBox(height: 2),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isEnabled ? Colors.white : Colors.grey[500],
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 1),
              Text(
                description,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isEnabled ? Colors.grey[300] : Colors.grey[600],
                  fontSize: 9,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
