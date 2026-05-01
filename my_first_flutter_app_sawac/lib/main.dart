import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sawac Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color.fromARGB(255, 255, 255, 255),
        ),
      ),
      home: const MyHomePage(title: 'My First Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  VideoPlayerController? _videoController;
  Future<void>? _videoInitFuture;

  @override
  void dispose() {
    _disposeVideo();
    super.dispose();
  }

  void _initializeVideo() {
    _videoController = VideoPlayerController.asset(
      'assets/videos/milestone.mp4',
    )..setLooping(true);

    _videoInitFuture = _videoController!.initialize().then((_) {
      setState(() {});
      _videoController?.play();
    });
  }

  void _disposeVideo() {
    _videoInitFuture = null;
    _videoController?.dispose();
    _videoController = null;
  }

  void _updateVideoState() {
    if (_counter == 67) {
      if (_videoController == null) {
        _initializeVideo();
      }
    } else {
      if (_videoController != null) {
        _disposeVideo();
      }
    }
  }

  void _incrementCounter() {
    setState(() {
      _counter++;
      _updateVideoState();
    });
  }

  void _decrementCounter() {
    setState(() {
      if (_counter > 0) {
        _counter--;
      }
      _updateVideoState();
    });
  }

  void _resetCounter() {
    setState(() {
      _counter = 0;
      _updateVideoState();
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isAtMilestone = _counter == 67;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text('Click The Plus Button to Increment'),
              const SizedBox(height: 8),
              if (isAtMilestone) ...[
                const Text(
                  '67!!!!',
                  style: TextStyle(fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                _buildMilestoneVideo(),
              ] else ...[
                Text(
                  '$_counter',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ],
              const SizedBox(height: 16),
              const SizedBox(height: 20),
              Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FloatingActionButton.small(
                    onPressed: _counter > 0 ? _decrementCounter : null,
                    tooltip: 'Decrement',
                    child: const Icon(Icons.remove),
                  ),
                  const SizedBox(width: 12),
                  FloatingActionButton.small(
                    onPressed: _resetCounter,
                    tooltip: 'Reset',
                    child: const Icon(Icons.refresh),
                  ),
                  const SizedBox(width: 12),
                  FloatingActionButton(
                    onPressed: _incrementCounter,
                    tooltip: 'Increment',
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMilestoneVideo() {
    return SizedBox(
      height: 240,
      width: 320,
      child: FutureBuilder<void>(
        future: _videoInitFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_videoController == null ||
              !_videoController!.value.isInitialized) {
            return const Center(
              child: Text(
                'Unable to load video. Make sure assets/videos/milestone.mp4 is a valid video file.',
                textAlign: TextAlign.center,
              ),
            );
          }

          if (_videoController!.value.hasError) {
            return Center(
              child: Text(
                'Video error: ${_videoController!.value.errorDescription}',
                textAlign: TextAlign.center,
              ),
            );
          }

          final aspect = _videoController!.value.aspectRatio;
          return AspectRatio(
            aspectRatio: aspect > 0 ? aspect : 16 / 9,
            child: VideoPlayer(_videoController!),
          );
        },
      ),
    );
  }
}
