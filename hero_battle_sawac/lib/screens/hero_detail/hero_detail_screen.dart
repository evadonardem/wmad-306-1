import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_portrait.dart';
import '../../widgets/stat_row.dart';

class HeroDetailScreen extends StatefulWidget {
  const HeroDetailScreen({super.key, required this.hero});

  final HeroModel hero;

  @override
  State<HeroDetailScreen> createState() => _HeroDetailScreenState();
}

class _HeroDetailScreenState extends State<HeroDetailScreen> {
  late Future<HeroModel> _futureHero;

  @override
  void initState() {
    super.initState();
    _futureHero = context.read<SuperheroApiService>().getHeroById(widget.hero.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.hero.name)),
      body: FutureBuilder<HeroModel>(
        future: _futureHero,
        builder: (context, snapshot) {
          final hero = snapshot.data ?? widget.hero;

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _HeroDetailBody(hero: hero, errorText: snapshot.error.toString());
          }

          return _HeroDetailBody(hero: hero);
        },
      ),
    );
  }
}

class _HeroDetailBody extends StatelessWidget {
  const _HeroDetailBody({required this.hero, this.errorText});

  final HeroModel hero;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    final imageHeight = (screenWidth * 0.6).clamp(250.0, 600.0);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: [
        SizedBox(
          height: imageHeight,
          child: HeroPortrait(
            hero: hero,
            fit: BoxFit.contain,
            padding: const EdgeInsets.all(6),
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          hero.name,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w900,
              ),
        ),
        const SizedBox(height: 4),
        Text(
          '${hero.biography.publisher} • ${hero.biography.alignment.toUpperCase()}',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        if (errorText != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(
              'Showing cached hero data. $errorText',
              style: const TextStyle(color: Colors.orange),
            ),
          ),
        const SizedBox(height: 14),
        _SectionCard(
          title: 'Powerstats',
          child: Column(
            children: [
              StatRow(label: 'Intelligence', value: hero.powerstats.intelligence),
              StatRow(label: 'Strength', value: hero.powerstats.strength),
              StatRow(label: 'Speed', value: hero.powerstats.speed),
              StatRow(label: 'Durability', value: hero.powerstats.durability),
              StatRow(label: 'Power', value: hero.powerstats.power),
              StatRow(label: 'Combat', value: hero.powerstats.combat),
            ],
          ),
        ),
        const SizedBox(height: 10),
        _SectionCard(
          title: 'Biography',
          child: _Pairs(values: [
            ('Full name', hero.biography.fullName),
            ('Place of birth', hero.biography.placeOfBirth),
            ('First appearance', hero.biography.firstAppearance),
            ('Aliases', hero.biography.aliases.isEmpty ? 'Unknown' : hero.biography.aliases.take(5).join(', ')),
          ]),
        ),
        const SizedBox(height: 10),
        _SectionCard(
          title: 'Appearance',
          child: _Pairs(values: [
            ('Gender', hero.appearance.gender),
            ('Race', hero.appearance.race),
            ('Height', hero.appearance.height.isEmpty ? 'Unknown' : hero.appearance.height.join(' / ')),
            ('Weight', hero.appearance.weight.isEmpty ? 'Unknown' : hero.appearance.weight.join(' / ')),
            ('Eye color', hero.appearance.eyeColor),
            ('Hair color', hero.appearance.hairColor),
          ]),
        ),
        const SizedBox(height: 10),
        _SectionCard(
          title: 'Work & Connections',
          child: _Pairs(values: [
            ('Occupation', hero.work.occupation),
            ('Base', hero.work.base),
            ('Group affiliation', hero.connections.groupAffiliation),
            ('Relatives', hero.connections.relatives),
          ]),
        ),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            child,
          ],
        ),
      ),
    );
  }
}

class _Pairs extends StatelessWidget {
  const _Pairs({required this.values});

  final List<(String, String)> values;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: values
          .map(
            (pair) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: 130,
                    child: Text(
                      pair.$1,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                  Expanded(child: Text(pair.$2)),
                ],
              ),
            ),
          )
          .toList(),
    );
  }
}
