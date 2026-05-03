import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { runQuery, getOne, getAll } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key-2024';

const verificationCodes: Map<string, { code: string; expire: number }> = new Map();

function generateUserId(): number {
  const users = getAll('SELECT IFNULL(MAX(id), 10000) as max_id FROM users') as any[];
  const maxId = users[0]?.max_id || 10000;
  return maxId + 1;
}

function generateToken(userId: number, loginType: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const randomStr = Math.random().toString(36).substring(2, 18);
  const payload = `${userId}:${loginType}:${timestamp}:${randomStr}`;
  return jwt.sign({ userId, loginType }, JWT_SECRET + payload, { expiresIn: '7d' });
}

function generateVerifyCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

function validateEmail(email: string): boolean {
  return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
}

export const sendCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      res.status(400).json({ code: 400, msg: '请提供手机号或邮箱', success: false });
      return;
    }

    if (phone && !validatePhone(phone)) {
      res.status(400).json({ code: 400, msg: '手机号格式不正确', success: false });
      return;
    }

    if (email && !validateEmail(email)) {
      res.status(400).json({ code: 400, msg: '邮箱格式不正确', success: false });
      return;
    }

    const code = generateVerifyCode();
    const expireTime = Date.now() + 300000; // 5分钟后过期

    if (phone) {
      verificationCodes.set(phone, { code, expire: expireTime });
      res.json({
        code: 200,
        data: {
          code,
          expire: 300,
          message: `验证码已发送至手机 ${phone.substring(0, 3)}****${phone.substring(7)}`
        },
        success: true
      });
    } else {
      verificationCodes.set(email, { code, expire: expireTime });
      res.json({
        code: 200,
        data: {
          code,
          expire: 300,
          message: `验证码已发送至邮箱 ${email.substring(0, 3)}****${email.split('@')[0].substring(-3)}`
        },
        success: true
      });
    }
  } catch (error) {
    res.status(500).json({ code: 500, msg: '发送验证码失败', success: false });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { account, nickname, password, phone, email, verifyCode, registerType } = req.body;

    if (registerType === 'account') {
      if (!account || !password) {
        res.status(400).json({ code: 400, msg: '账号和密码不能为空', success: false });
        return;
      }

      const existingUser = getOne('SELECT id FROM users WHERE account = ?', [account]) as any;
      if (existingUser) {
        res.status(400).json({ code: 400, msg: '账号已存在', success: false });
        return;
      }

      const userId = generateUserId();
      const hashedPassword = await bcrypt.hash(password, 10);

      runQuery(
        'INSERT INTO users (id, account, nickname, password, created_at) VALUES (?, ?, ?, ?, ?)',
        [userId, account, nickname || account, hashedPassword, new Date().toISOString()]
      );

      res.json({
        code: 200,
        data: { userId, account, nickname: nickname || account, message: '注册成功' },
        success: true
      });
    } else if (registerType === 'phone') {
      if (!phone || !verifyCode) {
        res.status(400).json({ code: 400, msg: '手机号和验证码不能为空', success: false });
        return;
      }

      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode.code !== verifyCode || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(phone);

      const existingUser = getOne('SELECT id FROM users WHERE phone = ?', [phone]) as any;
      if (existingUser) {
        res.status(400).json({ code: 400, msg: '该手机号已注册', success: false });
        return;
      }

      const userId = generateUserId();
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      runQuery(
        'INSERT INTO users (id, phone, nickname, password, created_at) VALUES (?, ?, ?, ?, ?)',
        [userId, phone, nickname || `用户${phone.substring(7)}`, hashedPassword, new Date().toISOString()]
      );

      res.json({
        code: 200,
        data: { userId, phone, nickname: nickname || `用户${phone.substring(7)}`, message: '注册成功' },
        success: true
      });
    } else if (registerType === 'email') {
      if (!email || !verifyCode) {
        res.status(400).json({ code: 400, msg: '邮箱和验证码不能为空', success: false });
        return;
      }

      const storedCode = verificationCodes.get(email);
      if (!storedCode || storedCode.code !== verifyCode || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(email);

      const existingUser = getOne('SELECT id FROM users WHERE email = ?', [email]) as any;
      if (existingUser) {
        res.status(400).json({ code: 400, msg: '该邮箱已注册', success: false });
        return;
      }

      const userId = generateUserId();
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      runQuery(
        'INSERT INTO users (id, email, nickname, password, created_at) VALUES (?, ?, ?, ?, ?)',
        [userId, email, nickname || email.split('@')[0], hashedPassword, new Date().toISOString()]
      );

      res.json({
        code: 200,
        data: { userId, email, nickname: nickname || email.split('@')[0], message: '注册成功' },
        success: true
      });
    } else {
      res.status(400).json({ code: 400, msg: '不支持的注册类型', success: false });
    }
  } catch (error) {
    res.status(500).json({ code: 500, msg: '注册失败', success: false });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { account, password, phone, email, verifyCode, loginType } = req.body;

    if (loginType === 'account') {
      if (!account || !password) {
        res.status(400).json({ code: 400, msg: '账号和密码不能为空', success: false });
        return;
      }

      const user = getOne('SELECT * FROM users WHERE account = ?', [account]) as any;
      if (!user) {
        res.status(401).json({ code: 401, msg: '账号或密码错误', success: false });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ code: 401, msg: '账号或密码错误', success: false });
        return;
      }

      const token = generateToken(user.id, 'account');
      res.json({
        code: 200,
        data: {
          token,
          userInfo: { userId: user.id, account: user.account, nickname: user.nickname },
          loginType: 'account'
        },
        success: true
      });
    } else if (loginType === 'phone') {
      if (!phone || !verifyCode) {
        res.status(400).json({ code: 400, msg: '手机号和验证码不能为空', success: false });
        return;
      }

      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode.code !== verifyCode || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(phone);

      const user = getOne('SELECT * FROM users WHERE phone = ?', [phone]) as any;
      if (!user) {
        res.status(401).json({ code: 401, msg: '该手机号未注册', success: false });
        return;
      }

      const token = generateToken(user.id, 'phone');
      res.json({
        code: 200,
        data: {
          token,
          userInfo: { userId: user.id, phone: user.phone, nickname: user.nickname },
          loginType: 'phone'
        },
        success: true
      });
    } else if (loginType === 'email') {
      if (!email || !verifyCode) {
        res.status(400).json({ code: 400, msg: '邮箱和验证码不能为空', success: false });
        return;
      }

      const storedCode = verificationCodes.get(email);
      if (!storedCode || storedCode.code !== verifyCode || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(email);

      const user = getOne('SELECT * FROM users WHERE email = ?', [email]) as any;
      if (!user) {
        res.status(401).json({ code: 401, msg: '该邮箱未注册', success: false });
        return;
      }

      const token = generateToken(user.id, 'email');
      res.json({
        code: 200,
        data: {
          token,
          userInfo: { userId: user.id, email: user.email, nickname: user.nickname },
          loginType: 'email'
        },
        success: true
      });
    } else {
      res.status(400).json({ code: 400, msg: '不支持的登录类型', success: false });
    }
  } catch (error) {
    res.status(500).json({ code: 500, msg: '登录失败', success: false });
  }
};

