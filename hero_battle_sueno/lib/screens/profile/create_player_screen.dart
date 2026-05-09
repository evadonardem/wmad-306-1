import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/player_manager_provider.dart';

class CreatePlayerScreen extends StatefulWidget {
  const CreatePlayerScreen({super.key});

  @override
  State<CreatePlayerScreen> createState() => _CreatePlayerScreenState();
}

class _CreatePlayerScreenState extends State<CreatePlayerScreen> {
  final TextEditingController _controller = TextEditingController();
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final nameNotEmpty = _controller.text.trim().isNotEmpty;
    return Scaffold(
      appBar: AppBar(title: const Text("Create Player")),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextField(
                  controller: _controller,
                  autofocus: true,
                  decoration: InputDecoration(
                    labelText: "Player Name",
                    errorText: _error,
                  ),
                  onChanged: (_) {
                    setState(() {}); // Update Save button state
                    if (_error != null) {
                      setState(() => _error = null);
                    }
                  },
                  onSubmitted: (_) async {
                    await _savePlayer(context);
                  },
                ),

                const SizedBox(height: 20),

                ElevatedButton(
                  onPressed: (!_saving && nameNotEmpty)
                      ? () async {
                          await _savePlayer(context);
                        }
                      : null,
                  child: const Text("Save"),
                ),
              ],
            ),
          ),
          if (_saving)
            Container(
              color: Colors.black.withOpacity(0.3),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  Future<void> _savePlayer(BuildContext context) async {
    final name = _controller.text.trim();

    if (name.isEmpty) {
      setState(() => _error = "Name cannot be empty");
      return;
    }

    setState(() => _saving = true);

    try {
      final provider = context.read<PlayerManagerProvider>();
      await provider.createPlayer(name);
      if (mounted) {
        setState(() => _saving = false);
        // Pop after overlay is removed to avoid freeze
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() => _error = "Failed to save player");
      setState(() => _saving = false);
    }
  }
}
