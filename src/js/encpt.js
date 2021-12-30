'use strict'

const cyt = require('crypto');
class encpt { }
encpt.getencyt = function() {
  return cyt.getHashes()
}
encpt.encemp = function(url) {
  // encpt.test()
  const str = 'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd';
  console.log(str)
  console.log('1')
  const enced = encpt.enc(str)
  console.log(enced)
  console.log('1')
  const dec = encpt.dec(enced)
  console.log(dec)
  console.log('1')
}
encpt.enc = function(str) {
  var encing = '';
  var enced = '';
  const password = 'FnJL7EDzjqWjcaY9';
  const iv = 'FnJL7EDzjqWjcaY9';
  const crypto = require('crypto');
  while (str.length) {
    encing = str.slice(0, 15)
    str = str.slice(15)
    const cipher = crypto.createCipheriv('aes-128-cbc', password, iv);
    cipher.update(encing, 'utf8', 'hex')
    const data3 = cipher.final('hex');
    enced = enced + data3 + '-V-';
  }
  return enced
}
encpt.dec = function(enced) {
  var dec = ''
  const deencing = enced.split('-V-')
  const password = 'FnJL7EDzjqWjcaY9';
  const iv = 'FnJL7EDzjqWjcaY9';
  const crypto = require('crypto');
  for (var i = 0; i < deencing.length; i++) {
    if (deencing[i] === '') break;
    const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
    decipher.update(deencing[i].toString(), 'hex', 'utf8')
    const data4 = decipher.final().toString()
    dec = dec + data4
  }
  return dec
}
module.exports = encpt
