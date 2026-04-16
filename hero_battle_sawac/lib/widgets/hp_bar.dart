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
		final color = Color.lerp(const Color(0xFFFF5D5D), const Color(0xFF22C55E), normalized)!;

		return Column(
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				ClipRRect(
					borderRadius: BorderRadius.circular(999),
					child: LinearProgressIndicator(
						minHeight: height,
						value: normalized,
						color: color,
						backgroundColor: color.withValues(alpha: 0.18),
					),
				),
				if (showLabel)
					Padding(
						padding: const EdgeInsets.only(top: 4),
						child: Text('$value/100', style: Theme.of(context).textTheme.labelSmall),
					),
			],
		);
	}
}
