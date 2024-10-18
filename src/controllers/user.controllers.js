import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {
  // get user details from fronted
  //validation- not empty
  // check if user already exits - username email
  // check for image check for avtar
  // upload them to cloudnery - avtar
  // create user object - create entery in db
  // remove password and refresh token filed of response
  // check for user creation
  // return response

  const { fullname, email, userName, Avatar } = req.body;
  // console.log("email", email);
  // console.log("userName", userName);

  if (
    [fullname, email, userName, Avatar].some((field) => field?.trim() === "")
  ) {
    throw ApiError(400, "this is all required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  // User.findOne(`{$or :[{userName }, { email }]}`)

  if (existedUser) {
    throw ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    Avatar: Avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(User._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});


//  if ( fullname === "") {
//   throw ApiError(400, "this is required")
//  }
//  if ( email === "") {
//   throw ApiError(400, "this is required")
//  }
//  if ( fullname === "") {
//   throw ApiError(400, "this is required")
//  }
//  if ( Avatar === "") {
//   throw ApiError(400, "this is required")
//  }

export { registerUser };
