const User = require('../models/user');

exports.userById = (req, res, next, id) =>{
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile =user;
        next();
    });
};

exports.read = (req, res)=>{
    req.profile.hashed_password = undefine;
    req.profile.salt = undefine;
    return res.json(req.profile);

}

exports.update = (req, res)=>{
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
         {new: true},
         (err, user) =>{
             if(err)
             {
                 return res.status(400).json({
                     error: "You are not authorize to perform this action"
                 });
             }
             user.hashed_password = undefine;
             user.salt = undefine;
             res.json(user);
         }
         );
}