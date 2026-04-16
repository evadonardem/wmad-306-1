import 'package:flutter/material.dart';

import 'hp_bar.dart';

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
		return Padding(
			padding: const EdgeInsets.symmetric(vertical: 5),
			child: Row(
				children: [
					SizedBox(
						width: 96,
						child: Text(
							label,
							style: Theme.of(context).textTheme.bodySmall?.copyWith(
										fontWeight: FontWeight.w700,
										letterSpacing: 0.2,
									),
						),
					),
					Expanded(child: HpBar(value: value, showLabel: false)),
					const SizedBox(width: 10),
					SizedBox(
						width: 28,
						child: Text(
							'$value',
							textAlign: TextAlign.right,
							style: Theme.of(context)
									.textTheme
									.bodyMedium
									?.copyWith(fontWeight: FontWeight.w700),
						),
					),
				],
			),
		);
	}
}
