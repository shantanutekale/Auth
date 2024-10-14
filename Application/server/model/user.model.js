import { request } from "express";
import mongoose from "mongoose";

export const UserSchema =new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please provide unique username"],
        unique:[true,'username already exists']
    },
    password:{
        type:String,
        required:[true,"please provide password"],
        unique:false,
    },
    email:{
        type:String,
        required:[true,"please provoid unique email"],
        unique:[true,"email already exists"]
    },
    firstName:{type:String},
    lastName:{type:String},
    mobile:{type:Number},
    address:{type:String},
    profile:{type:String},
})

export default mongoose.model.Users || mongoose.model('user',UserSchema)