import { model, models, Schema } from "mongoose";
import { IReview, ReviewRatingLabel } from "../../types/types.ts";

const reviewSchema = new Schema<IReview>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    text: {
      type: String,
      minlength: [2, "Review must be at least 4 characters long"],
      maxlength: [400, "Review must be at most 500 characters long"],
      required: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: true,
    },
    ratingLabel: {
      type: String,
      enum: Object.values(ReviewRatingLabel),
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

const reviewModel = models.Review || model<IReview>("Review", reviewSchema);

export default reviewModel;
