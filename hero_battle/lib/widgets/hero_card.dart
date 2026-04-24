import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

String resolveHeroImageUrl(
	String rawUrl, {
	String? heroId,
	String? heroName,
}) {
	final trimmed = rawUrl.trim();
	final hasRawUrl = trimmed.isNotEmpty && trimmed != 'Unknown';
	final unescaped = trimmed.replaceAll(r'\/', '/');

	String normalized = '';
	if (hasRawUrl) {
		if (unescaped.startsWith('//')) {
			normalized = 'https:$unescaped';
		} else if (unescaped.startsWith('http://')) {
			normalized = unescaped.replaceFirst('http://', 'https://');
		} else {
			normalized = unescaped;
		}
	}

	if (kIsWeb) {
		final id = heroId?.trim() ?? '';
		final name = heroName?.trim() ?? '';
		if (id.isNotEmpty && name.isNotEmpty) {
			return normalized;
		}
	}

	return normalized;
}

String _slugifyHeroName(String name) {
	final slug = name
			.toLowerCase()
			.replaceAll(RegExp(r"[^a-z0-9]+"), '-')
			.replaceAll(RegExp(r'-+'), '-')
			.replaceAll(RegExp(r'^-|-$'), '');
	return slug.isEmpty ? 'unknown' : slug;
}

class HeroPortraitCard extends StatelessWidget {
	const HeroPortraitCard({
		super.key,
		required this.imageUrl,
		required this.title,
		this.heroId,
		this.subtitle,
		this.badge,
		this.borderRadius = const BorderRadius.all(Radius.circular(20)),
	});

	final String imageUrl;
	final String title;
	final String? heroId;
	final String? subtitle;
	final Widget? badge;
	final BorderRadius borderRadius;

	@override
	Widget build(BuildContext context) {
		final resolvedImageUrl = resolveHeroImageUrl(
			imageUrl,
			heroId: heroId,
			heroName: title,
		);
		final scheme = Theme.of(context).colorScheme;

		return DecoratedBox(
			decoration: BoxDecoration(
				borderRadius: borderRadius,
				boxShadow: <BoxShadow>[
					BoxShadow(
						color: Colors.black.withValues(alpha: 0.16),
						blurRadius: 18,
						offset: const Offset(0, 10),
					),
				],
			),
			child: ClipRRect(
				borderRadius: borderRadius,
				child: Stack(
					fit: StackFit.expand,
					children: <Widget>[
						Container(
							decoration: BoxDecoration(
								gradient: LinearGradient(
									begin: Alignment.topLeft,
									end: Alignment.bottomRight,
									colors: <Color>[
										scheme.primaryContainer,
										scheme.secondaryContainer,
									],
								),
							),
						),
						if (resolvedImageUrl.isEmpty)
							_HeroFallback(title: title)
						else
							Image.network(
								resolvedImageUrl,
								fit: BoxFit.cover,
								filterQuality: FilterQuality.high,
								webHtmlElementStrategy: WebHtmlElementStrategy.prefer,
								loadingBuilder: (context, child, loadingProgress) {
									if (loadingProgress == null) return child;
									return const Center(child: CircularProgressIndicator());
								},
								errorBuilder: (context, error, stackTrace) {
									return _HeroFallback(title: title);
								},
							),
						DecoratedBox(
							decoration: BoxDecoration(
								gradient: LinearGradient(
									begin: Alignment.topCenter,
									end: Alignment.bottomCenter,
									colors: <Color>[
										Colors.transparent,
										Colors.black.withValues(alpha: 0.64),
									],
								),
							),
						),
						if (badge != null)
							Positioned(
								top: 12,
								left: 12,
								child: badge!,
							),
						Align(
							alignment: Alignment.bottomLeft,
							child: Padding(
								padding: const EdgeInsets.all(14),
								child: Column(
									mainAxisSize: MainAxisSize.min,
									crossAxisAlignment: CrossAxisAlignment.start,
									children: <Widget>[
										Text(
											title,
											maxLines: 2,
											overflow: TextOverflow.ellipsis,
											style: const TextStyle(
												color: Colors.white,
												fontWeight: FontWeight.w800,
												fontSize: 16,
											),
										),
										if (subtitle != null) ...<Widget>[
											const SizedBox(height: 4),
											Text(
												subtitle!,
												maxLines: 2,
												overflow: TextOverflow.ellipsis,
												style: TextStyle(
													color: Colors.white.withValues(alpha: 0.88),
													fontWeight: FontWeight.w500,
													fontSize: 12,
												),
											),
										],
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

class _HeroFallback extends StatelessWidget {
	const _HeroFallback({required this.title});

	final String title;

	@override
	Widget build(BuildContext context) {
		final scheme = Theme.of(context).colorScheme;
		final parts = title
				.trim()
				.split(RegExp(r'\s+'))
				.where((part) => part.isNotEmpty)
				.toList();
		final initials = parts.isEmpty
				? '?'
				: parts.take(2).map((part) => part[0].toUpperCase()).join();

		return Center(
			child: Container(
				width: 78,
				height: 78,
				decoration: BoxDecoration(
					shape: BoxShape.circle,
					color: scheme.onPrimaryContainer.withValues(alpha: 0.16),
					border: Border.all(
						color: Colors.white.withValues(alpha: 0.35),
						width: 1.2,
					),
				),
				alignment: Alignment.center,
				child: Text(
					initials,
					style: TextStyle(
						color: scheme.onPrimaryContainer,
						fontSize: 24,
						fontWeight: FontWeight.w800,
					),
				),
			),
		);
	}
}
