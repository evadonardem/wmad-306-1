import 'package:flutter/material.dart';

void showAdoptionApplicationSheet(BuildContext context, String breedName) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => AdoptionApplicationSheet(breedName: breedName),
  );
}

class AdoptionApplicationSheet extends StatefulWidget {
  final String breedName;

  const AdoptionApplicationSheet({super.key, required this.breedName});

  @override
  State<AdoptionApplicationSheet> createState() =>
      _AdoptionApplicationSheetState();
}

class _AdoptionApplicationSheetState extends State<AdoptionApplicationSheet> {
  final _formKey = GlobalKey<FormState>();
  int _step = 0;

  // Step 1 – Personal info
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  // Step 2 – Home
  String _dwelling = 'House';
  bool _hasYard = false;
  bool _hasPets = false;

  // Step 3 – Experience
  bool _hasDogExperience = false;
  final _whyController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _whyController.dispose();
    super.dispose();
  }

  String _capitalize(String text) {
    if (text.isEmpty) return text;
    return '${text[0].toUpperCase()}${text.substring(1)}';
  }

  void _next() {
    if (_step == 2) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _step = 3);
      }
    } else if (_step < 2) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _step++);
      }
    }
  }

  void _back() {
    if (_step > 0 && _step < 3) setState(() => _step--);
  }

  String _stepTitle() {
    switch (_step) {
      case 0:
        return 'Your Information';
      case 1:
        return 'Your Home';
      case 2:
        return 'About You';
      case 3:
        return 'Application Submitted!';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.88,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFD0D9D5),
                  borderRadius: BorderRadius.circular(99),
                ),
              ),
              // Header row
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 14, 8, 0),
                child: Row(
                  children: [
                    if (_step > 0 && _step < 3)
                      IconButton(
                        onPressed: _back,
                        icon: const Icon(Icons.arrow_back_rounded),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    if (_step > 0 && _step < 3) const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _stepTitle(),
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF153E31),
                            ),
                          ),
                          if (_step < 3)
                            Text(
                              'Adopting a ${_capitalize(widget.breedName)} · Step ${_step + 1} of 3',
                              style: const TextStyle(
                                color: Color(0xFF627A72),
                                fontSize: 13,
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (_step < 3)
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close_rounded),
                      ),
                  ],
                ),
              ),
              // Progress bar
              if (_step < 3) ...[
                const SizedBox(height: 10),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: LinearProgressIndicator(
                    value: (_step + 1) / 3,
                    backgroundColor: const Color(0xFFEAF3EE),
                    color: const Color(0xFF1F6A50),
                    borderRadius: BorderRadius.circular(99),
                    minHeight: 6,
                  ),
                ),
              ],
              const SizedBox(height: 14),
              // Scrollable content
              Expanded(
                child: Form(
                  key: _formKey,
                  child: SingleChildScrollView(
                    controller: scrollController,
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
                    child: _buildStep(),
                  ),
                ),
              ),
              // Bottom CTA
              if (_step < 3)
                SafeArea(
                  top: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                    child: SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: _next,
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF1F6A50),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: Text(
                          _step == 2 ? 'Submit Application' : 'Continue',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 0:
        return _buildPersonalInfo();
      case 1:
        return _buildHomeInfo();
      case 2:
        return _buildExperience();
      case 3:
        return _buildSuccess();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildPersonalInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "We'll use this to keep you updated on your application.",
          style: TextStyle(color: Color(0xFF627A72), height: 1.4),
        ),
        const SizedBox(height: 20),
        TextFormField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Full Name',
            prefixIcon: Icon(Icons.person_outline_rounded),
          ),
          textCapitalization: TextCapitalization.words,
          validator: (v) =>
              v == null || v.trim().isEmpty ? 'Name is required' : null,
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email Address',
            prefixIcon: Icon(Icons.email_outlined),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (v) {
            if (v == null || v.trim().isEmpty) return 'Email is required';
            if (!v.contains('@') || !v.contains('.')) {
              return 'Enter a valid email';
            }
            return null;
          },
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone Number',
            prefixIcon: Icon(Icons.phone_outlined),
          ),
          keyboardType: TextInputType.phone,
          validator: (v) =>
              v == null || v.trim().isEmpty ? 'Phone is required' : null,
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildHomeInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Help us understand your living situation.',
          style: TextStyle(color: Color(0xFF627A72), height: 1.4),
        ),
        const SizedBox(height: 20),
        const Text(
          'Home Type',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: Color(0xFF153E31),
          ),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['House', 'Apartment', 'Condo', 'Townhouse'].map((type) {
            final selected = _dwelling == type;
            return GestureDetector(
              onTap: () => setState(() => _dwelling = type),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: selected ? const Color(0xFF1F6A50) : Colors.white,
                  borderRadius: BorderRadius.circular(99),
                  border: Border.all(
                    color: selected
                        ? const Color(0xFF1F6A50)
                        : const Color(0xFFD2E2DB),
                  ),
                ),
                child: Text(
                  type,
                  style: TextStyle(
                    color: selected ? Colors.white : const Color(0xFF46685C),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),
        _SwitchRow(
          label: 'I have a yard or outdoor space',
          icon: Icons.yard_outlined,
          value: _hasYard,
          onChanged: (v) => setState(() => _hasYard = v),
        ),
        const SizedBox(height: 12),
        _SwitchRow(
          label: 'I have other pets at home',
          icon: Icons.pets_rounded,
          value: _hasPets,
          onChanged: (v) => setState(() => _hasPets = v),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildExperience() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tell us a bit more about yourself.',
          style: TextStyle(color: Color(0xFF627A72), height: 1.4),
        ),
        const SizedBox(height: 20),
        _SwitchRow(
          label: 'I have experience owning dogs',
          icon: Icons.star_outline_rounded,
          value: _hasDogExperience,
          onChanged: (v) => setState(() => _hasDogExperience = v),
        ),
        const SizedBox(height: 20),
        TextFormField(
          controller: _whyController,
          decoration: InputDecoration(
            labelText:
                'Why do you want to adopt a ${_capitalize(widget.breedName)}?',
            alignLabelWithHint: true,
            prefixIcon: const Padding(
              padding: EdgeInsets.only(bottom: 64),
              child: Icon(Icons.edit_note_rounded),
            ),
          ),
          maxLines: 4,
          textCapitalization: TextCapitalization.sentences,
          validator: (v) => v == null || v.trim().length < 10
              ? 'Please tell us a bit more (at least 10 characters)'
              : null,
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildSuccess() {
    return Column(
      children: [
        const SizedBox(height: 10),
        Container(
          width: 80,
          height: 80,
          decoration: const BoxDecoration(
            color: Color(0xFFEAF3EE),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check_circle_rounded,
            color: Color(0xFF1F6A50),
            size: 46,
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'Application Sent!',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: Color(0xFF153E31),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          "Your application for a ${_capitalize(widget.breedName)} has been received. "
          "We'll reach out to ${_nameController.text} at ${_emailController.text} within 2–3 business days.",
          textAlign: TextAlign.center,
          style: const TextStyle(
              color: Color(0xFF627A72), height: 1.5, fontSize: 15),
        ),
        const SizedBox(height: 24),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFEAF3EE),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Application Summary',
                style: TextStyle(
                    fontWeight: FontWeight.w800, color: Color(0xFF153E31)),
              ),
              const SizedBox(height: 10),
              _SummaryRow(label: 'Name', value: _nameController.text),
              _SummaryRow(label: 'Email', value: _emailController.text),
              _SummaryRow(label: 'Phone', value: _phoneController.text),
              _SummaryRow(
                  label: 'Home',
                  value: '$_dwelling${_hasYard ? ' with yard' : ''}'),
              _SummaryRow(label: 'Other pets', value: _hasPets ? 'Yes' : 'No'),
              _SummaryRow(
                  label: 'Dog experience',
                  value: _hasDogExperience ? 'Yes' : 'No'),
            ],
          ),
        ),
        const SizedBox(height: 24),
        SafeArea(
          top: false,
          child: SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => Navigator.pop(context),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF1F6A50),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text(
                'Done',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _SwitchRow extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SwitchRow({
    required this.label,
    required this.icon,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAF9),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFD2E2DB)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF1F6A50), size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Color(0xFF153E31),
              ),
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: const Color(0xFF1F6A50),
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;

  const _SummaryRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(
                  color: Color(0xFF627A72), fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                  color: Color(0xFF153E31), fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }
}
