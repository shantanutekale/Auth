import UserModel from "../model/user.model.js"
import bcrypt, { hashSync } from 'bcrypt'; 
import jwt  from "jsonwebtoken";
import env from "../config.js"
import otpGenerator from "otp-generator"
import { registerMail } from "../controllers/mailer.js";


export async function verifyUser(req,res,next){
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        let existingUser = await UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(404).send({ error: "User not found" });
        }
        
        next();

    } catch (error) {
        return res.status(500).send({error:"authentication error"})
    }

}

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }


        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            const result = await user.save();
            return res.status(201).send({ msg: "User registered successfully" });
        } else {
            return res.status(400).send({ error: "Password is required" });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
 

export async function login(req,res){
    const {username,password}=req.body;
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return res.status(404).send({error:"Username not found"})
        }
        const passwordCheck = await bcrypt.compare(password,user.password);
        if(!passwordCheck){
            return res.status(404).send({error:"password doesnot match"})
        }
                //create jwt token
 
               const token= jwt.sign({
                    userId:user._id,
                    username:user.username
                },env.JWT_SECRET,{expiresIn:'24h'});

                return res.status(200).send({
                    msg:"login successful",
                    username:user.username,
                    token:token
                })
    } catch (error) {
        return res.status(500).send({error:error.message})
        
    }
}

export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).send({ error: "Invalid username" });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Could not find the user" });
        }
//removing password from user
//and mongoose return unnecessary data with object so convert it in to Json
        const {password, ...rest}=Object.assign({},user.toJSON());

        return res.status(200).send(rest);
    } catch (error) {
        console.error("Error in getUser:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}


export async function updateUser(req,res){

    try {
       // const id = req.query.id;
       const {userId}=req.user;

      if(!userId){
        return res.status(400).send({error:"User ID is required"})
      }
       
      const body = req.body;
      const updateUser = await UserModel.updateOne({_id:userId},body);
      if(updateUser.nModified ===0){
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).send({msg:"Record Updated successfully"})
    } catch (error) {
        return res.status(500).send({error:"internal server error"})
    }
}

export async function generateOTP(req,res){

   req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
  res.status(201).send({code:req.app.locals.OTP})
}

export async function verifyOTP(req,res){
    const {code}=req.query;
    if(parseInt(req.app.locals.OTP)===parseInt(code))
        {
            req.app.locals.OTP=null;
            req.app.locals.resetSession=true;
            return res.status(201).send({msg:'verified Successfully...!'})
        }
        return res.status(400).send({error:"Invalid OTP"})
}

export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
    req.app.locals.resetSession=false;
    return res.status(201).send({msg:"access granted"})

   }
   return res.status(440).send({error:"session expaired"})
}

export async function resetPassword(req,res){
    try {

        if(!req.app.locals.resetSession) return res.status(440).send({error:"Session expaired...!"})
        const {username,password} = req.body;

        try {
            const user = await UserModel.findOne({username});

            if(!user){
                return res.status(404).send({errpr:"Username not found"});

            }
            const hashedPassword =await bcrypt.hash(password,10);
            await UserModel.updateOne({username:user.username},{password:hashedPassword});
            req.app.locals.resetSession=false;
            return res.status(201).send({msg:"record  updated"})
            
        } catch (error) {
            return  res.status(500).send({error:"Unable to update password"});
        }
        
    } catch (error) {
        return res.status(401).send({error})
    }
}



