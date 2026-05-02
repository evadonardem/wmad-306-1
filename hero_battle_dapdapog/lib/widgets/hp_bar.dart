import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
	final String label;
	final int current;
	final int max;

	const HpBar({
		super.key,
		required this.label,
		required this.current,
		required this.max,
	});

	@override
	Widget build(BuildContext context) {
		final theme = Theme.of(context);
		final normalized = max == 0 ? 0.0 : (current / max).clamp(0.0, 1.0);

		return Column(
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				Row(
					mainAxisAlignment: MainAxisAlignment.spaceBetween,
					children: [
						Text(label, style: theme.textTheme.titleMedium),
						Text('$current / $max', style: theme.textTheme.bodyMedium),
					],
				),
				const SizedBox(height: 6),
				ClipRRect(
					borderRadius: BorderRadius.circular(999),
					child: TweenAnimationBuilder<double>(
						tween: Tween<double>(begin: 0, end: normalized),
						duration: const Duration(milliseconds: 280),
						curve: Curves.easeOutCubic,
						builder: (context, value, _) {
							return LinearProgressIndicator(
								minHeight: 14,
								value: value,
								backgroundColor: theme.colorScheme.surfaceContainerHighest,
								valueColor: AlwaysStoppedAnimation<Color>(
									current < max * 0.3
										? theme.colorScheme.error
										: theme.colorScheme.primary,
								),
							);
						},
					),
				),
			],
		);
	}
}
