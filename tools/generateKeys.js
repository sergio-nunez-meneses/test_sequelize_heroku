const crypto = require('crypto');
const encodeFormat = 'pem';
const publicEncoding = { type: 'spki', format: encodeFormat };
const privateEncoding = { type: 'pkcs8', format: encodeFormat };
var keys = [];

const fs = require('fs');
const path = '../keys/';
var fileName;

crypto.generateKeyPair('rsa', { modulusLength: 2048 },
  function(err, publicKey, privateKey) {
    if (err) {
      return console.error(err);
    }

    keys[publicKey.type] = publicKey.export(publicEncoding);
    keys[privateKey.type] = privateKey.export(privateEncoding);

    saveKeysToFiles(keys);
  }
);

async function saveKeysToFiles(keys) {
  for (var [index, key] of Object.entries(keys)) {
    fileName = `${index}.key`;

    fs.writeFile(`${path}${fileName}`, key, function(err) {
      if (err) {
        return console.log(err);
      }
    });

    console.log(`File ${fileName} was saved successfully!`);
  }
}
