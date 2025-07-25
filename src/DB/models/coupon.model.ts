import { model, models, Schema } from "mongoose";
import { discountTypes, ICoupon } from "../../types/types.ts";

const couponSchema = new Schema<ICoupon>(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name must be at most 25 characters long"],
    },
    code: {
      type: String,
      required: true,
      unique: true,
      maxLength: [20, "Code must be at most 20 characters long"],
      Minength: [2, "Code must be at least 2 characters long"],
    },
    discount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: Object.values(discountTypes),
      default: discountTypes.percentage,
    },
    brandsIds: [{ type: Schema.Types.ObjectId, ref: "brand" }],
    productsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    subCategoriesId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    maxUses: Number,
    usedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    minOrderValue: {
      type: Number,
      min: [1, "Minimum order value must be at least 1"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
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

//  Add custom validation to require at least one: expiresAt or maxUses
couponSchema.pre("validate", function (next) {
  if (!this.expiresAt && !this.maxUses) {
    this.invalidate(
      "validation",
      "Coupon must have either an expiration date or a max usage limit."
    );
  }

  next();
});

const couponModel = models.coupon || model<ICoupon>("Coupon", couponSchema);

export default couponModel;
