import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedLayout from "./protected-layout.tsx";

const AdminUsersPage = React.lazy(() => import("./pages/admin-users"));
const AdminUserPage = React.lazy(
  () => import("./pages/admin-users/[:admin-user-id]"),
);

const BannersPage = React.lazy(() => import("./pages/banners"));

const CouponsPage = React.lazy(() => import("./pages/coupons"));
const CouponPage = React.lazy(() => import("./pages/coupons/[coupon-id]"));

const LoginPage = React.lazy(() => import("./pages/login"));

const OrdersPage = React.lazy(() => import("./pages/orders"));
const OrderPage = React.lazy(() => import("./pages/orders/[order-id]"));

const PointsPage = React.lazy(() => import("./pages/points"));

const ProductCategoriesPage = React.lazy(
  () => import("./pages/product-categories"),
);
const ProductCategoryPage = React.lazy(
  () => import("./pages/product-categories/[:product-cateogry-id]"),
);

const ProductContentBlocksPage = React.lazy(
  () => import("./pages/product-content-blocks"),
);
const ProductContentBlockPage = React.lazy(
  () => import("./pages/product-content-blocks/[:product-content-block-id]"),
);

const ProductsPage = React.lazy(() => import("./pages/products"));
const ProductPage = React.lazy(() => import("./pages/products/[product-id]"));

const PromotionCategoriesPage = React.lazy(() => import('./pages/promotion-categories'))
const PromotionCategoryPage = React.lazy(() => import('./pages/promotion-categories/[promotion-category-id]'))

const ReviewsPage = React.lazy(() => import("./pages/reviews"));

const UsersPage = React.lazy(() => import("./pages/users"));
const UserPage = React.lazy(() => import("./pages/users/[user-id]"));

const UserCouponsPage = React.lazy(() => import("./pages/user-coupons"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<div>fefe</div>} />

          <Route path="admin-users">
            <Route path="" element={<AdminUsersPage />} />
            <Route path=":admin-user-id" element={<AdminUserPage />} />
          </Route>

          <Route path="banners" element={<BannersPage />} />

          <Route path="coupons">
            <Route path="" element={<CouponsPage />} />
            <Route path=":coupon-id" element={<CouponPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route path="orders">
            <Route path="" element={<OrdersPage />} />
            <Route path=":order-id" element={<OrderPage />} />
          </Route>

          <Route path="points" element={<PointsPage />} />

          <Route path="product-categories">
            <Route path="" element={<ProductCategoriesPage />} />
            <Route
              path=":product-category-id"
              element={<ProductCategoryPage />}
            />
          </Route>

          <Route path="product-content-blocks">
            <Route path="" element={<ProductContentBlocksPage />} />
            <Route
              path=":product-content-block-id"
              element={<ProductContentBlockPage />}
            />
          </Route>

          <Route path="products">
            <Route path="" element={<ProductsPage />} />
            <Route path=":product-id" element={<ProductPage />} />
          </Route>

          <Route path="promotion-categories">
            <Route path="" element={<PromotionCategoriesPage />} />
            <Route path=":promotion-category-id" element={<PromotionCategoryPage />} />
          </Route>

          <Route path="users">
            <Route path="" element={<UsersPage />} />
            <Route path=":user-id" element={<UserPage />} />
          </Route>

          <Route path="reviews">
            <Route path="" element={<ReviewsPage />} />
          </Route>

          <Route path="user-coupons" element={<UserCouponsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
