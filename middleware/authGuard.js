const jwt = require("jsonwebtoken");

// authGuard
const authGuard = (req, res, next) => {
  console.log("i am guard");
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unAuthorized access authorizationMo" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_SIGNATURE, (err, decode) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "unAuthorized access verify token" });
    }
    req.decode = decode;

    next();
  });
};

module.exports = authGuard;
