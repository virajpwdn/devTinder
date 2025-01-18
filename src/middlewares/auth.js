const authenticate = (req, res, next) => {
    console.log("Auth is checking");
  const tocken = "xyz";
  const isAdminAuthorized = tocken === "xyz";
  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized Access");
  }
}

module.exports = {
    authenticate,
}