// import express from 'express'
// import {loginUser, registerUser} from '../controllers/userController.js';

// const userRouter = express.Router();



    
// export default userRouter;

import express from "express";
import {loginUser, registerUser, getProfile, updateProfile } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get("/me", authUser, getProfile);
userRouter.put("/me", authUser, updateProfile);

export default userRouter;
