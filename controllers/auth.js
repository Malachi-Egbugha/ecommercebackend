const User = require('../models/user');
const jwt = require('jsonwebtoken');// to generate signed token
const expressJwt = require("express-jwt");//for authorization
const ErrorResponse = require('../util/errorResponse');
exports.signup= async (req, res, next) => {
   try{    
   const user = new User(req.body);
   await user.save();
   res.json({user});
   }catch(err)
   {
       
       next(err);
   }
};



exports.signin = async (req, res, next) => {
    try{
    //find the user based on email
    const {email, password} = req.body;
    const user =await User.findOne({email});
    if( !user)
    {
        return res.status(400).json({
            error: "User with the email does not exit. Please signup"
        });
    }
   
    //if user is found make sure password match
    //create authentication method in user model
    if(!user.authenticate(password))
    {
        return res.status(401).json({
            error: "email and password dont match"
        })

    }
    //generate a signed token with user id and secret
    const token = jwt.sign({_id:user._id}, "jutyu56yr");
    //persist the token as 't' in cookie with expiring date
    res.cookie('t', token, {expire: new Date() + 9999});
    //return response with user and token to client frontend
    const {_id, name, role} = user;
    return res.json({token,user: {_id, email, name, role}});
}
catch(err)
{
    next(err);
}
}


exports.signout = (req, res, next) => {
    res.clearCookie("t");
    res.json({message: "Signout Success"});

};

exports.requireSign = expressJwt({
    secret: "jutyu56yr",
    algorithms : ['sha1', 'RS256', 'HS256'],
    userProperty: "auth",
});
exports.isAuth = (req, res, next) =>
{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    console.log(req.auth._id);
    console.log(req.profile._id);
    console.log(user);
    if(!user){
        return res.status(403).json({
            error: "Access Denied"
        });

    }
    next();

};
exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error: 'Admin resource'
        });

    }
    next();

}
