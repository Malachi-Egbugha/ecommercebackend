const express = require("express");
const router = express.Router();
const {signup, signin, signout, requireSign} = require('../controllers/auth');
const {userSignupValidator} = require('../validator');
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/hello", requireSign,(req, res)=>{
    res.send("hello there");
});
module.exports = router;