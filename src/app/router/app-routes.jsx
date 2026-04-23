import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Dashboard } from "@/app/features/admin/dashboard/DashBoard";
import { AdminUsers } from "@/app/features/admin/users/AdminUsers";
import {
  Home,
  Auth,
  Checkout,
  ProductDetails,
  SearchCat,
  Adopt,
  Favorites,
  SuccessStories,
} from "@/app/features";
import { useAuth } from "@/app/providers/auth";

function ProtectedRoute({ requiredRole }) {
  const { user, admin } = useAuth();

  if (!user) {
    return <Navigate to="/auth" state={{ mode: "login" }} replace />;
  }

  if (requiredRole === "admin" && !admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/search" element={<SearchCat />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/virtualAdopt/:id" element={<Adopt />} />
      <Route path="/successStories" element={<SuccessStories />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="dash-board" element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      <Route path="/products/:id" element={<ProductDetails />} />
    </Routes>
  );
}
