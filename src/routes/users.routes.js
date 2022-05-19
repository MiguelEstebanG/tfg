import { Router } from "express";
import {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  deleted,
} from "../controllers/users.controller.js";

const router = Router();

// Routes
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

router.get("/users/delete", deleted);

export default router;
