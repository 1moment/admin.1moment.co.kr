type AdminUser = {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "FLORIST";
};

type ProductCategory = {
  id: number;
  parentId: number;
  title: string;
  seq: number; // 순서
  slug: string;
  status: "PUBLISHED" | "DRAFT";
  imageUrl: string;
  mobileImageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {

};

type User = {

};

type Coupon = {
  id: number;
  title: string;
  note?: string;
  isExpired: boolean;
  code: string;
  expirationDate: string;
  discountAmount: number;
  isDownloadable: boolean;
  createdAt: string;
  updatedAt: string;
}

type UserCoupon = {
  id: number;
  isUsed: boolean;
  user: User;
  coupon: Coupon;
  createdAt: string;
  updatedAt: string;
}

type Review = {
  id: number;
  title: string;
  description: string;
  images: ReviewImage[];
  ratingScore: number;
  user?: User;
  product?: Product;
  isHidden: boolean;
  orderItem?: any;
  createdAt: string;
  updatedAt: string;
}

type ReviewImage = {
  id: number;
  imageUrl: string;
  review?: Review;
}