<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreditsController extends Controller
{
    /**
     * Display the credits page with dragon and fairytale facts.
     */
    public function index(): Response
    {
        $facts = [
            "🐉 Dragons in Chinese mythology are symbols of power, strength, and good luck, unlike their Western counterparts who often guard treasures.",
            "🏰 The oldest known fairy tale is 'The Smith and the Devil,' estimated to be over 6,000 years old, dating back to the Bronze Age.",
            "🐲 The word 'dragon' comes from the ancient Greek word 'drakōn,' which means 'serpent' or 'giant sea fish.'",
            "✨ In Japanese folklore, dragons are water deities called 'Ryū' and are believed to control rainfall and bodies of water.",
            "📖 The Brothers Grimm collected over 200 fairy tales, many of which were much darker in their original versions than the stories we know today.",
            "🗡️ Saint George, the dragon slayer, is the patron saint of England, and his legendary battle symbolizes the triumph of good over evil.",
            "🌟 The concept of 'happily ever after' was popularized by fairy tales, though it rarely appeared in folk tales before the Grimm Brothers.",
            "🐉 In medieval bestiaries, dragons were classified as real animals, believed to live in Ethiopia and India.",
            "👑 The tale of Cinderella has over 500 versions worldwide, with the oldest known version dating back to ancient Greece around 7 BC.",
            "🔥 Dragons breathing fire is a relatively modern addition to their mythology, becoming popular in medieval European literature.",
            "🧚 The word 'fairy' derives from the Latin 'fata,' meaning 'the Fates' - supernatural beings who controlled destiny.",
            "📚 J.R.R. Tolkien's Smaug was inspired by the dragon Fafnir from Norse mythology, who also hoarded gold and was slain by a hero.",
            "🌊 The Loch Ness Monster legend shares characteristics with Scottish water dragon folklore called 'water kelpies.'",
            "✨ In Korean mythology, dragons called 'Yong' were believed to ascend to heaven after 1,000 years of spiritual cultivation.",
            "🏔️ Many European castles have legends of dragons living in nearby caves, often used to explain mysterious disappearances or natural phenomena.",
            "🎭 Fairy tales often contain moral lessons, with the original purpose being to teach children about dangers in the world.",
            "🐉 In Welsh mythology, the red dragon (Y Ddraig Goch) is a symbol of Wales and appears on the national flag.",
            "🌙 The concept of 'true love's kiss' breaking spells became a fairy tale staple through stories like Sleeping Beauty and Snow White.",
            "📜 The oldest recorded dragon myth is from ancient Mesopotamia, featuring Tiamat, a primordial goddess of the salt sea.",
            "🔮 Many fairy tales were originally oral traditions passed down through generations before being written down in the 19th century.",
            "🐲 In Philippine mythology, the Bakunawa is a dragon-like sea serpent that tries to swallow the moon, causing eclipses.",
            "👸 The original Little Mermaid by Hans Christian Andersen had a much darker ending where she turns into sea foam.",
            "🏺 Ancient Greeks believed dragons guarded sacred springs and treasures, including the Golden Fleece.",
            "🌹 'Beauty and the Beast' has roots in the ancient tale of Cupid and Psyche from Roman mythology.",
            "🐉 In Aztec mythology, Quetzalcoatl was a feathered serpent dragon deity associated with wind, air, and learning.",
            "🎪 The Hungarian Horntail, Norwegian Ridgeback, and other dragon species in Harry Potter are inspired by real medieval dragon classifications.",
            "🧙 The archetype of the 'wise old wizard' in fairy tales often represents the child's guide through their journey of self-discovery.",
            "🌟 Dragons appear in the mythology of nearly every culture worldwide, making them one of the few truly universal mythical creatures.",
            "📖 Sleeping Beauty was cursed to sleep for 100 years, and the entire kingdom slept with her, covered in thorny vines.",
            "🗡️ The legendary sword Excalibur was said to have been forged on the Isle of Avalon, a magical realm in Arthurian legend.",
            "🐉 In Hindu mythology, the Naga are dragon-like serpent beings who can take human form and possess great wisdom.",
            "🎭 The Pied Piper of Hamelin is based on a real medieval event where 130 children disappeared from the town in 1284.",
            "🏰 Rapunzel's tower was said to be so tall that her hair had to be 70 feet long to reach the ground.",
            "🔥 In medieval alchemy, dragon's blood was considered a powerful ingredient, though it actually referred to red resin from dragon trees.",
            "🌙 Many cultures believed dragons controlled weather, and ancient emperors would perform rituals to please dragon spirits for good harvests."
        ];

        return Inertia::render('Credits/Index', [
            'facts' => $facts
        ]);
    }
}
