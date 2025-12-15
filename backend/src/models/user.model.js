import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index: true,
        },

        password: {
            type: String,
            required:true,
        },

        role: {
            type: String,
            enum: ["admin","student"],
            default: "student",
        },

        collegeId: {
            type: Schema.Types.ObjectId,
            ref:"College",
            required:true,
        },

        refreshToken: {
            type: String,
            select: false,
        }

    },
    {
        timestamps:true
    }

)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function(password){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
            collegeId :this.collegeId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User",userSchema);


