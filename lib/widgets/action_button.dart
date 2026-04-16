import 'package:flutter/material.dart';

class ActionButton extends StatefulWidget {
  final String label;
  final String description;
  final VoidCallback onPressed;
  final bool isEnabled;
  final Color? color;
  final IconData? icon;

  const ActionButton({
    Key? key,
    required this.label,
    required this.description,
    required this.onPressed,
    this.isEnabled = true,
    this.color,
    this.icon,
  }) : super(key: key);

  @override
  State<ActionButton> createState() => _ActionButtonState();
}

class _ActionButtonState extends State<ActionButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final buttonColor = widget.color ?? Colors.purple;

    return MouseRegion(
      onEnter: widget.isEnabled ? (_) => _controller.forward() : null,
      onExit: widget.isEnabled ? (_) => _controller.reverse() : null,
      child: GestureDetector(
        onTap: widget.isEnabled ? widget.onPressed : null,
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Transform.scale(
              scale: 1.0 + (_controller.value * 0.05),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: widget.isEnabled
                        ? buttonColor
                        : Colors.grey[600]!,
                    width: 2 + (_controller.value * 1),
                  ),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: widget.isEnabled
                        ? [
                            buttonColor.withAlpha(((0.3 + _controller.value * 0.2) * 255).toInt()),
                            buttonColor.withAlpha((0.1 * 255).toInt()),
                          ]
                        : [
                            Colors.grey[700]!,
                            Colors.grey[800]!,
                          ],
                  ),
                  boxShadow: widget.isEnabled
                      ? [
                          BoxShadow(
                            color: buttonColor.withAlpha(
                              0.3 + (_controller.value * 0.3),
                            ),
                            blurRadius: 12 + (_controller.value * 8),
                            spreadRadius: 1,
                          ),
                        ]
                      : [],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.icon != null) ...[
                        Icon(
                          widget.icon,
                          color: widget.isEnabled ? buttonColor : Colors.grey[600],
                          size: 28,
                        ),
                        const SizedBox(height: 4),
                      ],
                      Text(
                        widget.label,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: widget.isEnabled ? Colors.white : Colors.grey[500],
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.description,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: widget.isEnabled
                              ? Colors.grey[300]
                              : Colors.grey[600],
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
