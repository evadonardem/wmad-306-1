import 'package:adopt_a_dog/providers/dog_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
        title: const Text('Saved Dogs'),
        backgroundColor: const Color(0xFF2D6A4F),
        foregroundColor: Colors.white,
      ),
      body: Consumer<DogProvider>(
        builder: (context, provider, _) {
          final favs = provider.favoriteImageList;

          if (favs.isEmpty) {
            return const _EmptyFavorites();
          }

          return Column(
            children: [
              // Count bar
              Container(
                width: double.infinity,
                margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2D6A4F).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.favorite_rounded,
                        color: Color(0xFFE53935), size: 18),
                    const SizedBox(width: 8),
                    Text(
                      '${favs.length} photo${favs.length > 1 ? 's' : ''} saved',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1B4332),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),

              // Grid of liked photos
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: favs.length,
                  itemBuilder: (context, index) {
                    final item = favs[index];
                    final imageUrl = item['imageUrl'];
                    final breedName = item['breedName'];

                    if (imageUrl == null ||
                        imageUrl.isEmpty ||
                        breedName == null ||
                        breedName.isEmpty) {
                      return const SizedBox.shrink();
                    }

                    return _FavoritePhotoCard(
                      imageUrl: imageUrl,
                      breedName: breedName,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: Consumer<DogProvider>(
        builder: (context, provider, _) {
          if (provider.favoriteImages.isEmpty) return const SizedBox.shrink();
          return FloatingActionButton.extended(
            onPressed: () => _confirmClear(context, provider),
            backgroundColor: const Color(0xFFE53935),
            foregroundColor: Colors.white,
            icon: const Icon(Icons.delete_rounded),
            label: const Text('Clear All',
                style: TextStyle(fontWeight: FontWeight.w700)),
          );
        },
      ),
    );
  }

  void _confirmClear(BuildContext context, DogProvider provider) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)),
        title: const Text('Clear favorites?',
            style: TextStyle(fontWeight: FontWeight.w800)),
        content: const Text('This will remove all your saved photos.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              provider.clearAllFavorites();
              Navigator.pop(ctx);
            },
            style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFFE53935)),
            child: const Text('Clear All'),
          ),
        ],
      ),
    );
  }
}

// ── Photo Card ───────────────────────────────────────────────────────────────

class _FavoritePhotoCard extends StatelessWidget {
  final String imageUrl;
  final String breedName;

  const _FavoritePhotoCard(
      {required this.imageUrl, required this.breedName});

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Photo
        ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: SizedBox.expand(
            child: Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(
                color: const Color(0xFFE8F5E9),
                child: const Icon(Icons.pets_rounded,
                    color: Color(0xFF95D5B2), size: 40),
              ),
            ),
          ),
        ),

        // Gradient + breed name at bottom
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(18)),
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [
                  Colors.black.withOpacity(0.65),
                  Colors.transparent,
                ],
              ),
            ),
            child: Text(
              _capitalize(breedName),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w800,
                fontSize: 13,
                shadows: [
                  Shadow(blurRadius: 4, color: Colors.black54),
                ],
              ),
            ),
          ),
        ),

        // Unlike button (top-right)
        Positioned(
          top: 8,
          right: 8,
          child: GestureDetector(
            onTap: () => context
                .read<DogProvider>()
                .toggleImageFavorite(imageUrl, breedName),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Color(0xFFE53935),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.favorite_rounded,
                  color: Colors.white, size: 16),
            ),
          ),
        ),
      ],
    );
  }
}

// ── Empty state ───────────────────────────────────────────────────────────────

class _EmptyFavorites extends StatelessWidget {
  const _EmptyFavorites();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Color(0xFFE8F5E9),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.favorite_border_rounded,
                size: 52, color: Color(0xFF2D6A4F)),
          ),
          const SizedBox(height: 20),
          const Text(
            'No favorites yet',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1B4332),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Save the dogs you love and come back to them anytime',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey, fontSize: 14),
          ),
        ],
      ),
    );
  }
}
