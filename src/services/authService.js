/**
 * Auth service — handles business logic for authentication.
 * Add login, logout, token management functions here.
 */
const ACCESS_TOKEN_KEY = 'sds.accessToken';
const USER_KEY = 'sds.user';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  clearAccessToken();
  localStorage.removeItem(USER_KEY);
};

export const login = async (email, password) => {
  if (!email) {
    throw new Error('email is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'kim@gmail.com') {
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const user = {
      email: normalizedEmail,
      name: 'Kim',
    };

    setAccessToken(token);
    setStoredUser(user);

    return {
      success: true,
      token,
      user,
    };
  }

  return {
    success: false,
    message: 'Invalid credentials',
  };

  // Enable this when backend login is ready.
  // const response = await apiClient.post('/login', { email, password });
  // const { token, user } = response.data;
  // setAccessToken(token);
  // setStoredUser(user);
  // return response.data;
};

export const validateEmail = async (email) => {
  if (!email) {
    throw new Error('email is required');
  }

  if (email.trim().toLowerCase() === 'abc@gmail.com') {
    return { active: false };
  }

  return { active: true };

  // Enable this when backend validation is ready.
  // const response = await apiClient.post('/validateEmail', { email });
  // return response.data;
};

export const logout = () => {
  clearSession();
};
