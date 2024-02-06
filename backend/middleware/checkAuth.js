const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "No token found",
        },
      ],
    });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET);
		req.user = user.email;
		next()
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
