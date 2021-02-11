process.env.TZ = 'Europe/Paris';

const crypto = require('crypto');
const fs = require('fs');
const dummyData = require('../config/data');
const algo = {
  HS256: 'SHA256',
  HS384: 'SHA384',
  HS512: 'SHA512',
  RS256: 'RSA-SHA256',
  RS384: 'RSA-SHA384',
  RS512: 'RSA-SHA512',
  ES256: 'RSA-SHA256',
  ES384: 'RSA-SHA384',
  ES512: 'RSA-SHA512'
};

const jwt = generateJwt(
  algo['RS256'],
  {
    userId: dummyData['id'],
    userRole: dummyData['role']
  },
  15
);
const validJwt = verifyJwt(jwt);

console.log('generated jwt:', jwt);
console.log('valid token?', typeof validJwt === 'object' ? validJwt['valid'] : validJwt);

function generateJwt(algo, userData, exp) {
  const header = createHeader(algo);
  const payload = createPayload(userData, exp);

  var tokenStructure = [
    encodeTokenStructure(header),
    encodeTokenStructure(payload)
  ];

  const signInput = tokenStructure.join('.');
  const privateKey = getPrivateKey();
  const signature = createSignature(algo, privateKey, signInput);

  tokenStructure.push(base64UrlEncode(signature));

  return tokenStructure.join('.');
}

function createHeader(algo) {
  return {
    typ: 'JWT',
    alg: algo
  };
}

function createPayload(data, exp) {
  var iat = Date.now();
  var setExp = iat + (exp * 60 * 1000);

  var claims = {
    iat: iat,
    exp: setExp,
    iss: dummyData['iss']
  }
  var payload = Object.assign({ data: data }, claims);

  return payload;
}

function createSignature(algo, privateKey, data) {
  return crypto
    .createSign(algo)
    .update(data)
    .sign(privateKey);
}

function verifyJwt(jwt) {
  if (!jwt.includes('.')) {
    return "Token doesn't contain expected delimiter.";
  }

  if (jwt.split('.').length != 3) {
    return "Token doesn't contain expected structure.";
  }

  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');
  const header = decodeTokenStructure(encodedHeader);
  const payload = decodeTokenStructure(encodedPayload);
  const validHeader = verifyHeader(header);

  if (typeof validHeader !== 'boolean' && validHeader === true) {
    return validHeader;
  }

  const publicKey = getPublicKey();
  const signature = decodeSignature(encodedSignature);
  const signInput = [encodedHeader, encodedPayload].join('.');
  const validSignature = verifySignature(header['alg'], publicKey, signature, signInput);

  if (!validSignature) {
    return 'Invalid token signature.';
  }

  const validPayload = verifyPayload(payload);

  if (typeof validPayload !== 'boolean' && validPayload === true) {
    return validPayload;
  }

  return Object.assign({ valid: true }, payload['data']);
}

function verifyHeader(header) {
  const values = Object.values(algo);

  if (header['typ'] !== 'JWT') {
    return 'Invalid or unsupported token type.';
  }

  if (!values.includes(header['alg'])) {
    return 'Invalid or unsupported sign algorithm.';
  }

  return true;
}

function verifyPayload(payload) {
  if (payload['iss'] !== dummyData['iss']) {
    return 'Invalid token issuer.';
  }

  if (payload['exp'] < Date.now()) {
    return 'Token expired. Please, sign in again.';
  }

  if (payload['iat'] > Date.now()) {
    return 'Token was issued in the future.';
  }

  return true;
}

function verifySignature(algo, publicKey, signature, data) {
  return crypto
    .createVerify(algo)
    .update(data)
    .verify(publicKey, signature);
}

function getPrivateKey() {
  return fs.readFileSync('../keys/private.key', 'utf8');
}

function getPublicKey() {
  return fs.readFileSync('../keys/public.key', 'utf8');
}

function decodeSignature(signature) {
  return Buffer.from(base64UrlDecode(signature), 'base64');
}

function encodeTokenStructure(tokenPart) {
  return base64UrlEncode(JSON.stringify(tokenPart));
}

function decodeTokenStructure(encodedTokenPart) {
  return JSON.parse(Buffer.from(base64UrlDecode(encodedTokenPart), 'base64'));
};

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  str += new Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}
