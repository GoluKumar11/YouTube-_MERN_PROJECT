import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      uniquie: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      uniquie: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    Avatar: {
      type: String, //cloudnery url
      required: true,
    },
    coverImage: {
      type: String, //cloudnery url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
    ],
    password: {
      type: String,
      required: [true, "passward is required"],
    },
    refreshToken: {
      type: String
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryt(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      //payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      //payload
      _id: this._id,
    },
    process.env.ACCESS_REFRESH_TOKEN,
    {
      expiresIn: ACCESS_REFRESH_TOKEN_EXPIRY,
    },
  );
};


export const User = mongoose.model("User", userSchema);
