document.addEventListener('DOMContentLoaded', function() {
  auth.checkLoginStatus();

  const loginTabItems = document.querySelectorAll('#loginPage .tab-item');
  loginTabItems.forEach(item => {
    item.addEventListener('click', function() {
      auth.switchTab(this.dataset.tab);
    });
  });

  const registerTabItems = document.querySelectorAll('#registerPage .tab-item');
  registerTabItems.forEach(item => {
    item.addEventListener('click', function() {
      switchRegisterTab(this.dataset.tab);
    });
  });

  document.getElementById('phoneCodeBtn').addEventListener('click', function() {
    auth.sendCode('phone');
  });

  document.getElementById('emailCodeBtn').addEventListener('click', function() {
    auth.sendCode('email');
  });

  document.getElementById('loginForm').addEventListener('submit', auth.handleLogin);

  const thirdPartyBtns = document.querySelectorAll('.third-party-btn');
  thirdPartyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      auth.thirdPartyLogin(this.dataset.platform);
    });
  });

  document.getElementById('goRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'flex';
  });

  document.getElementById('goLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
  });

  document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.logout();
  });

  document.getElementById('registerForm').addEventListener('submit', handleRegister);

  document.getElementById('regPhoneCodeBtn').addEventListener('click', function() {
    sendRegisterCode('phone');
  });

  document.getElementById('regEmailCodeBtn').addEventListener('click', function() {
    sendRegisterCode('email');
  });

  document.getElementById('modalOkBtn').addEventListener('click', function() {
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
  });
});

let registerTab = 'account';

function switchRegisterTab(tab) {
  registerTab = tab;

  const tabs = document.querySelectorAll('#registerPage .tab-item');
  tabs.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  const accountGroups = ['regAccountGroup', 'regNicknameGroup', 'regPasswordGroup', 'regConfirmGroup'];
  const phoneGroups = ['regPhoneGroup', 'regCodeGroup'];
  const emailGroups = ['regEmailGroup', 'regEmailCodeGroup'];

  accountGroups.forEach(id => {
    document.getElementById(id).style.display = tab === 'account' ? 'block' : 'none';
  });

  phoneGroups.forEach(id => {
    document.getElementById(id).style.display = tab === 'phone' ? 'block' : 'none';
  });

  emailGroups.forEach(id => {
    document.getElementById(id).style.display = tab === 'email' ? 'block' : 'none';
  });
}

async function sendRegisterCode(type) {
  let target = '';
  if (type === 'phone') {
    const phone = document.querySelector('#registerForm input[name="phone"]').value;
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      showRegisterError('请输入正确的手机号');
      return;
    }
    target = phone;
  } else {
    const email = document.querySelector('#registerForm input[name="email"]').value;
    if (!email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
      showRegisterError('请输入正确的邮箱');
      return;
    }
    target = email;
  }

  try {
    const data = type === 'phone' ? { phone: target } : { email: target };
    const result = await window.api.sendCode(data);
    if (result.success) {
      alert('验证码已发送');
      startRegisterCodeCountdown(type === 'phone' ? 'regPhoneCodeBtn' : 'regEmailCodeBtn');
    } else {
      showRegisterError(result.msg || '发送验证码失败');
    }
  } catch (error) {
    showRegisterError('网络错误');
  }
}

function startRegisterCodeCountdown(btnId) {
  let countdown = 60;
  const btn = document.getElementById(btnId);
  const timer = setInterval(() => {
    countdown--;
    btn.textContent = countdown > 0 ? countdown + 's' : '获取验证码';
    btn.disabled = countdown > 0;
    if (countdown <= 0) clearInterval(timer);
  }, 1000);
}

function showRegisterError(message) {
  const errorDiv = document.getElementById('registerError');
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  setTimeout(() => errorDiv.classList.remove('show'), 3000);
}

async function handleRegister(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  if (!document.getElementById('agreeCheckbox').checked) {
    alert('请阅读并同意用户协议');
    return;
  }

  const data = {
    registerType: registerTab
  };

  if (registerTab === 'account') {
    data.account = formData.get('account');
    data.nickname = formData.get('nickname');
    data.password = formData.get('password');

    if (formData.get('password') !== formData.get('confirmPassword')) {
      showRegisterError('两次输入的密码不一致');
      return;
    }
  } else if (registerTab === 'phone') {
    data.phone = formData.get('phone');
    data.verifyCode = formData.get('code');
  } else {
    data.email = formData.get('email');
    data.verifyCode = formData.get('emailCode');
  }

  try {
    const result = await window.api.register(data);
    if (result.success) {
      document.getElementById('newUserId').textContent = result.data.userId;
      document.getElementById('successModal').style.display = 'flex';
    } else {
      showRegisterError(result.msg || '注册失败');
    }
  } catch (error) {
    showRegisterError('网络错误');
  }
}
