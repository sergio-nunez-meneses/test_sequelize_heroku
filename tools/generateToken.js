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
    id: 1,
    role: 'Admin',
  },
  kid: uuid.v4(),
  exp: 60,
  iss: 'http://localhost:3000'
};

const encodedHeader = encodeTokenStructure(header);
const encodedPayload = encodeTokenStructure(payload);
const signatureInput = encodedHeader.concat('.', encodedPayload);

function encodeTokenStructure(tokenPart) {
  return base64UrlEncode(JSON.stringify(tokenPart));
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
