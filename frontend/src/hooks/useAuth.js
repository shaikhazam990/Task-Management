import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchMe, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, initialized } = useSelector((s) => s.auth);
  return {
    user, loading, error, initialized,
    login: (d) => dispatch(loginUser(d)),
    register: (d) => dispatch(registerUser(d)),
    logout: () => dispatch(logoutUser()),
    fetchMe: () => dispatch(fetchMe()),
    clearError: () => dispatch(clearError()),
  };
};
