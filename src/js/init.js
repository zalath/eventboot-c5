'use strict'

const exec = require('child_process').exec;
const cpu = require('cpu-stat')
const os = require('os')
const encpt = require('../js/encpt')
const conf = require('../js/conf')
class init { }
init.initipc = function (win, ipc, shell, app) {
  ipc.on('bootenv', function (event, e) {
    conf.getconfig(win, init.bootApps)
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
    conf.getconfig(win, conf.sendconf)
  })
  ipc.on('setconfig', function(event, e) {
    conf.setconfig(win, e);
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
  ipc.on('genclist', function(event, args) {
    encpt.encemp()
  })
  setInterval(() => { init.readbit() }, 1000);
}
var win
init.bootUp = function (window) {
  win = window
  conf.getconfig(win, init.init_main)
}
init.init_main = function (win, confdata) {
  win.webContents.send('initd', confdata)
}
init.bootApps = function (win, confdata) {
  var list = confdata.boot
  var i = 0
  console.log(confdata)
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
