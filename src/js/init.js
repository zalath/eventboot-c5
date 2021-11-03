'use strict'

const exec = require('child_process').exec;
const cpu = require('cpu-stat')
const os = require('os')
class init { }
init.initipc = function (win, ipc, shell, app) {
  ipc.on('bootenv', function (event, e) {
    init.getconfig(init.bootApps)
  })
  ipc.on('initd', function (event, e) {
    init.bootUp(win)
  })
  ipc.on('tobrowser', function (event, arg) {
    shell.openExternal(arg)
  })
  ipc.on('closeapp', function (event) {
    app.exit()
  })
  ipc.on('maxapp', function (event) {
    win.maximize()
  })
  ipc.on('minapp', function (event) {
    win.minimize()
  })
  ipc.on('closewin', function (event) {
    win.close()
  })
  // 配置
  ipc.on('getconfig', function(event) {
    init.getconfig(init.sendconf)
  })
  ipc.on('setconfig', function(event, e) {
    init.setconfig(e);
  })
  // 启动器
  ipc.on('openProject', function (event, args) {
    exec('code ' + args, {});
  })
  ipc.on('openFolder', function (event, args) {
    var path = args.replace(/\//g, '\\');
    exec('explorer ' + path, {});
  })
  ipc.on('stt', function(event, args) {
    init.bootOne()
  })
  ipc.on('shut', function(event, args) {
    init.shut()
  })
  setInterval(() => { init.readbit() }, 1000);
}
var win
init.bootUp = function (window) {
  win = window
  init.getconfig(init.init_main)
}
init.init_main = function (confdata) {
  win.webContents.send('initd', confdata)
}
init.bootApps = function (confdata) {
  var list = confdata.boot
  var i = 0
  while (typeof (list[i]) !== 'undefined') {
    console.log(i)
    console.log(list[i])
    if (list[i].indexOf('/') > 0) {
      exec('"' + list[i] + '"')
    } else {
      exec(list[i])
    }
    i++
  }
}
init.shut = function () {
  console.log('ending tasks')
  exec('taskkill /F /FI "USERNAME eq Administrator"',
    function (e, data) {
      if (e) {
        console.log(e)
        win.webContents.send('errmsg', JSON.stringify(e))
      }
    })
}
// =====
// 配置
// =====

init.sendconf = function(confdata) {
  win.webContents.send('confdata', confdata)
}
init.getconfig = function(func) {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      return func(JSON.parse(data))
    }
  });
}
init.setconfig = function(data) {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  var reg = new RegExp(/\\/g)
  for (var i = 0; i < data.boot.length; i++) {
    data.boot[i] = data.boot[i].replace(reg, '/')
  }
  var confdata = JSON.stringify(data)
  win.webContents.send('initd', data)
  fs.writeFile(path, confdata, function() {
    win.webContents.send('confsaved');
  })
}
init.readbit = function () {
  cpu.usagePercent(init.usagePercent);
  if (win) win.webContents.send('addmemdata', (os.totalmem() - os.freemem()) * 100 / os.totalmem())
  // read disk usage
  // read network usage
}
init.usagePercent = function (msg, rate, diffsecond) {
  if (msg == null) {
    if (win) win.webContents.send('addcpudata', rate);
  }
}
module.exports = init
