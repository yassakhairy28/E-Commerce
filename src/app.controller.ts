import express from "express";
import connectDB from "./DB/DBconnecton";
import {
  globalErrorHandler,
  notFoundHanlder,
} from "./middlewares/error.handler.middleware";
import authRouter from "./modules/auth/auth.controller";
import categoryRouter from "./modules/category/category.controller";
import productRouter from "./modules/Product/product.controller.ts";
import subCategoryRouter from "./modules/sub_category/sub_category.controller.ts";
import brandRouter from "./modules/brand/brand.controller.ts";
import cartRouter from "./modules/cart/cart.controller.ts";
import orderRouter from "./modules/order/order.controller.ts";
import couponRouter from "./modules/coupon/coupon.controller.ts";
import { connectRedis } from "./config/redis.config.ts";
import userRouter from "./modules/user/user.controller.ts";
import reviewRouter from "./modules/review/review.controller.ts";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// limit request
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // limit eacth IP 50 requests per windowMs
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the E-Commerce platform",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/docs/**/*.ts", // <-- دا بيشمل كل ملفات التوثيق الفرعية
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const bootstrap = async (app: express.Application) => {
  // security
  app.use(cors()); //cors origin
  app.use(helmet()); // helmet
  app.use(limiter); // limit request

  // For parsing application/json
  app.use("/order/webhook", express.raw({ type: "application/json" }));
  app.use(express.json());
  app.use("/uploads", express.static("uploads")); // file uploading

  await connectDB(); // Connect to DB
  await connectRedis(); // Connect to Redis

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", (req: any, res: any) => res.send("Welcome to E-Commerce App"));

  // Routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/product", productRouter);
  app.use("/sub_category", subCategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/cart", cartRouter);
  app.use("/coupon", couponRouter);
  app.use("/order", orderRouter);
  app.use("/review", reviewRouter);

  // Error handlers
  app.all("/*dummy", notFoundHanlder);
  app.use(globalErrorHandler);
};

export default bootstrap;
