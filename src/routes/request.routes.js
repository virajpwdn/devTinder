const {Router} = require('express');
const requestRouter = Router();
const { authenticate } = require("../middlewares/auth");

requestRouter.post("/sendconnectionrequest", authenticate, (req,res)=>{
    const user = req.user;
    res.send("connection successful, welcome user " + user.firstName);
})



module.exports = requestRouter;