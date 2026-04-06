import 'package:cached_network_image/cached_network_image.dart';
import 'package:adopt_a_dog/design/design_system.dart';
import 'package:flutter/material.dart';

class DogNetworkImage extends StatelessWidget {
  final String url;
  final BoxFit fit;
  final Widget? placeholder;

  const DogNetworkImage({
    super.key,
    required this.url,
    this.fit = BoxFit.cover,
    this.placeholder,
  });

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: url,
      fit: fit,
      errorWidget: (context, _, error) {
        return placeholder ??
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    DesignSystem.imagePlaceholder,
                    DesignSystem.surfaceStrong,
                  ],
                ),
              ),
              child: const Center(
                child: Icon(
                  Icons.broken_image,
                  color: DesignSystem.imageErrorIcon,
                ),
              ),
            );
      },
      placeholder: (context, _) {
        return placeholder ??
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    DesignSystem.imagePlaceholder,
                    DesignSystem.surfaceStrong,
                  ],
                ),
              ),
              child: const Center(
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation(DesignSystem.darkBrown),
                ),
              ),
            );
      },
    );
  }
}
