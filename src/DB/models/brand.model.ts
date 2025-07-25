import { model, models, Schema } from "mongoose";
import { IBrand } from "../../types/types.ts";

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name must be at most 50 characters long"],
    },
    logo: {
      secure_url: String,
      public_id: String,
    },
    slug: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
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

const brandModel = models.Brand || model<IBrand>("Brand", brandSchema);

export default brandModel;
