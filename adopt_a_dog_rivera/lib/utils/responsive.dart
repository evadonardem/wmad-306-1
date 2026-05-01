import 'package:flutter/material.dart';

/// Utility helpers for responsive layouts.
///
/// `calculateGridCount` returns a reasonable number of columns for a grid
/// based on available width. It attempts to fit items with roughly
/// [minItemWidth] and clamps the result between [minCount] and [maxCount].
int calculateGridCount(
  BuildContext context, {
  double minItemWidth = 240,
  int minCount = 2,
  int maxCount = 6,
}) {
  final width = MediaQuery.of(context).size.width;
  final count = (width / minItemWidth).floor();
  if (count < minCount) return minCount;
  if (count > maxCount) return maxCount;
  return count;
}
