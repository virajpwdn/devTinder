const {Router} = require("express");
const shopRouter = Router();

shopRouter.get("/premium", (req,res)=>{
    res.send("Hello world this is premium page")
})

module.exports = shopRouter;