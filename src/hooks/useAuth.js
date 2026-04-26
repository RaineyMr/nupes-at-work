import { useContext } from 'react';
import { useAuth as useAuthHook } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthHook();
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
