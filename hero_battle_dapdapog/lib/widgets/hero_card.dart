import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'package:hero_battle/models/hero_model.dart';

class HeroCard extends StatelessWidget {
	final HeroModel hero;
	final VoidCallback? onTap;

	const HeroCard({super.key, required this.hero, this.onTap});

	@override
	Widget build(BuildContext context) {
		final theme = Theme.of(context);
		final colorScheme = theme.colorScheme;

		return AnimatedContainer(
			duration: const Duration(milliseconds: 200),
			curve: Curves.easeOut,
			decoration: BoxDecoration(
				borderRadius: BorderRadius.circular(12),
				boxShadow: [
					BoxShadow(
						color: colorScheme.primary.withValues(alpha: 0.08),
						blurRadius: 12,
						offset: const Offset(0, 6),
					),
				],
			),
			child: Card(
				clipBehavior: Clip.antiAlias,
				elevation: 1.5,
				child: InkWell(
					onTap: onTap,
					child: Column(
						crossAxisAlignment: CrossAxisAlignment.stretch,
						children: [
							AspectRatio(
								aspectRatio: 1,
								child: CachedNetworkImage(
									imageUrl: hero.imageUrl,
									fit: BoxFit.cover,
									placeholder: (_, __) => Container(
										color: theme.colorScheme.surfaceContainerHighest,
										child: const Center(child: CircularProgressIndicator()),
									),
									errorWidget: (_, __, ___) => Container(
										color: theme.colorScheme.surfaceContainerHighest,
										child: const Center(child: Icon(Icons.broken_image_outlined, size: 36)),
									),
								),
							),
							Padding(
								padding: const EdgeInsets.all(12),
								child: Column(
									crossAxisAlignment: CrossAxisAlignment.start,
									children: [
										Text(
											hero.name,
											maxLines: 1,
											overflow: TextOverflow.ellipsis,
											style: theme.textTheme.titleMedium?.copyWith(
												fontWeight: FontWeight.w700,
											),
										),
										const SizedBox(height: 4),
										Text('Power ${hero.totalPower}', style: theme.textTheme.bodySmall),
										const SizedBox(height: 8),
										Wrap(
											spacing: 6,
											runSpacing: 6,
											children: [
												_StatChip(label: 'STR', value: hero.strength),
												_StatChip(label: 'SPD', value: hero.speed),
												_StatChip(label: 'COM', value: hero.combat),
											],
										),
									],
								),
							),
						],
					),
				),
			),
		);
	}
}

class _StatChip extends StatelessWidget {
	final String label;
	final int value;

	const _StatChip({required this.label, required this.value});

	@override
	Widget build(BuildContext context) {
		final colorScheme = Theme.of(context).colorScheme;

		return Chip(
			label: Text('$label $value'),
			backgroundColor: colorScheme.secondaryContainer.withValues(alpha: 0.7),
			side: BorderSide(color: colorScheme.outlineVariant),
			visualDensity: VisualDensity.compact,
		);
	}
}