export const thirdPartyLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { platform, openId, nickname, avatar } = req.body;

    if (!platform || !openId) {
      res.status(400).json({ code: 400, msg: '平台和openId不能为空', success: false });
      return;
    }

    const thirdPartyKey = `${platform}_${openId}`;
    let user = getOne('SELECT * FROM users WHERE third_party_platform = ? AND third_party_openid = ?', [platform, openId]) as any;

    if (user) {
      const token = generateToken(user.id, `thirdparty_${platform}`);
      res.json({
        code: 200,
        data: {
          token,
          userInfo: { userId: user.id, nickname: user.nickname, avatar: user.avatar },
          loginType: `thirdparty_${platform}`,
          isNewUser: false
        },
        success: true
      });
    } else {
      const userId = generateUserId();
      const newNickname = nickname || `${platform}用户${Math.floor(Math.random() * 10000)}`;
      const newAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

      runQuery(
        'INSERT INTO users (id, nickname, avatar, third_party_platform, third_party_openid, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, newNickname, newAvatar, platform, openId, new Date().toISOString()]
      );

      const token = generateToken(userId, `thirdparty_${platform}`);
      res.json({
        code: 200,
        data: {
          token,
          userInfo: { userId, nickname: newNickname, avatar: newAvatar },
          loginType: `thirdparty_${platform}`,
          isNewUser: true
        },
        success: true
      });
    }
  } catch (error) {
    res.status(500).json({ code: 500, msg: '第三方登录失败', success: false });
  }
};

