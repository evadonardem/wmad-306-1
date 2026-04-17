import 'package:flutter/material.dart';

class StatRow extends StatelessWidget {
	const StatRow({
		super.key,
		required this.label,
		required this.value,
	});

	final String label;
	final int value;

	@override
	Widget build(BuildContext context) {
		final isDark = Theme.of(context).brightness == Brightness.dark;
		final trackColor = isDark ? const Color(0xFF253244) : const Color(0xFFE4D9C8);
		final fillColors = isDark
			? const [Color(0xFF60A5FA), Color(0xFF34D399)]
			: const [Color(0xFF7C3AED), Color(0xFFF59E0B)];

		return Padding(
			padding: const EdgeInsets.symmetric(vertical: 5),
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Text(
						label,
						style: Theme.of(context).textTheme.bodySmall?.copyWith(
							fontWeight: FontWeight.w700,
							letterSpacing: 0.2,
						),
					),
					const SizedBox(height: 6),
					ClipRRect(
						borderRadius: BorderRadius.circular(999),
						child: Stack(
							children: [
								Container(height: 10, color: trackColor),
								FractionallySizedBox(
									widthFactor: value.clamp(0, 100) / 100.0,
									child: Container(
										height: 10,
										decoration: BoxDecoration(
											gradient: LinearGradient(
												begin: Alignment.centerLeft,
												end: Alignment.centerRight,
												colors: fillColors,
											),
											boxShadow: [
												BoxShadow(color: fillColors.last.withValues(alpha: 0.24), blurRadius: 6, spreadRadius: -1),
											],
										),
									),
								),
								Positioned.fill(
									child: DecoratedBox(
										decoration: BoxDecoration(
											gradient: LinearGradient(
												begin: Alignment.topCenter,
												end: Alignment.bottomCenter,
												colors: [Colors.white.withValues(alpha: 0.16), Colors.transparent],
											),
										),
									),
								),
							],
						),
					),
				],
			),
		);
	}
}