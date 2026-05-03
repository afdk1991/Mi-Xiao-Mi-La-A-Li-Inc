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

  // Account login form
  const [accountForm, setAccountForm] = useState({
    account: '',
    password: '',
  });

  // Phone login form
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
  });

  // Email login form
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
        data = { phone: phoneForm.phone };
      } else {
        if (!emailForm.email) {
          setError('请先输入邮箱');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">用户登录</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('account')}
            >
              账号密码
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              手机登录
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('email')}
            >
              邮箱登录
            </button>
          </div>
        </div>

        {/* Account Login Form */}
        {activeTab === 'account' && (
          <form onSubmit={handleAccountLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">账号</label>
              <input
                type="text"
                value={accountForm.account}
                onChange={(e) => setAccountForm({ ...accountForm, account: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {/* Phone Login Form */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">手机号</label>
              <input
                type="tel"
                value={phoneForm.phone}
                onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="^1[3-9]\d{9}$"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneForm.code}
                  onChange={(e) => setPhoneForm({ ...phoneForm, code: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => sendCode('phone')}
                  disabled={codeCountdown > 0}
                  className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {/* Email Login Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emailForm.code}
                  onChange={(e) => setEmailForm({ ...emailForm, code: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => sendCode('email')}
                  disabled={codeCountdown > 0}
                  className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {/* Third Party Login */}
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">其他登录方式</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleThirdPartyLogin('wechat')}
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              W
            </button>
            <button
              onClick={() => handleThirdPartyLogin('qq')}
              className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              Q
            </button>
            <button
              onClick={() => handleThirdPartyLogin('weibo')}
              className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold hover:bg-red-600 transition-colors"
              disabled={loading}
            >
              V
            </button>
            <button
              onClick={() => handleThirdPartyLogin('alipay')}
              className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              A
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          还没有账号？{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
