import 'package:flutter/material.dart';

class HPBar extends StatefulWidget {
  final int currentHP;
  final int maxHP;
  final String heroName;
  final bool isPlayer;
  final Color? color;

  const HPBar({
    super.key,
    required this.currentHP,
    required this.maxHP,
    required this.heroName,
    required this.isPlayer,
    this.color,
  });

  @override
  State<HPBar> createState() => _HPBarState();
}

class _HPBarState extends State<HPBar> with TickerProviderStateMixin {
  late AnimationController _damageController;
  int? _previousHP;

  @override
  void initState() {
    super.initState();
    _damageController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _previousHP = widget.currentHP;
  }

  @override
  void didUpdateWidget(HPBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentHP != widget.currentHP) {
      _previousHP = oldWidget.currentHP;
      _damageController.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _damageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hpPercentage = (widget.currentHP / widget.maxHP).clamp(0.0, 1.0);
    final color = widget.color ?? (hpPercentage > 0.5 ? Colors.green : hpPercentage > 0.2 ? Colors.orange : Colors.red);

    return Column(
      crossAxisAlignment: widget.isPlayer ? CrossAxisAlignment.start : CrossAxisAlignment.end,
      children: [
        Text(
          widget.heroName,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: widget.isPlayer ? MainAxisAlignment.start : MainAxisAlignment.end,
          children: [
            if (!widget.isPlayer) _buildHPText(),
            const SizedBox(width: 12),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  height: 24,
                  decoration: BoxDecoration(
                    border: Border.all(color: color, width: 2),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: color.withValues(alpha: 0.3),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      // Background
                      Container(
                        color: Colors.grey[800],
                      ),

                      // HP bar with animation
                      AnimatedBuilder(
                        animation: _damageController,
                        builder: (context, child) {
                          return ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: LinearProgressIndicator(
                              value: hpPercentage,
                              backgroundColor: Colors.transparent,
                              valueColor: AlwaysStoppedAnimation(color),
                              minHeight: 24,
                            ),
                          );
                        },
                      ),

                      // Damage flash effect
                      if (_previousHP != null && _previousHP! > widget.currentHP)
                        AnimatedBuilder(
                          animation: _damageController,
                          builder: (context, child) {
                            return Container(
                              color: Colors.red.withValues(alpha: (1 - _damageController.value) * 0.3),
                            );
                          },
                        ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            if (widget.isPlayer) _buildHPText(),
          ],
        ),
      ],
    );
  }

  Widget _buildHPText() {
    return Text(
      '${widget.currentHP}/${widget.maxHP}',
      style: const TextStyle(
        color: Colors.white,
        fontSize: 12,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
