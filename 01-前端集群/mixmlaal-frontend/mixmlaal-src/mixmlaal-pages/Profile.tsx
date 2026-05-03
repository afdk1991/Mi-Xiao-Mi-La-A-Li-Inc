import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-red-500">加载失败</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">个人中心</h1>

        <div className="space-y-4">
          <div className="flex items-center border-b pb-4">
            <span className="text-gray-600 w-24">昵称</span>
            <span className="font-semibold">{profile.nickname}</span>
          </div>

          <div className="flex items-center border-b pb-4">
            <span className="text-gray-600 w-24">邮箱</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center border-b pb-4">
            <span className="text-gray-600 w-24">角色</span>
            <span className={profile.role === 'admin' ? 'text-red-600' : 'text-blue-600'}>
              {profile.role === 'admin' ? '管理员' : '普通用户'}
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
