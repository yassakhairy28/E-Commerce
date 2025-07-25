import { model, models, Schema, Types } from "mongoose";
import { ICategory } from "../../types/types";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name must be at most 25 characters long"],
    },
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      secure_url: String,
      public_id: String,
    },
    folderId: {
      type: String,
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

const categoryModel =
  models.Category || model<ICategory>("Category", categorySchema);
export default categoryModel;
