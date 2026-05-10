// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:greeting_app/main.dart';

void main() {
  testWidgets('Greeting changes smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GreetingApp());

    // Verify that the initial greeting is shown.
    expect(find.text('Tap the button to get a greeting!'), findsOneWidget);

    // Tap the 'Get a Greeting' button and trigger a frame.
    await tester.tap(find.byIcon(Icons.shuffle));
    await tester.pump();

    // Verify that the greeting has changed.
    expect(find.text('Tap the button to get a greeting!'), findsNothing);
    // Since it's random, we can't check for a specific greeting, but ensure some text is there.
    expect(find.byType(Text), findsWidgets);
  });
}
