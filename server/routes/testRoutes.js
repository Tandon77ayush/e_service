import express from "express";

import {
  protect,
  adminOnly,
  providerOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();



router.get(
  "/profile",
  protect,
  (req, res) => {

    res.json({
      message:
        "Protected profile route",

      user: req.user,
    });

  }
);



router.get(
  "/admin",
  protect,
  adminOnly,
  (req, res) => {

    res.json({
      message:
        "Welcome Admin",
    });

  }
);


router.get(
  "/provider",
  protect,
  providerOnly,
  (req, res) => {

    res.json({
      message:
        "Welcome Provider",
    });

  }
);

export default router;