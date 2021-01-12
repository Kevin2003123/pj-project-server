const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, 'thisisasecret', {
    expiresIn: '7 days'
  });

  return token;
};

module.exports = generateToken;
