import { model, models, Schema } from "mongoose";
import { ICart, ICartProduct } from "../../types/types.ts";

const ICartProductSchema = new Schema<ICartProduct>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new Schema<ICart>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [ICartProductSchema],
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const cartModel = models.Cart || model<ICart>("Cart", cartSchema);

export default cartModel;
