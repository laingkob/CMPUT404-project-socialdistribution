import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const prevLocation = useLocation().pathname;

  return user.isLogin ? (
    children
  ) : (
    <Navigate to={`/signin?redirectTo=${prevLocation}`} replace />
  );
};

export const SignInRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  return user.isLogin ? <Navigate to="/" replace /> : children;
};

export default { PrivateRoute, SignInRoute };
