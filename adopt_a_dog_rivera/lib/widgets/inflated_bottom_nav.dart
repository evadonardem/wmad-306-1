import 'package:flutter/material.dart';

class NavBarItem {
  final IconData icon;
  final String label;

  const NavBarItem({required this.icon, required this.label});
}

class InflatedBottomNav extends StatefulWidget {
  final List<NavBarItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;
  final Color backgroundColor;

  const InflatedBottomNav({
    super.key,
    required this.items,
    required this.currentIndex,
    required this.onTap,
    this.backgroundColor = Colors.white,
  });

  @override
  State<InflatedBottomNav> createState() => _InflatedBottomNavState();
}

class _InflatedBottomNavState extends State<InflatedBottomNav> {

  @override
  Widget build(BuildContext context) {
    final bg = widget.backgroundColor;

    return SafeArea(
      top: false,
      child: SizedBox(
        height: 80,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final navWidth = constraints.maxWidth;
              final itemCount = widget.items.length;
              final spacing = 14.0;
              final totalPadding = spacing * (itemCount - 1);
              final itemWidth = (navWidth - totalPadding) / itemCount;
              final bubbleWidth = itemWidth * 0.84;
              final bubbleLeft = widget.currentIndex * (itemWidth + spacing) + (itemWidth - bubbleWidth) / 2;

              return Center(
                child: SizedBox(
                  width: navWidth,
                  child: Stack(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [bg.withOpacity(0.98), bg.withOpacity(0.94)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          borderRadius: BorderRadius.circular(24.0),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 14,
                              offset: const Offset(0, 6),
                            ),
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                      AnimatedPositioned(
                        duration: const Duration(milliseconds: 320),
                        curve: Curves.easeOutCubic,
                        left: bubbleLeft,
                        top: 9,
                        width: bubbleWidth,
                        height: 36,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF7C51C2), Color(0xFFA96BFF)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(18.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.16),
                                blurRadius: 10,
                                offset: const Offset(0, 5),
                              ),
                            ],
                            border: Border.all(
                              color: Colors.white.withOpacity(0.5),
                              width: 1.0,
                            ),
                          ),
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: List.generate(widget.items.length, (i) {
                          final item = widget.items[i];
                          final active = (i == widget.currentIndex);
                          return SizedBox(
                            width: itemWidth,
                            child: GestureDetector(
                              behavior: HitTestBehavior.translucent,
                              onTap: () => widget.onTap(i),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const SizedBox(height: 2),
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 300),
                                    curve: Curves.easeOut,
                                    width: active ? 40 : 36,
                                    height: active ? 40 : 36,
                                    padding: EdgeInsets.all(active ? 8 : 6),
                                    decoration: BoxDecoration(
                                      color: active ? Colors.white : Colors.transparent,
                                      borderRadius: BorderRadius.circular(13.0),
                                      boxShadow: active
                                          ? [
                                              BoxShadow(
                                                color: Colors.black.withOpacity(0.18),
                                                blurRadius: 10,
                                                offset: const Offset(0, 6),
                                              ),
                                            ]
                                          : [
                                              BoxShadow(
                                                color: Colors.black.withOpacity(0.06),
                                                blurRadius: 6,
                                                offset: const Offset(0, 3),
                                              ),
                                            ],
                                    ),
                                    child: Transform(
                                      alignment: Alignment.center,
                                      transform: Matrix4.identity()
                                        ..setEntry(3, 2, 0.001)
                                        ..rotateX(active ? -0.1 : 0.0)
                                        ..rotateZ(active ? 0.02 : 0.0),
                                      child: Icon(
                                        item.icon,
                                        size: active ? 22 : 18,
                                        color: active ? const Color(0xFF7C51C2) : Color(0xFF616161),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item.label,
                                    textAlign: TextAlign.center,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: active ? 9 : 8,
                                      color: active ? const Color(0xFF7C51C2) : Color(0xFF757575),
                                      fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

}