export const getThirdPartyUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { platform } = req.query;

    const urls: Record<string, string> = {
      wechat: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx&response_type=code&redirect_uri=...',
      qq: 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101&redirect_uri=...',
      weibo: 'https://api.weibo.com/oauth2/authorize?response_type=code&client_id=123&redirect_uri=...',
      alipay: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021&scope=auth_user&redirect_uri=...',
      baidu: 'https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=...',
      douyin: 'https://open.douyin.com/oauth/authorize?client_key=...&redirect_uri=...',
      xiaomi: 'https://account.xiaomi.com/oauth2/authorize?client_id=...&redirect_uri=...',
      apple: 'https://appleid.apple.com/auth/authorize?client_id=...&redirect_uri=...'
    };

    if (!urls[platform as string]) {
      res.status(400).json({ code: 400, msg: '不支持的第三方平台', success: false });
      return;
    }

    res.json({
      code: 200,
      data: {
        platform,
        url: urls[platform as string],
        message: '请使用此URL进行授权'
      },
      success: true
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '获取授权URL失败', success: false });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    code: 200,
    data: { message: '登出成功' },
    success: true
  });
};

export const bindPhone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { phone, code } = req.body;

    if (!phone || !code) {
      res.status(400).json({ code: 400, msg: '手机号和验证码不能为空', success: false });
      return;
    }

    if (!validatePhone(phone)) {
      res.status(400).json({ code: 400, msg: '手机号格式不正确', success: false });
      return;
    }

    const storedCode = verificationCodes.get(phone);
    if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
      res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
      return;
    }
    verificationCodes.delete(phone);

    const existingUser = getOne('SELECT id FROM users WHERE phone = ? AND id != ?', [phone, userId]) as any;
    if (existingUser) {
      res.status(400).json({ code: 400, msg: '该手机号已被其他账号绑定', success: false });
      return;
    }

    runQuery('UPDATE users SET phone = ? WHERE id = ?', [phone, userId]);

    res.json({
      code: 200,
      data: { message: '手机号绑定成功' },
      success: true
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '绑定失败', success: false });
  }
};

export const bindEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ code: 400, msg: '邮箱和验证码不能为空', success: false });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ code: 400, msg: '邮箱格式不正确', success: false });
      return;
    }

    const storedCode = verificationCodes.get(email);
    if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
      res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
      return;
    }
    verificationCodes.delete(email);

    const existingUser = getOne('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]) as any;
    if (existingUser) {
      res.status(400).json({ code: 400, msg: '该邮箱已被其他账号绑定', success: false });
      return;
    }

    runQuery('UPDATE users SET email = ? WHERE id = ?', [email, userId]);

    res.json({
      code: 200,
      data: { message: '邮箱绑定成功' },
      success: true
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '绑定失败', success: false });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone, email, code, newPassword } = req.body;

    if (!code || !newPassword) {
      res.status(400).json({ code: 400, msg: '验证码和新密码不能为空', success: false });
      return;
    }

    if (phone) {
      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(phone);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      runQuery('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, phone]);
    } else if (email) {
      const storedCode = verificationCodes.get(email);
      if (!storedCode || storedCode.code !== code || storedCode.expire < Date.now()) {
        res.status(400).json({ code: 400, msg: '验证码错误或已过期', success: false });
        return;
      }
      verificationCodes.delete(email);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      runQuery('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    } else {
      res.status(400).json({ code: 400, msg: '请提供手机号或邮箱', success: false });
      return;
    }

    res.json({
      code: 200,
      data: { message: '密码重置成功' },
      success: true
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '密码重置失败', success: false });
  }
};

export const getProfile = (req: AuthRequest, res: Response): void => {
  try {
    const user = getOne(
      'SELECT id, account, phone, email, nickname, avatar, role, created_at FROM users WHERE id = ?',
      [req.userId]
    ) as any;

    if (!user) {
      res.status(404).json({ code: 404, msg: '用户不存在', success: false });
      return;
    }

    res.json({
      code: 200,
      data: user,
      success: true
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '获取用户信息失败', success: false });
  }
};
