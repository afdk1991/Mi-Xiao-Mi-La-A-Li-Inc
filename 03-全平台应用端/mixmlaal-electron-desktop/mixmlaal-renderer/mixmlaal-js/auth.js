let currentTab = 'account';
let codeCountdown = 0;

function switchTab(tab) {
  currentTab = tab;

  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  const accountGroup = document.getElementById('accountGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const phoneGroup = document.getElementById('phoneGroup');
  const codeGroup1 = document.getElementById('codeGroup1');
  const codeGroup2 = document.getElementById('codeGroup2');
  const emailGroup = document.getElementById('emailGroup');

  if (tab === 'account') {
    accountGroup.style.display = 'block';
    passwordGroup.style.display = 'block';
    phoneGroup.style.display = 'none';
    codeGroup1.style.display = 'none';
    codeGroup2.style.display = 'none';
    emailGroup.style.display = 'none';
  } else if (tab === 'phone') {
    accountGroup.style.display = 'none';
    passwordGroup.style.display = 'none';
    phoneGroup.style.display = 'block';
    codeGroup1.style.display = 'block';
    codeGroup2.style.display = 'none';
    emailGroup.style.display = 'none';
  } else {
    accountGroup.style.display = 'none';
    passwordGroup.style.display = 'none';
    phoneGroup.style.display = 'none';
    codeGroup1.style.display = 'none';
    codeGroup2.style.display = 'block';
    emailGroup.style.display = 'block';
  }
}

async function sendCode(type) {
  let target = '';
  if (type === 'phone') {
    const phone = document.querySelector('input[name="phone"]').value;
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      showError('loginError', '请输入正确的手机号');
      return;
    }
    target = phone;
  } else {
    const email = document.querySelector('input[name="email"]').value;
    if (!email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
      showError('loginError', '请输入正确的邮箱');
      return;
    }
    target = email;
  }

  try {
    const data = type === 'phone' ? { phone: target } : { email: target };
    const result = await window.api.sendCode(data);
    if (result.success) {
      alert('验证码已发送');
      startCodeCountdown(type === 'phone' ? 'phoneCodeBtn' : 'emailCodeBtn');
    } else {
      showError('loginError', result.msg || '发送验证码失败');
    }
  } catch (error) {
    showError('loginError', '网络错误');
  }
}

function startCodeCountdown(btnId) {
  codeCountdown = 60;
  const btn = document.getElementById(btnId);
  const timer = setInterval(() => {
    codeCountdown--;
    btn.textContent = codeCountdown > 0 ? codeCountdown + 's' : '获取验证码';
    btn.disabled = codeCountdown > 0;
    if (codeCountdown <= 0) clearInterval(timer);
  }, 1000);
}

function showError(elementId, message) {
  const errorDiv = document.getElementById(elementId);
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  setTimeout(() => errorDiv.classList.remove('show'), 3000);
}

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    loginType: currentTab
  };

  if (currentTab === 'account') {
    data.account = formData.get('account');
    data.password = formData.get('password');
  } else if (currentTab === 'phone') {
    data.phone = formData.get('phone');
    data.verifyCode = formData.get('code');
  } else {
    data.email = formData.get('email');
    data.verifyCode = formData.get('emailCode');
  }

  try {
    const result = await window.api.login(data);
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo));
      localStorage.setItem('loginType', result.data.loginType);
      alert('登录成功！');
      showMainPage(result.data.userInfo);
    } else {
      showError('loginError', result.msg || '登录失败');
    }
  } catch (error) {
    showError('loginError', '网络错误');
  }
}

async function thirdPartyLogin(platform) {
  try {
    const result = await window.api.thirdPartyLogin({
      platform,
      openId: platform + '_' + Date.now(),
      nickname: platform + '用户'
    });
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo));
      localStorage.setItem('loginType', result.data.loginType);
      if (result.data.isNewUser) {
        alert('欢迎新用户！');
      }
      alert('登录成功！');
      showMainPage(result.data.userInfo);
    } else {
      alert(result.msg || '第三方登录失败');
    }
  } catch (error) {
    alert('网络错误');
  }
}

function showMainPage(userInfo) {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('registerPage').style.display = 'none';
  document.getElementById('mainPage').style.display = 'block';
  document.getElementById('userName').textContent = userInfo.nickname || '用户';
  document.getElementById('welcomeText').textContent = `欢迎 ${userInfo.nickname || '用户'}，您已成功登录`;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('loginType');
  document.getElementById('mainPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
}

function checkLoginStatus() {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  if (token && userInfo) {
    showMainPage(JSON.parse(userInfo));
  }
}

window.auth = {
  switchTab,
  sendCode,
  handleLogin,
  thirdPartyLogin,
  logout,
  checkLoginStatus
};
