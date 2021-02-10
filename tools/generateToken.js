const crypto = require('crypto');
const fs = require('fs');

const dummyData = require('../config/data');
const privateKey = fs.readFileSync('../keys/private.key', 'utf8');
const publicKey = fs.readFileSync('../keys/public.key', 'utf8');
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

const header = createHeader(algo['RS256']);
const payload = createPayload({
  userId: dummyData['id'],
  userRole: dummyData['role']
}, 60);

var tokenStructure = [
  encodeTokenStructure(header),
  encodeTokenStructure(payload)
];

const signatureInput = tokenStructure.join('.');
const signature = createSignature(algo['RS256'], privateKey, signatureInput);

tokenStructure.push(base64UrlEncode(signature));
const jwt = tokenStructure.join('.');

console.log('generated jwt:', jwt);
console.log('valid jwt?', verifySignature(algo['RS256'], publicKey, signature, signatureInput));

function createHeader(algo) {
  return {
    typ: 'JWT',
    alg: algo
  };
}

function createPayload(data, exp) {
  var claims = {
    exp: exp,
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
