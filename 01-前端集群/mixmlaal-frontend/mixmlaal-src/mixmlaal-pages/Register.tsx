import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

function Register() {
  const [activeTab, setActiveTab] = useState('account');
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState('');
  const navigate = useNavigate();

  // Account register form
  const [accountForm, setAccountForm] = useState({
    account: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  // Phone register form
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
    nickname: '',
    password: '',
  });

  // Email register form
  const [emailForm, setEmailForm] = useState({
    email: '',
    code: '',
    nickname: '',
    password: '',
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

  const handleRegisterSuccess = (res: any) => {
    setRegisteredUserId(res.data.userId);
    setShowSuccess(true);
  };

  const handleAccountRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountForm.password !== accountForm.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        account: accountForm.account,
        nickname: accountForm.nickname,
        password: accountForm.password,
        registerType: 'account',
      });
      handleRegisterSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register({
        phone: phoneForm.phone,
        verifyCode: phoneForm.code,
        nickname: phoneForm.nickname || undefined,
        password: phoneForm.password || undefined,
        registerType: 'phone',
      });
      handleRegisterSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register({
        email: emailForm.email,
        verifyCode: emailForm.code,
        nickname: emailForm.nickname || undefined,
        password: emailForm.password || undefined,
        registerType: 'email',
      });
      handleRegisterSuccess(response);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.msg || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">用户注册</h2>

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
              账号注册
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              手机注册
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('email')}
            >
              邮箱注册
            </button>
          </div>
        </div>

        {/* Account Register Form */}
        {activeTab === 'account' && (
          <form onSubmit={handleAccountRegister}>
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">昵称</label>
              <input
                type="text"
                value={accountForm.nickname}
                onChange={(e) => setAccountForm({ ...accountForm, nickname: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">确认密码</label>
              <input
                type="password"
                value={accountForm.confirmPassword}
                onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}

        {/* Phone Register Form */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneRegister}>
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">昵称 (可选)</label>
              <input
                type="text"
                value={phoneForm.nickname}
                onChange={(e) => setPhoneForm({ ...phoneForm, nickname: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">密码 (可选)</label>
              <input
                type="password"
                value={phoneForm.password}
                onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}

        {/* Email Register Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailRegister}>
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">昵称 (可选)</label>
              <input
                type="text"
                value={emailForm.nickname}
                onChange={(e) => setEmailForm({ ...emailForm, nickname: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">密码 (可选)</label>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-600">
          已有账号？{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            立即登录
          </Link>
        </p>
      </div>

      {/* Success Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold mb-2">注册成功！</h3>
              <p className="text-gray-600 mb-4">恭喜您完成注册</p>
              <div className="bg-gray-100 rounded p-4 mb-4">
                <p className="text-sm text-gray-500">您的用户ID：</p>
                <p className="text-2xl font-bold text-blue-600">{registeredUserId}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">请牢记您的用户ID</p>
              <button
                onClick={goToLogin}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                立即登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
