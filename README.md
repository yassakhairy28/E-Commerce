# E-Commerce

# 🛒 E-Commerce API

This is a fully-featured E-Commerce REST API built using **Express.js**, **TypeScript**, and **MongoDB**, with support for **Redis caching**, **Swagger documentation**, and **modular scalable architecture**.

> 🔗 Live Swagger Docs (local): [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)  
> 📎 LinkedIn: [@Yassa Khairy](https://www.linkedin.com/in/yassa-khairy-6b9382349)  
> 📁 GitHub Repo: [yassakhairy28/E-Commerce](https://github.com/yassakhairy28/E-Commerce)

---

## ⚙️ Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **Redis (caching)**
- **Swagger (API Docs)**
- **Joi** for validation
- **Bcrypt** for hashing
- **JWT** for authentication
- **Socket.IO** _(Coming Soon)_
- **GraphQL** _(Coming Soon)_

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yassakhairy28/E-Commerce

# Install dependencies
npm install

# Add your environment variables
cp .env.example .env

# Run the app
npm run dev
⚠️ .env file is not included for security reasons.

.

📚 API Overview
🔐 Auth
POST /auth/signUp → Register a new user

POST /auth/resendOtpSignUp → Resend OTP code

POST /auth/confirmEmail → Verify email with OTP

POST /auth/login → User login

POST /auth/forgetPassword → Send reset code to email

POST /auth/verifyResetCode → Validate reset code

POST /auth/resetPassword → Reset forgotten password

PATCH /auth/updatePassword/:userId → Change password (logged-in)

👤 User
GET /user/profile → Get current user profile

PATCH /user/update/:userId → Update user info

POST /user/uploadProfileImage → Upload profile picture

📂 Category / SubCategory / Brand
POST /category/create → Create a new category

GET /category → Get all categories

PATCH /category/update/:categoryId → Update category

(Same structure for subcategories and brands)

📦 Product
POST /product/create → Add a new product

GET /product → List all products with filters

PATCH /product/update/:productId → Update product

🎟️ Coupon
POST /coupon/create → Create a discount coupon

GET /coupon → Get all coupons

PATCH /coupon/update/:couponId → Update coupon

🛒 Cart
POST /cart/add → Add product to cart

GET /cart → View user’s cart

DELETE /cart/remove/:productId → Remove item from cart

📦 Order
POST /order/checkout → Create order from cart

GET /order → Get user orders

PATCH /order/status/:orderId → Admin updates order status

📸 Swagger Screenshot

🧠 Notes & Highlights
Environment Variables are required (.env), including:

Mongo URI

JWT secret

Redis URL

Email credentials

Clean architecture: modular structure per feature (auth, user, product...).

All requests are validated with Joi.

Redis caching is used in product/category endpoints.

Swagger setup is modular via separated files (auth.swagger.ts, product.swagger.ts, etc.).

🧩 Coming Soon
📡 Socket.IO: for real-time notifications and live chat.

🧪 GraphQL: to support flexible queries for admin dashboard.

🤝 Connect
لو حابب تراجع الكود، تدي فيدباك أو تتواصل معايا لأي فرصة شغل أو تعاون:

🔗 LinkedIn: www.linkedin.com/in/yassa-khairy-6b9382349
📁 GitHub: https://github.com/yassakhairy28/E-Commerce
