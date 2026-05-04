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

  const [accountForm, setAccountForm] = useState({
    account: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
    nickname: '',
    password: '',
  });

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

  const handleRegisterSuccess = (res: any) => {
    setRegisteredUserId(res.data.userId || Math.random().toString(36).substring(2, 10).toUpperCase());
    setShowSuccess(true);
  };

  const handleAccountRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountForm.password !== accountForm.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (accountForm.password.length < 6) {
      setError('密码长度至少6位');
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

  const tabs = [
    { id: 'account', label: '账号注册' },
    { id: 'phone', label: '手机注册' },
    { id: 'email', label: '邮箱注册' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-teal-500 to-cyan-600 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">创建账号</h2>
          <p className="text-gray-500 mt-1">开启您的精彩旅程</p>
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
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
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
          <form onSubmit={handleAccountRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">账号</label>
              <input
                type="text"
                value={accountForm.account}
                onChange={(e) => setAccountForm({ ...accountForm, account: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请输入账号"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">昵称</label>
              <input
                type="text"
                value={accountForm.nickname}
                onChange={(e) => setAccountForm({ ...accountForm, nickname: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请输入昵称"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">密码</label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请输入密码（至少6位）"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">确认密码</label>
              <input
                type="password"
                value={accountForm.confirmPassword}
                onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请再次输入密码"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  注册中...
                </span>
              ) : (
                '注册'
              )}
            </button>
          </form>
        )}

        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">手机号</label>
              <input
                type="tel"
                value={phoneForm.phone}
                onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
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
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">昵称 (可选)</label>
              <input
                type="text"
                value={phoneForm.nickname}
                onChange={(e) => setPhoneForm({ ...phoneForm, nickname: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请输入昵称"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">密码 (可选)</label>
              <input
                type="password"
                value={phoneForm.password}
                onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="请输入密码（至少6位）"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
