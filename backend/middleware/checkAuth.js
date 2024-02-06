const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const accessToken = req.header("x-auth-token");

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
      req.user = user.email;
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
