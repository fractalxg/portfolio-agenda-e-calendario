const {sign, verify} = require("jsonwebtoken");

const createToken = (payload) => {
  const loginAccessToken = sign(
    {
      login: payload,
    },
    process.env.SECRET,
    {
      expiresIn: "1h",
    }
  );

  return loginAccessToken;
}

const validateToken = (req, res, next) => {
  const accessToken = req.header("Authorization");

  if (!accessToken) {
    return res.status(400).json({
      message: "No access token found",
    });
  }

  try {
    const validToken = verify(accessToken, process.env.SECRET);
    if (validToken) {
      // req.validToken = validToken.email;
      req.authenticated = true;
      next();
    }
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Token",
    });
  }
};

module.exports = {createToken, validateToken};
