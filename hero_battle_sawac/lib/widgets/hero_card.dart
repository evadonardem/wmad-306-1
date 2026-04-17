import 'dart:async';

import 'package:flutter/material.dart';

import '../models/hero_model.dart';
import 'hero_portrait.dart';
import 'hp_bar.dart';

class HeroCard extends StatefulWidget {
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
	State<HeroCard> createState() => _HeroCardState();
}

class _HeroCardState extends State<HeroCard> {
	Timer? _hoverTimer;
	bool _showFullStats = false;
	bool _touchExpanded = false;

	void _startHoverTimer() {
		_hoverTimer?.cancel();
		_hoverTimer = Timer(const Duration(seconds: 1), () {
			if (!mounted) {
				return;
			}
			setState(() => _showFullStats = true);
		});
	}

	void _endHover() {
		_hoverTimer?.cancel();
		if (_showFullStats && !_touchExpanded) {
			setState(() => _showFullStats = false);
		}
	}

	void _onLongPressStart() {
		_hoverTimer?.cancel();
		if (!_showFullStats || !_touchExpanded) {
			setState(() {
				_touchExpanded = true;
				_showFullStats = true;
			});
		}
	}

	void _onLongPressEnd() {
		if (_touchExpanded || _showFullStats) {
			setState(() {
				_touchExpanded = false;
				_showFullStats = false;
			});
		}
	}

	@override
	void dispose() {
		_hoverTimer?.cancel();
		super.dispose();
	}

	@override
	Widget build(BuildContext context) {
		final theme = Theme.of(context);
		final isDark = theme.brightness == Brightness.dark;
		final alignment = widget.hero.biography.alignment.toLowerCase();
		final badgeColor = switch (alignment) {
			'good' => const Color(0xFFD4AF37),
			'bad' => const Color(0xFFCD7F32),
			_ => const Color(0xFFC0C0C0),
		};
		final cardColor = isDark ? const Color(0xFF121A2B) : const Color(0xFFFFFCF8);
		final titleColor = isDark ? null : const Color(0xFF111827);
		final subtitleColor = isDark ? null : const Color(0xFF475569);
		final combat = widget.hero.powerstats.combat;

		return MouseRegion(
			onEnter: (_) => _startHoverTimer(),
			onExit: (_) => _endHover(),
			child: GestureDetector(
				onLongPressStart: (_) => _onLongPressStart(),
				onLongPressEnd: (_) => _onLongPressEnd(),
				onLongPressCancel: _onLongPressEnd,
				child: Card(
					clipBehavior: Clip.antiAlias,
					elevation: 0,
					color: cardColor,
					shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
					child: InkWell(
						onTap: widget.onTap,
						child: Column(
						crossAxisAlignment: CrossAxisAlignment.start,
						children: [
							Stack(
								children: [
									AspectRatio(
										aspectRatio: 16 / 10,
										child: HeroPortrait(
											hero: widget.hero,
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
												widget.hero.name,
												maxLines: 1,
												overflow: TextOverflow.ellipsis,
												style: theme.textTheme.titleMedium?.copyWith(
													fontWeight: FontWeight.w800,
													color: titleColor,
												),
											),
											const SizedBox(height: 2),
											Text(
												widget.hero.biography.publisher,
												maxLines: 1,
												overflow: TextOverflow.ellipsis,
												style: theme.textTheme.bodySmall?.copyWith(color: subtitleColor),
											),
											const SizedBox(height: 10),
											AnimatedCrossFade(
												duration: const Duration(milliseconds: 220),
												crossFadeState: _showFullStats ? CrossFadeState.showSecond : CrossFadeState.showFirst,
												firstChild: _CompactCombatStat(value: combat),
												secondChild: Wrap(
													spacing: 8,
													runSpacing: 8,
													children: [
														_SilhouetteStat(label: 'INT', value: widget.hero.powerstats.intelligence),
														_SilhouetteStat(label: 'STR', value: widget.hero.powerstats.strength),
														_SilhouetteStat(label: 'SPD', value: widget.hero.powerstats.speed),
														_SilhouetteStat(label: 'DUR', value: widget.hero.powerstats.durability),
														_SilhouetteStat(label: 'PWR', value: widget.hero.powerstats.power),
														_SilhouetteStat(label: 'CMB', value: widget.hero.powerstats.combat),
													],
												),
											),
											const Spacer(),
											Row(
												children: [
													Expanded(
														child: FilledButton.tonalIcon(
															onPressed: widget.onToggleDeck,
															icon: Icon(widget.isInDeck ? Icons.remove : Icons.add),
															label: Text(widget.isInDeck ? 'Remove' : 'Deck'),
														),
													),
													const SizedBox(width: 8),
													IconButton.filledTonal(
														onPressed: widget.onTap,
														icon: const Icon(Icons.menu_book_rounded),
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
				),
			),
		);
	}
}

class _CompactCombatStat extends StatelessWidget {
	const _CompactCombatStat({required this.value});

	final int value;

	@override
	Widget build(BuildContext context) {
		return Column(
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				Text(
					'Combat Power',
					style: Theme.of(context).textTheme.labelMedium?.copyWith(
						fontWeight: FontWeight.w800,
						letterSpacing: 0.25,
					),
				),
				const SizedBox(height: 6),
				HpBar(value: value, height: 10, showLabel: false),
				const SizedBox(height: 4),
				Text(
					'CMB $value/100',
					style: Theme.of(context).textTheme.labelSmall?.copyWith(fontWeight: FontWeight.w700),
				),
			],
		);
	}
}

class _SilhouetteStat extends StatelessWidget {
	const _SilhouetteStat({required this.label, required this.value});

	final String label;
	final int value;

	@override
	Widget build(BuildContext context) {
		return SizedBox(
			width: 110,
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Text(
						label,
						style: Theme.of(context).textTheme.labelSmall?.copyWith(
							fontWeight: FontWeight.w800,
							letterSpacing: 0.45,
							color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFFD7E0F2) : const Color(0xFF334155),
						),
					),
					const SizedBox(height: 5),
					HpBar(
						value: value,
						height: 9,
						showLabel: false,
					),
				],
			),
		);
	}
}
