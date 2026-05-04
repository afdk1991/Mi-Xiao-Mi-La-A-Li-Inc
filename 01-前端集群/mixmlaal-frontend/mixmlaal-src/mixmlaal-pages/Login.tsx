import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [activeTab, setActiveTab] = useState('account');
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [accountForm, setAccountForm] = useState({
    account: '',
    password: '',
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
  });

  const [emailForm, setEmailForm] = useState({
    email: '',
    code: '',
  });

  const startCountdown = () => {
    let count = 60;
    setCodeCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCodeCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const sendCode = async (type: string) => {
    try {
      let data;
      if (type === 'phone') {
        if (!phoneForm.phone) {
          setError('请先输入手机号');
          return;
        }
        if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
          setError('请输入有效的手机号');
          return;
        }
        data = { phone: phoneForm.phone };
      } else {
        if (!emailForm.email) {
          setError('请先输入邮箱');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
          setError('请输入有效的邮箱地址');
          return;
        }
        data = { email: emailForm.email };
      }

      const res = await authService.sendCode(data);
      alert(res.data.message || '验证码发送成功');
      startCountdown();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '发送验证码失败');
    }
  };

  const handleLoginSuccess = (res: any) => {
    const { token, userInfo, loginType } = res.data;
    login(userInfo, token, loginType);
    navigate('/');
  };

  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        account: accountForm.account,
        password: accountForm.password,
        loginType: 'account',
      });
      handleLoginSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        phone: phoneForm.phone,
        verifyCode: phoneForm.code,
        loginType: 'phone',
      });
      handleLoginSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        email: emailForm.email,
        verifyCode: emailForm.code,
        loginType: 'email',
      });
      handleLoginSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartyLogin = async (platform: string) => {
    setError('');
    setLoading(true);

    try {
      const mockOpenId = `${platform}_${Date.now()}`;
      const mockNickname = `${platform}用户`;

      const response = await authService.thirdPartyLogin({
        platform,
        openId: mockOpenId,
        nickname: mockNickname,
      });

      if (response.data.isNewUser) {
        alert('欢迎新用户！');
      }

      handleLoginSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '第三方登录失败');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: '账号密码' },
    { id: 'phone', label: '手机登录' },
    { id: 'email', label: '邮箱登录' },
  ];

  const thirdPartyOptions = [
    { platform: 'wechat', label: '微信', color: 'bg-green-500', icon: 'W' },
    { platform: 'qq', label: 'QQ', color: 'bg-blue-500', icon: 'Q' },
    { platform: 'weibo', label: '微博', color: 'bg-red-500', icon: 'V' },
    { platform: 'alipay', label: '支付宝', color: 'bg-blue-600', icon: 'A' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">欢迎回来</h2>
          <p className="text-gray-500 mt-1">登录您的账号，开启精彩体验</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-3 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError('');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'account' && (
          <form onSubmit={handleAccountLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">账号</label>
              <input
                type="text"
                value={accountForm.account}
                onChange={(e) => setAccountForm({ ...accountForm, account: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入账号"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">密码</label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入密码"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">记住我</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                忘记密码？
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>
        )}

        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">手机号</label>
              <input
                type="tel"
                value={phoneForm.phone}
                onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入手机号"
                required
                pattern="^1[3-9]\d{9}$"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={phoneForm.code}
                  onChange={(e) => setPhoneForm({ ...phoneForm, code: e.target.value })}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="请输入验证码"
                  required
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => sendCode('phone')}
                  disabled={codeCountdown > 0}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">邮箱</label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入邮箱"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={emailForm.code}
                  onChange={(e) => setEmailForm({ ...emailForm, code: e.target.value })}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="请输入验证码"
                  required
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => sendCode('email')}
                  disabled={codeCountdown > 0}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-500 text-sm">其他登录方式</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {thirdPartyOptions.map((option) => (
              <button
                key={option.platform}
                onClick={() => handleThirdPartyLogin(option.platform)}
                disabled={loading}
                className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110`}
                title={option.label}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          还没有账号？{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;