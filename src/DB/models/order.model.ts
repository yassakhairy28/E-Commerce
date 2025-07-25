import { model, models, Schema } from "mongoose";
import {
  discountTypes,
  IOrder,
  IOrderStatus,
  IPaymentMethod,
} from "../../types/types.ts";

const orderSchema = new Schema<IOrder>(
  {
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: /^(\+2?01|01|00201)[0-2,5]{1}[0-9]{8}$/,
      message: "in-valid mobile number",
    },
    note: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    paidAt: {
      type: Date,
    },
    rejectedReason: String,
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        discountOfProduct: {
          type: Number,
        },
        discountTypeOfProduct: {
          type: String,
          enum: Object.values(discountTypes),
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(IOrderStatus),
      default: IOrderStatus.panding,
    },
    // the final price after discount
    subTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(IPaymentMethod),
      default: IPaymentMethod.cash,
      required: true,
    },
    intentId: String,
    refundAmount: Number,
    refundDate: Date,
    couponCode: String,
    discount: Number,
    discountType: {
      type: String,
      enum: Object.values(discountTypes),
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const orderModel = models.Order || model<IOrder>("Order", orderSchema);
export default orderModel;
