const authenticate = (req, res, next) => {
    console.log("Auth is checking");
    const tocken = "abc";
    const isAuthorized = tocken === "abc";
    if (isAuthorized) {
      next();
    } else {
      res.status(401).send("You are not authorized");
    }
  }

  module.exports = {
    authenticate,
  }