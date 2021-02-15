const ash = require('express-async-handler');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'keys/private.key'), 'utf8');

exports.auth = ash(async function(req, res, next) {
  var generatedJwt = req.headers['x-access-token'] || req.headers['x-auth-token'] || req.headers['authorization'];

  console.log('jwt:', generatedJwt); // just for debugging

  if (!generatedJwt || generatedJwt === undefined || generatedJwt === '') {
    return res.status(401).send({
      error: 'Access denied: no token provided.'
    });
  }

  if (typeof generatedJwt !== 'string' && !generateJwt.includes('Bearer')) {
    return res.status(401).send({
      error: 'Access denied: invalid token format.'
    });
  }

  // generatedJwt = generatedJwt.split('Bearer ')[1];

  jwt.verify(generatedJwt, privateKey, {
    algorithms: ['RS256']
  }, function(err, decoded) {
    if (err) {
      return res.status(400).send({
        error: err.message
      });
    }

    req.user = decoded;
    next();
  });
});
