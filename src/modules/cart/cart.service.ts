import { NextFunction, Request, Response } from "express";
import * as CartDto from "./dto/cart.dto.ts";
import DatabaseServices from "../../DB/DBservices.ts";
import cartModel from "../../DB/models/cart.model.ts";
import { IAuthRequest, ICart, IProduct } from "../../types/types.ts";
import productModel from "../../DB/models/product.model.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { Types } from "mongoose";

class CartService {
  private Cart = new DatabaseServices<ICart>(cartModel);
  private Product = new DatabaseServices<IProduct>(productModel);

  addToCart = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { productId, quantity }: CartDto.IAddToCartDto = req.body;

    const Product = await this.Product.findOne({
      filter: { _id: productId, stock: { $gte: quantity } },
    });
    if (!Product)
      return next(new ApiError("In-Valid Product or out of stock", 404));
    const cart = await this.Cart.findOne({
      filter: { createdBy: req.user._id },
    });

    if (!cart) {
      const newCart = await this.Cart.create({
        createdBy: req.user._id,
        products: [{ productId, quantity }],
      });
      return res.status(201).json(newCart);
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (existingProduct) {
      if (existingProduct.quantity + quantity > Product.stock)
        return next(new ApiError("Product out of stock", 404));

      existingProduct.quantity += quantity;
      await cart.save();
      return res.status(200).json(cart);
    }
    cart.products.push({ productId, quantity });

    await cart.save();
    return res.status(200).json(cart);
  };

  deleteFromCart = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const productId: Types.ObjectId = new Types.ObjectId(req.params.productId);

    const cart = await this.Cart.findOneAndUpdate({
      filter: { createdBy: req.user._id },
      update: {
        $pull: {
          products: { productId: productId },
        },
      },
    });

    if (!cart) return next(new ApiError("Cart not found", 404));

    return res.status(200).json(cart);
  };
  getItem = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const cart = await this.Cart.findOne({
      filter: {
        createdBy: req.user._id,
      },
      populate: [
        { path: "products.productId" },
        { path: "createdBy", select: "firstName lastName profilePic" },
      ],
    });

    if (!cart) return next(new ApiError("Cart not found", 404));

    return res.status(200).json(cart);
  };
}

const cartService = new CartService();
export default cartService;
