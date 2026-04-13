import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("admin_user");

  let isAdmin = false;

  if (userData) {
    try {
      const user = JSON.parse(userData);
      isAdmin = user.isAdmin === true;
    } catch (e) {
      console.error("Error parsing user data");
    }
  }

  // If not authenticated or not an admin, redirect to login
  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;
