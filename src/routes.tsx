import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedLayout from "./protected-layout.tsx";

const HomePage = React.lazy(() => import("./pages/"));

const AdminUsersPage = React.lazy(() => import("./pages/admin-users"));
const AdminUserPage = React.lazy(
  () => import("./pages/admin-users/[admin-user-id]"),
);

const BannersPage = React.lazy(() => import("./pages/banners"));
const BannerPage = React.lazy(() => import("./pages/banners/[banner-id]"));
const BannerCreatePage = React.lazy(() => import("./pages/banners/create"));

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
  () => import("./pages/product-categories/[product-cateogry-id]"),
);
const ProductCategoryCreatePage = React.lazy(
  () => import("./pages/product-categories/create"),
);

const ProductContentBlocksPage = React.lazy(
  () => import("./pages/product-content-blocks"),
);
const ProductContentBlockCreatePage = React.lazy(
  () => import("./pages/product-content-blocks/create"),
);
const ProductContentBlockPage = React.lazy(
  () => import("./pages/product-content-blocks/[product-content-block-id]"),
);

const ProductsPage = React.lazy(() => import("./pages/products"));
const ProductPage = React.lazy(() => import("./pages/products/[product-id]"));
const ProductCreatePage = React.lazy(() => import("./pages/products/create"));

const PromotionCategoriesPage = React.lazy(
  () => import("./pages/promotion-categories"),
);
const PromotionCategoryPage = React.lazy(
  () => import("./pages/promotion-categories/[promotion-category-id]"),
);
const PromotionCategoryCreatePage = React.lazy(
    () => import("./pages/promotion-categories/create"),
);

const PromotionSectionsPage = React.lazy(
  () => import("./pages/promotion-sections"),
);
const PromotionSectionCreatePage = React.lazy(() => import("./pages/promotion-sections/create"));
const PromotionSectionPage = React.lazy(
  () => import("./pages/promotion-sections/[promotion-section-id]"),
);

const ReviewsPage = React.lazy(() => import("./pages/reviews"));

const SnsSectionsPage = React.lazy(() => import("./pages/sns-sections"));
const SnsSectionCreatePage = React.lazy(
  () => import("./pages/sns-sections/create"),
);
const SnsSectionPage = React.lazy(
  () => import("./pages/sns-sections/[sns-section-id]"),
);

const UsersPage = React.lazy(() => import("./pages/users"));
const UserPage = React.lazy(() => import("./pages/users/[user-id]"));

const UserCouponsPage = React.lazy(() => import("./pages/user-coupons"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="admin-users">
            <Route path="" element={<AdminUsersPage />} />
            <Route path=":admin-user-id" element={<AdminUserPage />} />
          </Route>

          <Route path="banners">
            <Route path="" element={<BannersPage />} />
            <Route path="create" element={<BannerCreatePage />} />
            <Route path=":banner-id" element={<BannerPage />} />
          </Route>

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
            <Route path="create" element={<ProductCategoryCreatePage />} />
            <Route
              path=":product-category-id"
              element={<ProductCategoryPage />}
            />
          </Route>

          <Route path="product-content-blocks">
            <Route path="" element={<ProductContentBlocksPage />} />
            <Route path="create" element={<ProductContentBlockCreatePage />} />
            <Route
              path=":product-content-block-id"
              element={<ProductContentBlockPage />}
            />
          </Route>

          <Route path="products">
            <Route path="" element={<ProductsPage />} />
            <Route path="create" element={<ProductCreatePage />} />
            <Route path=":product-id" element={<ProductPage />} />
          </Route>

          <Route path="promotion-categories">
            <Route path="" element={<PromotionCategoriesPage />} />
            <Route path="create" element={<PromotionCategoryCreatePage />} />
            <Route
              path=":promotion-category-id"
              element={<PromotionCategoryPage />}
            />
          </Route>

          <Route path="promotion-sections">
            <Route path="" element={<PromotionSectionsPage />} />
            <Route path="create" element={<PromotionSectionCreatePage />} />
            <Route
              path=":promotion-section-id"
              element={<PromotionSectionPage />}
            />
          </Route>

          <Route path="users">
            <Route path="" element={<UsersPage />} />
            <Route path=":user-id" element={<UserPage />} />
          </Route>

          <Route path="reviews">
            <Route path="" element={<ReviewsPage />} />
          </Route>

          <Route path="sns-sections">
            <Route path="" element={<SnsSectionsPage />} />
            <Route path="create" element={<SnsSectionCreatePage />} />
            <Route path=":sns-section-id" element={<SnsSectionPage />} />
          </Route>

          <Route path="user-coupons" element={<UserCouponsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
