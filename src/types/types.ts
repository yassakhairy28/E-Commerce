import { Request } from "express";
import { Document, Types } from "mongoose";

export interface IError {
  message: string;
  statusCode: number;
  stack?: string;
  cause: number;
}

export interface IAttachment {
  public_id: string;
  secure_url: string;
}

export interface IOtpType {
  code: string;
  expiresIn: Date;
  type: OtpType;
  countOfSentCode?: number;
  waitingTime?: Date;
  lastSentCount?: number;
  _id?: Types.ObjectId;
}

export enum OtpType {
  register = "Confirm Email",
  login = "Confirm login",
  forgetPassword = "Confirm forget Password",
  loginWithGoogle = "Login with Google",
}
export enum userRole {
  Admin = "Admin",
  User = "User",
}

export enum Provider {
  Google = "google",
  System = "System",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: userRole;
  provider: Provider;
  mobileNumber: string;
  age: number;
  isConfirmed: boolean;
  OTP?: IOtpType[];
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  changeCredentials?: Date;
  profilePic: IAttachment;
  address: string;
}

export interface emailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  createdBy?: Types.ObjectId;
  logo: IAttachment;
  folderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for file type extending Multer's File type
export interface IFile extends Express.Multer.File {}

// Interface for authenticated requests with user info
export interface IAuthRequest extends Request {
  user: IUser;
}

// Interface for requests handling file uploads
export interface IUploadFileRequest extends Request {
  file?: IFile;
  files?: IFile[];
}
// Interface for requests with both authentication and file upload capabilities
export interface IAuthAndUploadRequest extends IUploadFileRequest {
  user: IUser;
}

export interface IWebhookRequest extends Request {
  signature: string | string[] | undefined;
}

export enum ProductSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;

  stock: number;
  price: number;
  discount: number;
  finalPrice: number;

  colors?: string[];
  size: ProductSize;

  folderId: string;
  image: IAttachment;
  gallary?: IAttachment[];

  subCategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  createdBy: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}

export interface ISubCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  image: IAttachment;
  slug: string;
  folderId: string;
  createdBy: Types.ObjectId;
  categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  logo: IAttachment;
  slug: string;
  createdBy: Types.ObjectId;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum discountTypes {
  percentage = "percentage",
  fixed = "fixed",
}

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  discount: number;
  discountType: discountTypes;
  brandsIds: Types.ObjectId[];
  productsIds?: Types.ObjectId[];
  subCategoriesId?: Types.ObjectId[];
  expiresAt?: Date;
  isActive: boolean;
  maxUses?: number;
  usedBy: Types.ObjectId[];
  minOrderValue?: number;
  slug: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// product in cart
export interface ICartProduct {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  products: ICartProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProduct {
  _id?: Types.ObjectId;
  name: string;
  productId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  discountOfProduct?: number;
  discountTypeOfProduct?: discountTypes;
  finalPrice: number;
}

export enum IOrderStatus {
  panding = "panding",
  placed = "placed",
  onWay = "onWay",
  delivered = "delivered",
  canceled = "canceled",
}

export enum IPaymentMethod {
  cash = "cash",
  card = "card",
}

export interface IOrder extends Document {
  _id: Types.ObjectId;

  address: string;
  phone: string;

  note?: string;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  paidAt?: Date;
  rejectedReason?: string;

  products: IOrderProduct[];

  status: IOrderStatus;

  subTotal: number;
  couponCode: number;
  discount: number;
  discountType: discountTypes;
  finalPrice: number;

  paymentMethod: IPaymentMethod;
  intentId?: string;
  refundAmount?: number;
  refundDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export enum ReviewRatingLabel {
  bad = "bad",
  average = "average",
  good = "good",
  veryGood = "veryGood",
  excellent = "excellent",
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  productId: Types.ObjectId;
  text: string;
  rating: number;
  ratingLabel: ReviewRatingLabel;
  createdAt: Date;
  updatedAt: Date;
}
