import 'package:flutter/material.dart';

void main() {
  runApp(const SuenoFlutterApp());
}

class SuenoFlutterApp extends StatelessWidget {
  const SuenoFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Sueno' Flutter App",
      theme: ThemeData(
        primarySwatch: Colors.green,
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            fontFamily: 'Georgia',
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
      ),
      home: const NatureHomePage(),
    );
  }
}

class NatureHomePage extends StatefulWidget {
  const NatureHomePage({super.key});

  @override
  State<NatureHomePage> createState() => _NatureHomePageState();
}

class _NatureHomePageState extends State<NatureHomePage> {
  int _counter = 1;
  double _fontSize = 40;

  void _increaseCounter() {
    setState(() {
      if (_counter < 50) {
        _counter++;
        _fontSize += 2; // enlarge text
      }
    });
  }

  void _decreaseCounter() {
    setState(() {
      if (_counter > 1) {
        _counter--;
        _fontSize -= 2; // shrink text
      }
    });
  }

  void _resetCounter() {
    setState(() {
      _counter = 1;
      _fontSize = 40;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.green.shade50,
      appBar: AppBar(
        backgroundColor: Colors.green.shade200,
        centerTitle: true,
        title: const Text("Sueno' Flutter App"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 20),
            Image.asset(
              'assets/ds_logo.png',
              height: _fontSize * 2,
              width: _fontSize * 2,
            ),
            const SizedBox(height: 20),
            Text(
              '$_counter',
              style: TextStyle(
                fontSize: _fontSize,
                fontWeight: FontWeight.bold,
                color: Colors.green.shade700,
              ),
            ),
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: _decreaseCounter,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal.shade300,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text("Decrease"),
                ),
                const SizedBox(width: 20),
                ElevatedButton(
                  onPressed: _increaseCounter,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal.shade600,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text("Increase"),
                ),
                const SizedBox(width: 20),
                ElevatedButton(
                  onPressed: _resetCounter,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade400,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text("Reset"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
