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
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  status: string;
  size: string;
  adTitle: string;
  additionalGroupId: number;
  bottomContentBlockId: number;
  items: ProductItem[];
  categories: ProductCategory[];
  createdAt: string;
  updatedAt: string;
};

type ProductItem = {
  id: number;
  title: string;
  originPrice?: number;
  price: number;
  quantityInStock: number;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: number;
  name?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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
};

type UserCoupon = {
  id: number;
  isUsed: boolean;
  user: User;
  coupon: Coupon;
  createdAt: string;
  updatedAt: string;
};

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
};

type ReviewImage = {
  id: number;
  imageUrl: string;
  review?: Review;
};

type Order = {
  id: number;
  status: DeliveryStatus;
  title: string;
  coupon: UserCoupon;
  user?: User;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
};

type Payment = {
  id: number;
  method: string;
  status: string;
  creditCart?: string;
  creditCardId?: string;
  iamportResult: string; // JSON parse 가능
  virtualAccount: string;
  receiptUrl?: string;
  paymentAt: string;
  createdAt: string;
  updatedAt: string;
};

type Point = {
  id: number;
  note: string;
  amount: number;
  orders: Order[];
  user: User;
  createdAt: string;
  updatedAt: string;
};

enum DeliveryStatus {
  DELIVERING,
  DELIVERED,
  PENDING,
  WAITING,
  CANCELED,
  FAILED,
}
