const bcrypt = require("bcrypt");

const hashPassword = async (rawPassword) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(rawPassword, salt);
};

module.exports = {
  hashPassword,
  comparePasswords: bcrypt.compare,
};
