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

console.log('generated jwt:');
console.log(generateJwt(
  algo['RS256'],
  {
    userId: dummyData['id'],
    userRole: dummyData['role']
  },
  15
));

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
  var setExp = new Date(Date.now());
  setExp.setMinutes(setExp.getMinutes() + exp);

  var claims = {
    exp: setExp,
    iss: dummyData['iss']
  }
  var payload = Object.assign(data, claims);

  return payload;
}

function createSignature(algo, privateKey, data) {
  return crypto
    .createSign(algo)
    .update(data)
    .sign(privateKey);
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

function encodeTokenStructure(tokenPart) {
  return base64UrlEncode(JSON.stringify(tokenPart));
}

function decodeTokenStructure(encodedTokenPart) {
  return JSON.parse(Buffer.from(base64UrlDecode(encodedTokenPart),'base64'));
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
