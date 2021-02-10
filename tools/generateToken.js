const data = require('../config/data');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuid = require('uuid');
const privateKey = fs.readFileSync('../keys/private.key', 'utf8');

const header = {
  typ: 'JWT',
  alg: 'RS256'
};

const payload = {
  user: {
    id: data['id'],
    role: data['role'],
  },
  kid: uuid.v4(),
  exp: 60,
  iss: 'http://localhost:3000'
};

const encodedHeader = encodeTokenStructure(header);
const encodedPayload = encodeTokenStructure(payload);
const signatureInput = encodedHeader.concat('.', encodedPayload);

console.log('encoded header:', encodedHeader);
console.log('decoded header:', encodedPayload);
console.log('encoded payload:', decodeTokenStructure(encodedHeader));
console.log('decoded payload:', decodeTokenStructure(encodedPayload));

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
