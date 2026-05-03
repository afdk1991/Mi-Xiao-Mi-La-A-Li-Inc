import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  int _currentTab = 0;
  final _accountController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _codeController = TextEditingController();
  final _emailController = TextEditingController();
  bool _isLoading = false;
  String? _errorMsg;
  int _codeCountdown = 0;

  @override
  void dispose() {
    _accountController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _codeController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendCode(String type) async {
    String target = '';
    if (type == 'phone') {
      target = _phoneController.text;
      if (!_isValidPhone(target)) {
        _showError('请输入正确的手机号');
        return;
      }
    } else {
      target = _emailController.text;
      if (!_isValidEmail(target)) {
        _showError('请输入正确的邮箱');
        return;
      }
    }

    try {
      final response = await http.post(
        Uri.parse('/api/auth/send-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(type == 'phone' ? {'phone': target} : {'email': target}),
      );
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        _showSuccess('验证码已发送');
        _startCodeCountdown();
      } else {
        _showError(data['msg'] ?? '发送验证码失败');
      }
    } catch (e) {
      _showError('网络错误');
    }
  }

  void _startCodeCountdown() {
    setState(() {
      _codeCountdown = 60;
    });
    Future.doWhile(() async {
      await Future.delayed(Duration(seconds: 1));
      if (!mounted) return false;
      setState(() {
        _codeCountdown--;
      });
      return _codeCountdown > 0;
    });
  }

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    Map<String, dynamic> loginData = {
      'loginType': ['account', 'phone', 'email'][_currentTab],
    };

    if (_currentTab == 0) {
      loginData['account'] = _accountController.text;
      loginData['password'] = _passwordController.text;
    } else if (_currentTab == 1) {
      loginData['phone'] = _phoneController.text;
      loginData['verifyCode'] = _codeController.text;
    } else {
      loginData['email'] = _emailController.text;
      loginData['verifyCode'] = _codeController.text;
    }

    try {
      final response = await http.post(
        Uri.parse('/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginData),
      );
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        await _saveToken(data['data']['token']);
        _showSuccess('登录成功');
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        _showError(data['msg'] ?? '登录失败');
      }
    } catch (e) {
      _showError('网络错误');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _thirdPartyLogin(String platform) async {
    try {
      final response = await http.post(
        Uri.parse('/api/auth/third-party-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'platform': platform,
          'openId': platform + '_' + DateTime.now().millisecondsSinceEpoch.toString(),
          'nickname': platform + '用户',
        }),
      );
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        await _saveToken(data['data']['token']);
        _showSuccess(data['data']['isNewUser'] == true ? '欢迎新用户' : '登录成功');
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        _showError(data['msg'] ?? '登录失败');
      }
    } catch (e) {
      _showError('网络错误');
    }
  }

  Future<void> _saveToken(String token) async {
  }

  bool _isValidPhone(String phone) {
    return RegExp(r'^1[3-9]\d{9}$').hasMatch(phone);
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w\.-]+@[\w\.-]+\.\w+$').hasMatch(email);
  }

  void _showError(String msg) {
    setState(() {
      _errorMsg = msg;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: Colors.red),
    );
  }

  void _showSuccess(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: Colors.green),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(20),
              child: Container(
                width: double.infinity,
                constraints: BoxConstraints(maxWidth: 400),
                padding: EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 20,
                      offset: Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '亿级商城',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF667EEA),
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      '欢迎登录',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                    SizedBox(height: 30),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          _buildTab('账号登录', 0),
                          _buildTab('手机登录', 1),
                          _buildTab('邮箱登录', 2),
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                    if (_errorMsg != null)
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(12),
                        margin: EdgeInsets.only(bottom: 20),
                        decoration: BoxDecoration(
                          color: Color(0xFFfef0f0),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Color(0xFFfde2e2)),
                        ),
                        child: Text(
                          _errorMsg!,
                          style: TextStyle(color: Color(0xFFf56c6c), fontSize: 14),
                        ),
                      ),
                    _buildFormFields(),
                    SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF667EEA),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: _isLoading
                            ? CircularProgressIndicator(color: Colors.white)
                            : Text('登录', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    SizedBox(height: 20),
                    Text('其他登录方式', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                    SizedBox(height: 15),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildThirdPartyBtn('微信', Color(0xFF07c160), () => _thirdPartyLogin('wechat')),
                        SizedBox(width: 15),
                        _buildThirdPartyBtn('Q', Color(0xFF12b7f5), () => _thirdPartyLogin('qq')),
                        SizedBox(width: 15),
                        _buildThirdPartyBtn('微', Color(0xFFe6162d), () => _thirdPartyLogin('weibo')),
                        SizedBox(width: 15),
                        _buildThirdPartyBtn('支', Color(0xFF1677ff), () => _thirdPartyLogin('alipay')),
                      ],
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('还没有账号？', style: TextStyle(color: Colors.grey[600])),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/register'),
                          child: Text('立即注册', style: TextStyle(color: Color(0xFF667EEA))),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTab(String label, int index) {
    final isSelected = _currentTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _currentTab = index),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? Color(0xFF667EEA) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey[600],
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormFields() {
    switch (_currentTab) {
      case 0:
        return Column(
          children: [
            _buildTextField(_accountController, '请输入账号', Icons.person),
            SizedBox(height: 15),
            _buildTextField(_passwordController, '请输入密码', Icons.lock, isPassword: true),
          ],
        );
      case 1:
        return Column(
          children: [
            _buildTextField(_phoneController, '请输入手机号', Icons.phone),
            SizedBox(height: 15),
            _buildCodeField('phone'),
          ],
        );
      case 2:
        return Column(
          children: [
            _buildTextField(_emailController, '请输入邮箱', Icons.email),
            SizedBox(height: 15),
            _buildCodeField('email'),
          ],
        );
      default:
        return SizedBox();
    }
  }

  Widget _buildTextField(TextEditingController controller, String hint, IconData icon, {bool isPassword = false}) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: Colors.grey[400]),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Color(0xFF667EEA)),
        ),
      ),
    );
  }

  Widget _buildCodeField(String type) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _codeController,
            keyboardType: TextInputType.number,
            maxLength: 6,
            decoration: InputDecoration(
              hintText: '请输入验证码',
              counterText: '',
              prefixIcon: Icon(Icons.key, color: Colors.grey[400]),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Color(0xFF667EEA)),
              ),
            ),
          ),
        ),
        SizedBox(width: 10),
        ElevatedButton(
          onPressed: _codeCountdown > 0 ? null : () => _sendCode(type),
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF667EEA),
            foregroundColor: Colors.white,
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: Text(_codeCountdown > 0 ? '${_codeCountdown}s' : '获取验证码', style: TextStyle(fontSize: 12)),
        ),
      ],
    );
  }

  Widget _buildThirdPartyBtn(String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      ),
    );
  }
}
