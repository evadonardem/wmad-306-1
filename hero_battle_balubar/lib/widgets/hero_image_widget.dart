import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:hero_battle/models/hero_model.dart';

/// In-memory image cache so each hero image is fetched only once.
final Map<String, Uint8List> _imageCache = {};

/// A hero image widget that fetches images from the akabab/superhero-api CDN
/// since superherodb.com blocks direct image requests.
class HeroImageWidget extends StatefulWidget {
  final HeroModel hero;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  const HeroImageWidget({
    super.key,
    required this.hero,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
  });

  @override
  State<HeroImageWidget> createState() => _HeroImageWidgetState();
}

class _HeroImageWidgetState extends State<HeroImageWidget> {
  Uint8List? _imageBytes;
  bool _isLoading = true;
  bool _hasFailed = false;

  static final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    responseType: ResponseType.bytes,
  ));

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  @override
  void didUpdateWidget(HeroImageWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.hero.id != widget.hero.id) {
      _loadImage();
    }
  }

  /// Convert hero name to URL slug: lowercase, spaces → hyphens, strip special chars.
  String _toSlug(String name) {
    return name
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\s-]'), '')
        .trim()
        .replaceAll(RegExp(r'\s+'), '-');
  }

  Future<void> _loadImage() async {
    final heroId = widget.hero.id;
    final cacheKey = 'hero_$heroId';

    if (_imageCache.containsKey(cacheKey)) {
      if (mounted) {
        setState(() {
          _imageBytes = _imageCache[cacheKey];
          _isLoading = false;
          _hasFailed = false;
        });
      }
      return;
    }

    if (mounted) setState(() { _isLoading = true; _hasFailed = false; });

    final slug = _toSlug(widget.hero.name);

    // Try CDN with slug (most reliable source)
    Uint8List? bytes = await _fetchBytes(
      'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/$heroId-$slug.jpg',
    );

    // Fallback: try sm size
    bytes ??= await _fetchBytes(
      'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/$heroId-$slug.jpg',
    );

    // Fallback: try the original API URL
    if (bytes == null && widget.hero.image.url.isNotEmpty) {
      bytes = await _fetchBytes(widget.hero.image.url);
    }

    if (bytes != null) {
      _imageCache[cacheKey] = bytes;
    }

    if (mounted) {
      setState(() {
        _imageBytes = bytes;
        _isLoading = false;
        _hasFailed = bytes == null;
      });
    }
  }

  Future<Uint8List?> _fetchBytes(String url) async {
    try {
      final response = await _dio.get<List<int>>(url);
      if (response.statusCode == 200 && response.data != null) {
        return Uint8List.fromList(response.data!);
      }
    } catch (_) {
      // Fetch failed – will try fallback
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final rarity = widget.hero.getRarity();
    final rarityColor = Color(int.parse('0xFF${rarity.color}'));

    if (_isLoading) {
      return _buildLoading(rarityColor);
    }

    if (_hasFailed || _imageBytes == null) {
      return _buildFallback(rarityColor, _getInitials(widget.hero.name));
    }

    return ClipRRect(
      borderRadius: widget.borderRadius ?? BorderRadius.zero,
      child: Image.memory(
        _imageBytes!,
        width: widget.width,
        height: widget.height,
        fit: widget.fit,
        gaplessPlayback: true,
      ),
    );
  }

  Widget _buildLoading(Color color) {
    return Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withValues(alpha: 0.3),
            color.withValues(alpha: 0.1),
          ],
        ),
      ),
      child: const Center(
        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white54),
      ),
    );
  }

  Widget _buildFallback(Color rarityColor, String initials) {
    return Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            rarityColor.withValues(alpha: 0.6),
            rarityColor.withValues(alpha: 0.2),
            Theme.of(context).scaffoldBackgroundColor,
          ],
          stops: const [0.0, 0.5, 1.0],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shield,
              color: rarityColor.withValues(alpha: 0.5),
              size: (widget.width ?? 80) * 0.3,
            ),
            const SizedBox(height: 4),
            Text(
              initials,
              style: TextStyle(
                color: Colors.white,
                fontSize: (widget.width ?? 80) * 0.2,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                shadows: [
                  Shadow(
                    color: rarityColor,
                    blurRadius: 10,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getInitials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.length >= 2
        ? name.substring(0, 2).toUpperCase()
        : name.toUpperCase();
  }
}
