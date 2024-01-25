const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    // check if the roles in the request exists in the roles array
    const result = req.roles
      .map((role) => rolesArray.includes(role))// this returns true or false only
      .find((val) => val === true);// checks if it was true for at least one role in the request
    if (!result) {
      return res.sendStatus(401);
    }
    next();
  };
};
module.exports = verifyRoles;
