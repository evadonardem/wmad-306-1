import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/dog.dart';

/// Dog card for marketplace view showing all dog context
class DogMarketplaceCard extends StatefulWidget {
  final Dog dog;
  final VoidCallback onTap;
  final VoidCallback? onFavoriteTap;
  final bool isFavorite;
  final double? compatibilityScore;
  final Future<void> Function()? onApplyTap;
  final bool isApplied;

  const DogMarketplaceCard({
    super.key,
    required this.dog,
    required this.onTap,
    this.onFavoriteTap,
    this.isFavorite = false,
    this.compatibilityScore,
    this.onApplyTap,
    this.isApplied = false,
  });

  @override
  State<DogMarketplaceCard> createState() => _DogMarketplaceCardState();
}

class _DogMarketplaceCardState extends State<DogMarketplaceCard> {
  @override
  Widget build(BuildContext context) {
    final hasImage = widget.dog.imageUrls.isNotEmpty;
    
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.all(8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: GestureDetector(
        onTap: widget.onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image Section
            Stack(
              children: [
                Container(
                  height: 220,
                  color: Colors.grey[300],
                  child: hasImage
                      ? CachedNetworkImage(
                          imageUrl: widget.dog.imageUrls.first,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image_not_supported),
                          ),
                        )
                      : Container(
                          color: Colors.grey[300],
                          child: const Icon(
                            Icons.pets,
                            size: 80,
                            color: Colors.grey,
                          ),
                        ),
                )
                ,
                // Favorite Button
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: widget.onFavoriteTap,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(8),
                      child: Icon(
                        widget.isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: widget.isFavorite ? Colors.red : Colors.grey,
                        size: 24,
                      ),
                    ),
                  ),
                ),
                // Popularity Badge
                if (widget.dog.popularity != null)
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.orange,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.trending_up, size: 14, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            '${widget.dog.popularity}% Popular',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
            
            // Dog Info Section
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name and Breed
                  Text(
                    widget.dog.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.dog.breed,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey[600],
                    ),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Compatibility Score
                  if (widget.compatibilityScore != null)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
                      decoration: BoxDecoration(
                        color: _getCompatibilityColor(widget.compatibilityScore!).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _getCompatibilityColor(widget.compatibilityScore!),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.favorite,
                            size: 14,
                            color: _getCompatibilityColor(widget.compatibilityScore!),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${widget.compatibilityScore!.toStringAsFixed(0)}% Match',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: _getCompatibilityColor(widget.compatibilityScore!),
                            ),
                          ),
                        ],
                      ),
                    ),
                  
                  const SizedBox(height: 8),
                  
                  // Quick Info Chips
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      if (widget.dog.age != null)
                        _buildInfoChip(
                          _getAgeDisplay(widget.dog.age!),
                          Icons.calendar_today,
                        ),
                      _buildInfoChip(
                        widget.dog.energyLevel.capitalize(),
                        Icons.flash_on,
                      ),
                      if (widget.dog.gender != null)
                        _buildInfoChip(
                          widget.dog.gender!.capitalize(),
                          widget.dog.gender == 'male' ? Icons.male : Icons.female,
                        ),
                    ],
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Characteristics
                  if (widget.dog.characteristics.isNotEmpty)
                    Wrap(
                      spacing: 4,
                      children: widget.dog.characteristics.take(3).map((char) {
                        return Chip(
                          label: Text(
                            char,
                            style: const TextStyle(fontSize: 10),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          backgroundColor: const Color(0xFF7C51C2).withOpacity(0.1),
                        );
                      }).toList(),
                    ),
                  
                  if (widget.dog.characteristics.isEmpty && widget.dog.behaviors.isNotEmpty)
                    Wrap(
                      spacing: 4,
                      children: widget.dog.behaviors.take(3).map((behavior) {
                        return Chip(
                          label: Text(
                            behavior,
                            style: const TextStyle(fontSize: 10),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          backgroundColor: const Color(0xFF7C51C2).withOpacity(0.1),
                        );
                      }).toList(),
                    ),
                  
                  const SizedBox(height: 8),
                  
                  // Origin and Breed Info
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (widget.dog.origin != null)
                        Flexible(
                          child: Text(
                            '🌍 ${widget.dog.origin}',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      if (widget.dog.breedPercentage != null)
                        Text(
                          '${widget.dog.breedPercentage!.toStringAsFixed(0)}% Pure',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.grey[600],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Actions: Apply (adoption) separate from Favorite
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton.icon(
                        onPressed: widget.isApplied
                            ? null
                            : () => _confirmApply(context),
                        icon: Icon(widget.isApplied ? Icons.check : Icons.send, size: 16),
                        label: Text(widget.isApplied ? 'Applied' : 'Apply'),
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          backgroundColor: widget.isApplied ? Colors.grey[400] : Theme.of(context).primaryColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: Colors.grey[700]),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }

  Color _getCompatibilityColor(double score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.orange;
    return Colors.red;
  }

  String _getAgeDisplay(int months) {
    if (months < 12) return '$months mo';
    final years = months ~/ 12;
    return '$years yr${years > 1 ? 's' : ''}';
  }

  Future<void> _confirmApply(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Apply to adopt ${widget.dog.name}?'),
        content: Text(
          'Submit an adoption application for ${widget.dog.name}? This will notify the shelter and start the application process.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Confirm', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      if (widget.onApplyTap != null) {
        try {
          await widget.onApplyTap!();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Application submitted')),
            );
          }
        } catch (e) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error submitting application: $e')),
            );
          }
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Application confirmed')),
          );
        }
      }
    }
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
