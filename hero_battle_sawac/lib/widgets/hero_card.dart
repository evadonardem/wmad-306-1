import 'package:flutter/material.dart';

import '../models/hero_model.dart';
import 'hero_portrait.dart';

class HeroCard extends StatelessWidget {
	const HeroCard({
		super.key,
		required this.hero,
		required this.isInDeck,
		required this.onTap,
		required this.onToggleDeck,
	});

	final HeroModel hero;
	final bool isInDeck;
	final VoidCallback onTap;
	final VoidCallback onToggleDeck;

	@override
	Widget build(BuildContext context) {
		final theme = Theme.of(context);
		final isDark = theme.brightness == Brightness.dark;
		final alignment = hero.biography.alignment.toLowerCase();
		final badgeColor = switch (alignment) {
			'good' => const Color(0xFF16A34A),
			'bad' => const Color(0xFFDC2626),
			_ => const Color(0xFF64748B),
		};
		final cardColor = isDark ? const Color(0xFF121A2B) : const Color(0xFFFFFCF8);
		final titleColor = isDark ? null : const Color(0xFF111827);
		final subtitleColor = isDark ? null : const Color(0xFF475569);

		return Card(
			clipBehavior: Clip.antiAlias,
			elevation: 0,
			color: cardColor,
			shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
			child: InkWell(
				onTap: onTap,
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.start,
					children: [
						Stack(
							children: [
								AspectRatio(
									aspectRatio: 16 / 10,
									child: HeroPortrait(
										hero: hero,
										padding: const EdgeInsets.all(2),
									),
								),
								Positioned(
									left: 10,
									top: 10,
									child: Container(
										padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
										decoration: BoxDecoration(
											color: badgeColor,
											borderRadius: BorderRadius.circular(999),
										),
										child: Text(
											alignment.toUpperCase(),
											style: const TextStyle(
												color: Colors.white,
												fontWeight: FontWeight.w700,
												fontSize: 11,
											),
										),
									),
								),
							],
						),
						Expanded(
							child: Padding(
								padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
								child: Column(
									crossAxisAlignment: CrossAxisAlignment.start,
									children: [
										Text(
											hero.name,
											maxLines: 1,
											overflow: TextOverflow.ellipsis,
												style: theme.textTheme.titleMedium?.copyWith(
													fontWeight: FontWeight.w800,
													color: titleColor,
												),
										),
										const SizedBox(height: 2),
										Text(
											hero.biography.publisher,
											maxLines: 1,
											overflow: TextOverflow.ellipsis,
												style: theme.textTheme.bodySmall?.copyWith(color: subtitleColor),
										),
										const SizedBox(height: 10),
										Wrap(
											spacing: 6,
											runSpacing: 6,
											children: [
												_MiniStat(label: 'INT', value: hero.powerstats.intelligence),
												_MiniStat(label: 'STR', value: hero.powerstats.strength),
												_MiniStat(label: 'SPD', value: hero.powerstats.speed),
												_MiniStat(label: 'DUR', value: hero.powerstats.durability),
												_MiniStat(label: 'PWR', value: hero.powerstats.power),
												_MiniStat(label: 'CMB', value: hero.powerstats.combat),
											],
										),
										const Spacer(),
										Row(
											children: [
												Expanded(
													child: FilledButton.tonalIcon(
														onPressed: onToggleDeck,
														icon: Icon(isInDeck ? Icons.remove : Icons.add),
														label: Text(isInDeck ? 'Remove' : 'Deck'),
													),
												),
												const SizedBox(width: 8),
												IconButton.filledTonal(
													onPressed: onTap,
													icon: const Icon(Icons.arrow_forward),
												),
											],
										),
									],
								),
							),
						),
					],
				),
			),
		);
	}
}

class _MiniStat extends StatelessWidget {
	const _MiniStat({required this.label, required this.value});

	final String label;
	final int value;

	@override
	Widget build(BuildContext context) {
		return Container(
			padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
			decoration: BoxDecoration(
					color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1F2937) : const Color(0xFFE8DDCC),
				borderRadius: BorderRadius.circular(999),
			),
			child: Text(
				'$label $value',
				style: Theme.of(context).textTheme.labelSmall?.copyWith(
							fontWeight: FontWeight.w700,
							letterSpacing: 0.25,
						),
			),
		);
	}
}
