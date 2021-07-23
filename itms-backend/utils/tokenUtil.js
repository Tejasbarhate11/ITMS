const crypto = require('crypto');


exports.encrypt= (text) => {
  var cipher = crypto.createCipher(process.env.TOKEN_ALGO,process.env.TOKEN_SECRET)
  var encrypted = cipher.update(text,'utf8','hex')
  encrypted += cipher.final('hex');
  return encrypted;
}

exports.decrypt = (text) => {
  var decipher = crypto.createDecipher(process.env.TOKEN_ALGO,process.env.TOKEN_SECRET)
  var decrypted = decipher.update(text,'hex','utf8')
  decrypted += decipher.final('utf8');
  return decrypted;
}