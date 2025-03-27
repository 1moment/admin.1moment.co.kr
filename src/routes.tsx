import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedLayout from "./protected-layout.tsx";

import LoginPage from "./pages/login";

const AdminUsersPage = lazy(() => import("./pages/admin-users"));
const AdminUserPage = lazy(() => import("./pages/admin-users/[:admin-user-id]"));

const CouponsPage = lazy(() => import('./pages/coupons'));
const CouponPage = lazy(() => import('./pages/coupons/[coupon-id]'))

const ProductCategoriesPage = lazy(() => import('./pages/product-categories'));
const ProductCategoryPage = lazy(() => import('./pages/product-categories/[:product-cateogry-id]'));

const ReviewsPage = lazy(() => import('./pages/reviews'));
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>.
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<div>fefe</div>} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="admin-users">
            <Route path="" element={<AdminUsersPage />}/>
            <Route path=":admin-user-id" element={<AdminUserPage />} />
          </Route>

          <Route path="coupons">
            <Route path="" element={<CouponsPage />}/>
            <Route path=":coupon-id" element={<CouponPage />} />
          </Route>

          <Route path="product-categories">
            <Route path="" element={<ProductCategoriesPage />} />
            <Route path=":product-category-id" element={<ProductCategoryPage />} />
          </Route>
          <Route path="reviews">
            <Route path="" element={<ReviewsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
