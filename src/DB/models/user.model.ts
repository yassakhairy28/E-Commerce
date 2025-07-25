import { HydratedDocument, model, models, Schema } from "mongoose";
import { IUser, OtpType, Provider, userRole } from "../../types/types";
import { hash } from "../../utils/hash/hash";
import { encrypt } from "../../utils/encryption/encryption";

export const defaultProfilePic =
  "https://res.cloudinary.com/dfomwahqk/image/upload/v1753229819/default-profile_p4vcvj.jpg";

export const defaultPublicIdOnCloud = "default-profile_p4vcvj";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [25, "First name must be at most 25 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [25, "Last name must be at most 25 characters long"],
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.User,
    },
    password: String,
    mobileNumber: String,
    provider: {
      type: String,
      enum: Object.values(Provider),
      default: Provider.System,
    },
    age: {
      type: Number,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    OTP: [
      {
        code: String,
        type: {
          type: String,
          enum: Object.values(OtpType), // types of otps
        },
        expiresIn: {
          type: Date,
          required: true,
        },
        countOfSentCode: {
          type: Number,
          default: 0,
        },
        waitingTime: {
          type: Date,
          default: null,
        },
        lastSentCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    changeCredentials: {
      type: Date,
      default: null,
    },
    profilePic: {
      secure_url: {
        type: String,
        default: defaultProfilePic,
      },
      public_id: {
        type: String,
        default: defaultPublicIdOnCloud,
      },
    },
    address: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim() || "Unknown";
});

userSchema.pre("save", function (next) {
  // hashing password
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
  // encrypting mobile number
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({
      payload: this.mobileNumber,
      signature: process.env.MOBILENUMBER as string,
    });
  }

  next();
});

const userModel = models.User || model<IUser>("User", userSchema);

export default userModel;
export type userType = HydratedDocument<IUser>;
