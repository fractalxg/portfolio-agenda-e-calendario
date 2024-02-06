const jwt = require("jsonwebtoken");

const tokenValidation = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  if (!accessToken) {
    return res.status(400).json({
      errors: [
        {
          msg: "No token found",
        },
      ],
    });
  }

  try {
    const validToken = jwt.verify(accessToken, process.env.SECRET);
    if (validToken){
      // req.validToken = validToken.email;
      req.authenticated = true;
      next()
    }
		
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "Token invalid",
        },
      ],
    });
  }
};

module.exports = tokenValidation
