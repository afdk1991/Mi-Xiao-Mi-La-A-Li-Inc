import 'package:flutter/foundation.dart';

class GoodsProvider extends ChangeNotifier {
  List<Map<String, dynamic>> _goodsList = [];
  bool _isLoading = false;

  List<Map<String, dynamic>> get goodsList => _goodsList;
  bool get isLoading => _isLoading;

  Future<void> loadGoods() async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    _goodsList = [
      {'id': 1, 'name': '商品1', 'price': 99.00, 'image': ''},
      {'id': 2, 'name': '商品2', 'price': 199.00, 'image': ''},
      {'id': 3, 'name': '商品3', 'price': 299.00, 'image': ''},
      {'id': 4, 'name': '商品4', 'price': 399.00, 'image': ''},
    ];

    _isLoading = false;
    notifyListeners();
  }
}

class CartProvider extends ChangeNotifier {
  final List<Map<String, dynamic>> _cartList = [];

  List<Map<String, dynamic>> get cartList => _cartList;

  void addToCart(Map<String, dynamic> goods) {
    _cartList.add(goods);
    notifyListeners();
  }

  void removeFromCart(int index) {
    _cartList.removeAt(index);
    notifyListeners();
  }

  void clearCart() {
    _cartList.clear();
    notifyListeners();
  }
}
