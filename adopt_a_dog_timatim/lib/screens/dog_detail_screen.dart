import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../models/dog.dart';
import '../providers/favorites_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/adoption_form_sheet.dart';
import '../widgets/stat_chip.dart';

/// Detail screen with hero image, staggered fade-in body, and adoption CTA.
class DogDetailScreen extends StatefulWidget {
  const DogDetailScreen({super.key, required this.id, required this.summary});

  final String id;
  final DogSummary summary;

  @override
  State<DogDetailScreen> createState() => _DogDetailScreenState();
}

class _DogDetailScreenState extends State<DogDetailScreen>
    with SingleTickerProviderStateMixin {
  late Future<Dog> _dogFuture;
  late final AnimationController _entrance;

  @override
  void initState() {
    super.initState();
    _dogFuture = context.read<ApiService>().fetchDog(widget.id);
    _entrance = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    // Defer until the hero transition has begun so the body slides up *into*
    // place rather than starting in place.
    Future.delayed(const Duration(milliseconds: 240), () {
      if (mounted) _entrance.forward();
    });
  }

  @override
  void dispose() {
    _entrance.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: FutureBuilder<Dog>(
        future: _dogFuture,
        builder: (context, snap) {
          return CustomScrollView(
            slivers: [
              _heroAppBar(context, snap.data),
              if (snap.connectionState != ConnectionState.done)
                const SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(
                    child: CircularProgressIndicator(color: AppColors.forest),
                  ),
                )
              else if (snap.hasError || snap.data == null)
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: _errorState(),
                )
              else
                _body(context, snap.data!),
            ],
          );
        },
      ),
      floatingActionButton: FutureBuilder<Dog>(
        future: _dogFuture,
        builder: (context, snap) {
          if (!snap.hasData) return const SizedBox.shrink();
          return FloatingActionButton.extended(
            onPressed: () {
              HapticFeedback.mediumImpact();
              AdoptionFormSheet.show(context, snap.data!);
            },
            icon: const Icon(Icons.favorite),
            label: Text('Adopt ${snap.data!.name}'),
          );
        },
      ),
    );
  }

  /// Top of the screen: hero image + back/favorite buttons over a soft scrim.
  Widget _heroAppBar(BuildContext context, Dog? dog) {
    final imageUrl = dog?.heroPhoto ?? widget.summary.thumbnailUrl;
    return SliverAppBar(
      expandedHeight: 360,
      pinned: true,
      backgroundColor: AppColors.background,
      elevation: 0,
      leading: _circleIconButton(
        icon: Icons.arrow_back,
        onTap: () => Navigator.of(context).pop(),
      ),
      actions: [
        Consumer<FavoritesProvider>(
          builder: (context, favs, _) => _circleIconButton(
            icon: favs.isFavorite(widget.id)
                ? Icons.favorite
                : Icons.favorite_border,
            color: favs.isFavorite(widget.id) ? AppColors.terracotta : null,
            onTap: () {
              HapticFeedback.lightImpact();
              favs.toggle(widget.id);
            },
          ),
        ),
        const SizedBox(width: 8),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Hero(
          tag: 'dog-photo-${widget.id}',
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(
                imageUrl: imageUrl,
                fit: BoxFit.cover,
                placeholder: (_, _) =>
                    Container(color: AppColors.cardOutline),
                errorWidget: (_, _, _) =>
                    Container(color: AppColors.cardOutline),
              ),
              const DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.center,
                    colors: [Colors.black38, Colors.transparent],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _circleIconButton({
    required IconData icon,
    required VoidCallback onTap,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Material(
        color: Colors.white.withOpacity(0.92),
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Icon(icon, color: color ?? AppColors.ink, size: 22),
          ),
        ),
      ),
    );
  }

  Widget _body(BuildContext context, Dog dog) {
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          _staggered(0, _titleBlock(context, dog)),
          const SizedBox(height: 16),
          _staggered(1, _quickChips(dog)),
          const SizedBox(height: 24),
          _staggered(2, _sectionHeader('About')),
          const SizedBox(height: 8),
          _staggered(
            3,
            Text(
              dog.bio,
              style: const TextStyle(
                color: AppColors.ink,
                height: 1.5,
                fontSize: 15,
              ),
            ),
          ),
          const SizedBox(height: 24),
          _staggered(4, _sectionHeader('Photos')),
          const SizedBox(height: 12),
          _staggered(5, _photoStrip(dog)),
          const SizedBox(height: 24),
          _staggered(6, _sectionHeader('Stats')),
          const SizedBox(height: 12),
          _staggered(7, _statsGrid(dog)),
          const SizedBox(height: 24),
          _staggered(8, _sectionHeader('Compatibility')),
          const SizedBox(height: 12),
          _staggered(9, _compatRow(dog)),
        ]),
      ),
    );
  }

  /// Each child fades + slides up on a staggered delay.
  Widget _staggered(int index, Widget child) {
    return AnimatedBuilder(
      animation: _entrance,
      builder: (context, _) {
        final start = (index * 0.07).clamp(0.0, 0.85);
        final end = (start + 0.5).clamp(0.0, 1.0);
        final t = CurvedAnimation(
          parent: _entrance,
          curve: Interval(start, end, curve: Curves.easeOutCubic),
        ).value;
        return Opacity(
          opacity: t,
          child: Transform.translate(
            offset: Offset(0, 24 * (1 - t)),
            child: child,
          ),
        );
      },
    );
  }

  Widget _titleBlock(BuildContext context, Dog dog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          dog.name,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            const Icon(Icons.location_on_outlined,
                size: 16, color: AppColors.inkSoft),
            const SizedBox(width: 4),
            Text(
              dog.location,
              style: const TextStyle(color: AppColors.inkSoft),
            ),
          ],
        ),
      ],
    );
  }

  Widget _quickChips(Dog dog) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        StatChip(icon: Icons.cake_outlined, label: '${dog.age} years'),
        StatChip(icon: Icons.straighten, label: dog.size),
        StatChip(
          icon: Icons.local_fire_department_outlined,
          label: dog.primaryTrait,
          color: AppColors.terracotta,
        ),
      ],
    );
  }

  Widget _sectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
    );
  }

  Widget _photoStrip(Dog dog) {
    return SizedBox(
      height: 140,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: dog.fullPhotos.length,
        separatorBuilder: (_, _) => const SizedBox(width: 12),
        itemBuilder: (context, i) {
          return ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: CachedNetworkImage(
              imageUrl: dog.fullPhotos[i],
              width: 180,
              height: 140,
              fit: BoxFit.cover,
              placeholder: (_, _) => Container(
                width: 180,
                color: AppColors.cardOutline,
              ),
              errorWidget: (_, _, _) => Container(
                width: 180,
                color: AppColors.cardOutline,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _statsGrid(Dog dog) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        StatChip(
          icon: Icons.monitor_weight_outlined,
          label: '${dog.weight.toStringAsFixed(0)} kg',
        ),
        StatChip(icon: Icons.pets, label: dog.breed),
        StatChip(
          icon: Icons.bolt,
          label: 'Energy ${dog.energyLevel}/5',
          color: AppColors.terracotta,
        ),
      ],
    );
  }

  Widget _compatRow(Dog dog) {
    return Row(
      children: [
        Expanded(
          child: _compatTile(
            icon: Icons.child_care,
            label: 'Kids',
            yes: dog.goodWithKids,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _compatTile(
            icon: Icons.pets,
            label: 'Other dogs',
            yes: dog.goodWithDogs,
          ),
        ),
      ],
    );
  }

  Widget _compatTile({
    required IconData icon,
    required String label,
    required bool yes,
  }) {
    final color = yes ? AppColors.forest : AppColors.inkSoft;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardOutline),
      ),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        color: AppColors.inkSoft, fontSize: 12)),
                Text(
                  yes ? 'Great with' : 'Best alone',
                  style: TextStyle(color: color, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _errorState() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline,
              size: 48, color: AppColors.inkSoft),
          const SizedBox(height: 12),
          const Text(
            "Couldn't load this dog",
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () =>
                setState(() => _dogFuture = context
                    .read<ApiService>()
                    .fetchDog(widget.id)),
            child: const Text('Try again'),
          ),
        ],
      ),
    );
  }
}
