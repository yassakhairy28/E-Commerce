import { NextFunction, Response, Request } from "express";
import {
  discountTypes,
  IAuthRequest,
  ICart,
  ICoupon,
  IOrder,
  IOrderProduct,
  IOrderStatus,
  IPaymentMethod,
  IProduct,
} from "../../types/types.ts";
import { ICreateOrderDto } from "./DTO/order.dto.ts";
import DatabaseServices from "../../DB/DBservices.ts";
import cartModel from "../../DB/models/cart.model.ts";
import orderModel from "../../DB/models/order.model.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import productModel from "../../DB/models/product.model.ts";
import {
  applyGeneralCoupon,
  applySpecificCoupon,
  checkCoupon,
  isGeneralCoupon,
} from "../../helper/checkCoupon.ts";
import { PaymentService } from "../../utils/paymentService/paymentService.ts";
import { config } from "dotenv";
config({ path: "../../config/.env" });

class OrderService {
  private Order = new DatabaseServices<IOrder>(orderModel);
  private Cart = new DatabaseServices<ICart>(cartModel);
  private Product = new DatabaseServices<IProduct>(productModel);
  private PaymentService: PaymentService;

  constructor() {
    this.PaymentService = new PaymentService();
  }

  createOrder = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = {
      ...req.body,
    } as ICreateOrderDto;

    const cart = await this.Cart.findOne({
      filter: { createdBy: req.user._id },
    });

    if (!cart?.products.length) {
      return next(new ApiError("Cart is empty", 400));
    }

    // 1. Check for coupon validity
    let coupon: ICoupon | null = null;
    if (data.couponCode) {
      try {
        coupon = await checkCoupon(data.couponCode, req.user);
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      } catch (error) {
        return next(error);
      }
    }

    // 2. Loop through products and apply product-level discount
    let subTotal = 0;
    const products: IOrderProduct[] = [];

    for (const cartItem of cart.products) {
      const checkProduct = await this.Product.findOne({
        filter: { _id: cartItem.productId, stock: { $gte: cartItem.quantity } },
      });
      if (!checkProduct) {
        return next(
          new ApiError(
            "Product not found or out of stock :: " + cartItem.productId,
            404
          )
        );
      }

      // final price of product
      let finalPrice = checkProduct.price;

      // Try apply product-level coupon
      let discountOfProduct: number | undefined;
      let discountTypeOfProduct: discountTypes | undefined;

      if (coupon) {
        try {
          if (!isGeneralCoupon(coupon)) {
            finalPrice = applySpecificCoupon(coupon, checkProduct);
            discountOfProduct = coupon.discount;
            discountTypeOfProduct = coupon.discountType;
          }
        } catch (err) {
          return next(err);
        }
      }

      // add product to order
      products.push({
        name: checkProduct.name,
        quantity: cartItem.quantity,
        unitPrice: checkProduct.price,
        discountOfProduct,
        discountTypeOfProduct,
        finalPrice,
        productId: checkProduct._id,
      });

      // update stock of product
      checkProduct.stock -= cartItem.quantity;
      await checkProduct.save();

      subTotal += finalPrice * cartItem.quantity;
    }

    // 3. Apply general coupon (if exists and not already applied above)
    let discount: number | undefined;
    let discountType: discountTypes | undefined;
    if (coupon) {
      if (isGeneralCoupon(coupon)) {
        try {
          subTotal = applyGeneralCoupon(subTotal, coupon);
          discount = coupon.discount;
          discountType = coupon.discountType;
        } catch (err) {
          return next(err);
        }
      }
    }

    // 4. Create the order
    const order = await this.Order.create({
      address: data.address,
      phone: data.phone,
      note: data.note,
      products,
      discount,
      discountType,
      subTotal,
      createdBy: req.user._id,
      paymentMethod: data.paymentMethod,
    });

    // 5. Clear the cart
    cart.products = [];
    await cart.save();

    return res.status(201).json(order);
  };

  checkOutSession = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const orderId = req.params.orderId;

    const order = await this.Order.findOne({
      filter: {
        _id: orderId,
        createdBy: req.user._id,
        status: IOrderStatus.panding,
        paymentMethod: IPaymentMethod.card,
      },
    });

    if (!order) {
      return next(new ApiError("Order not found", 404));
    }

    const session = await this.PaymentService.checkOutSession({
      customer_email: req.user.email,
      metadata: {
        orderId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `Order Price`,
            },
            currency: "egp",
            unit_amount: order.subTotal * 100,
          },
        },
      ],

      // success_url: `${process.env.CLIENT_URL}/order/success/${orderId}`,
      // cancel_url: `${process.env.CLIENT_URL}/order/success/${orderId}`,
    });

    return res.status(200).json(session);
  };
  webhook = async (req: Request, res: Response, next: NextFunction) => {
    this.PaymentService.webhook(req);

    return res.status(200).json({});
  };

  cancelOrder = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const orderId = req.params.orderId;

    const order = await this.Order.findOne({
      filter: {
        _id: orderId,
        $or: [
          { status: IOrderStatus.panding },
          { status: IOrderStatus.placed },
        ],
        createdBy: req.user._id,
      },
    });

    if (!order) return next(new ApiError("Order not found", 404));

    let refund = {};
    if (
      order.status === IOrderStatus.placed &&
      order.paymentMethod === IPaymentMethod.card
    ) {
      await this.PaymentService.refund(order.intentId!);
      refund = {
        refundAmount: order.subTotal,
        refundDate: Date.now(),
      };
    }

    // update data of order
    await this.Order.updateOne({
      filter: { _id: orderId },
      data: {
        status: IOrderStatus.canceled,
        updatedBy: req.user._id,
        ...refund,
      },
    });

    // update stock of products
    for (const product of order.products) {
      await this.Product.updateOne({
        filter: { _id: product.productId },
        data: {
          $inc: { stock: product.quantity },
        },
      });
    }

    return res.status(200).json({ message: "Order canceled successfully" });
  };
}
export default new OrderService();
