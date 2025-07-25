import { model, models, Schema } from "mongoose";
import { ISubCategory } from "../../types/types.ts";

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name must be at most 50 characters long"],
    },
    image: {
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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

// Make subcategory name unique only inside each category
subCategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

const SubCategoryModel =
  models.Sub_Category || model<ISubCategory>("Sub_Category", subCategorySchema);

export default SubCategoryModel;
