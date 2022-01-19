'use strict'
class conf { }
conf.getconfig = function() {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      global.gconf = JSON.parse(data)
    }
  });
}
conf.setconfig = function(win, data) {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  var reg = new RegExp(/\\/g)
  for (var i = 0; i < data.boot.length; i++) {
    data.boot[i] = data.boot[i].replace(reg, '/')
  }
  global.gconf = data
  var confdata = JSON.stringify(data)
  win.webContents.send('initd', data)
  fs.writeFile(path, confdata, function() {
    win.webContents.send('confsaved');
  })
}
module.exports = conf
