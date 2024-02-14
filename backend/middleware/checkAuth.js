const { sign, verify } = require("jsonwebtoken");

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

  return `Bearer ${loginAccessToken}`;
};

const bearerToken = (value) => {
  const bearerToken = value.split(" ");
  return bearerToken[1];
};

const validateToken = (req, res, next) => {
  const accessToken = req.header("Authorization");

  if (!accessToken) {
    return res.status(400).json({
      message: "No access token found",
    });
  }

  try {
    const validToken = verify(bearerToken(accessToken), process.env.SECRET);
    if (validToken) {
      next();
    } else return res.send(false);
  } catch (error) {
    return res.send(false);
  }
};

module.exports = { createToken, validateToken };
