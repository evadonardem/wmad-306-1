import 'package:flutter/foundation.dart';

class HeroSearchProvider extends ChangeNotifier {
	String _query = '';

	String get query => _query;

	void setQuery(String value) {
		_query = value;
		notifyListeners();
	}

	void clear() {
		_query = '';
		notifyListeners();
	}
}
