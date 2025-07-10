import { Navigate } from 'react-router-dom';

const Auth = () => {
  // Redirect directly to dashboard since auth is disabled
  return <Navigate to="/" replace />;
};

export default Auth;