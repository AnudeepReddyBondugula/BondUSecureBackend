import express from 'express';
import registerController from "../controllers/auth/registerController.js";
import loginController from "../controllers/auth/loginController.js";

const router = express.Router();

router
    .route('/register')
    .post(registerController)
    
router
    .route('/login')
    .post(loginController)


export default router;