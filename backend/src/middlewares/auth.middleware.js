import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req,res,next) => {

    const authHeader = req.headers.authorization;


    if (!authHeader || typeof authHeader !== "string") {
        throw new ApiError(401, "Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(401,"Invalid access token");
    }

    req.user=user;
    next();
})