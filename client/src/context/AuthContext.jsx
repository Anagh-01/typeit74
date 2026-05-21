import { useState } from 'react';
import { AuthContext } from './auth-context';

const loadStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('typeit74_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const [loading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('typeit74_user', JSON.stringify(userData));
    localStorage.setItem('typeit74_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('typeit74_user');
    localStorage.removeItem('typeit74_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
