const API_BASE = '/api';

async function request(url, options = {}) {
  try {
    const response = await fetch(API_BASE + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}

const api = {
  sendCode: (data) => request('/auth/send-code', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  thirdPartyLogin: (data) => request('/auth/third-party-login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  logout: () => request('/auth/logout', {
    method: 'POST'
  }),

  getProfile: () => request('/auth/profile'),

  bindPhone: (data) => request('/auth/bind-phone', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  bindEmail: (data) => request('/auth/bind-email', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  resetPassword: (data) => request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

window.api = api;
