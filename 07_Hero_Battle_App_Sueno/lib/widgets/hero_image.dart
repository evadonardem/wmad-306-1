import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

Widget buildHeroImage(
  String imageUrl,
  String heroName, {
  double? height,
  double? width,
  BoxFit fit = BoxFit.cover,
}) {
  return CachedNetworkImage(
    imageUrl: imageUrl,
    height: height,
    width: width,
    fit: fit,
    placeholder: (context, url) =>
        const Center(child: CircularProgressIndicator()),
    errorWidget: (context, url, error) {
      return Image.network(
        'https://api.dicebear.com/9.x/bottts-neutral/png?seed=$heroName',
        fit: fit,
        height: height,
        width: width,
      );
    },
  );
}
