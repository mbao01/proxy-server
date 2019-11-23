const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Authorization, Content-Type, Accept, *"
    );

    next();
};
  
module.exports = cors;
  