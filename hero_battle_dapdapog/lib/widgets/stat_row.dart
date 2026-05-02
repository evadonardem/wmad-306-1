import 'package:flutter/material.dart';

class StatRow extends StatelessWidget {
	final String label;
	final int value;

	const StatRow({super.key, required this.label, required this.value});

	@override
	Widget build(BuildContext context) {
		final theme = Theme.of(context);
		final clampedValue = value.clamp(0, 100);

		return Padding(
			padding: const EdgeInsets.symmetric(vertical: 6),
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Row(
						mainAxisAlignment: MainAxisAlignment.spaceBetween,
						children: [
							Text(label, style: theme.textTheme.titleSmall),
							Text('$clampedValue', style: theme.textTheme.titleSmall),
						],
					),
					const SizedBox(height: 8),
					ClipRRect(
						borderRadius: BorderRadius.circular(999),
						child: LinearProgressIndicator(
							minHeight: 10,
							value: clampedValue / 100,
							backgroundColor: theme.colorScheme.surfaceContainerHighest,
							valueColor: AlwaysStoppedAnimation<Color>(
								Color.lerp(
									theme.colorScheme.secondary,
									theme.colorScheme.primary,
									0.5,
								)!,
							),
						),
					),
				],
			),
		);
	}
}
