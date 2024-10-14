import { Router } from "express";
import Auth ,{localVariables} from "../middleware/auth.js"
import { registerMail } from "../controllers/mailer.js";

const router = Router();
import * as controller from '../controllers/appController.js'

//post methods
router.route('/verifyuser').post(controller.verifyUser,(req,res)=>{res.end()});
router.route('/register').post(controller.register);
 
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end());
router.route('/login').post(controller.verifyUser,controller.login);

//Get Method
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);



//put method


router.route('/updateuser').put(Auth,controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);






export default router;
