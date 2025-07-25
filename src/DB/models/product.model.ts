import { model, models, Schema } from "mongoose";
import { IProduct, ProductSize } from "../../types/types.ts";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [80, "Name must be at most 50 characters long"],
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minlength: [4, "Description must be at least 3 characters long"],
      maxlength: [4000, "Description must be at most 500 characters long"],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    colors: [String],
    size: {
      type: String,
      enum: ProductSize,
    },
    folderId: {
      type: String,
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    gallary: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Sub_Category",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const productModel =
  models.Product || model<IProduct>("Product", productSchema);

export default productModel;
