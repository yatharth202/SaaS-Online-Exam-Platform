import {asyncHandler}  from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async (req,res) => {
    const {fullName,email,password,collegeId} = req.body;

    if(!fullName || !email || !password || !collegeId){
        throw new ApiError(400,"All fields are required");
    }

    const existingUser = await User.findOne({ email })

    if(existingUser){
        throw new ApiError(409,"User already exists with this email");
    }

    // user created
    const user = await User.create({
        fullName,
        email,
        password,
        collegeId,

    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )
    if(!createdUser){
        throw new ApiError(500,"Something Went wrong while registering a user")
    }

    return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


const loginUser = asyncHandler(async(res,req) => {
    const {email,password} = req.body;

    if(!email || !password) {
        throw new ApiError(400,"Email and password are required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const isPasswordValid = await user.isPasswordValid(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200,
        {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "Login successfully"
    )
    )
});

export {registerUser,loginUser}