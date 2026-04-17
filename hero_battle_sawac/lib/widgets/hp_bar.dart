import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
	const HpBar({
		super.key,
		required this.value,
		this.height = 8,
		this.showLabel = true,
	});

	final int value;
	final double height;
	final bool showLabel;

	@override
	Widget build(BuildContext context) {
		final normalized = value.clamp(0, 100) / 100.0;
		final isDark = Theme.of(context).brightness == Brightness.dark;
		final fillColor = Color.lerp(const Color(0xFF4F46E5), const Color(0xFF10B981), normalized)!;
		final glowColor = Color.lerp(const Color(0xFF8B5CF6), const Color(0xFF22D3EE), normalized)!;
		final frameColor = isDark ? const Color(0xFF5F6A79) : const Color(0xFF9A8F82);
		final trackColor = isDark ? const Color(0xFF1D2736) : const Color(0xFFE7DED0);

		return Column(
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				Container(
					padding: const EdgeInsets.all(2),
					decoration: BoxDecoration(
						borderRadius: BorderRadius.circular(999),
						gradient: LinearGradient(
							begin: Alignment.topLeft,
							end: Alignment.bottomRight,
							colors: [
								frameColor.withValues(alpha: 0.95),
								frameColor.withValues(alpha: 0.55),
							],
						),
						border: Border.all(color: glowColor.withValues(alpha: 0.35), width: 1.1),
						boxShadow: [
							BoxShadow(color: glowColor.withValues(alpha: 0.14), blurRadius: 10, spreadRadius: 0.5),
						],
					),
					child: ClipRRect(
						borderRadius: BorderRadius.circular(999),
						child: Stack(
							children: [
								Container(height: height, color: trackColor),
								FractionallySizedBox(
									widthFactor: normalized,
									child: Container(
										height: height,
										decoration: BoxDecoration(
											gradient: LinearGradient(
												begin: Alignment.centerLeft,
												end: Alignment.centerRight,
												colors: [fillColor.withValues(alpha: 0.9), fillColor, glowColor],
											),
											boxShadow: [
												BoxShadow(color: glowColor.withValues(alpha: 0.28), blurRadius: 8, spreadRadius: -1),
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
				),
				if (showLabel)
					Padding(
						padding: const EdgeInsets.only(top: 4),
						child: Text(
							'$value/100',
							style: Theme.of(context).textTheme.labelSmall?.copyWith(
								fontWeight: FontWeight.w700,
								letterSpacing: 0.2,
							),
						),
					),
			],
		);
	}
}