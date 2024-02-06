const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const accessToken = req.header("access-token");

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
    const validToken = jwt.verify(token, process.env.SECRET);
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
