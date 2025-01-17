import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middleware/milter.middleware.js";


const router = Router()

router.route ("/register").post(
  upload.fields([
    {
        name: "Avatar",
        maxCount: 1
    }, 
    {
        name: "coverImage",
        maxCount: 1
    }
]),
  registerUser)

export default router