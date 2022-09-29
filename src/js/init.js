'use strict'
const exec = require('child_process').exec;
const cpu = require('cpu-stat')
const os = require('os')
const encpt = require('../js/encpt')
const conf = require('../js/conf');
const { dialog } = require('electron');
// const { DownloadItem } = require('electron');
global.isloaded = false
conf.getconfig()
class init {
}
init.saveUrl = ''
init.initipc = function (win, ipc, shell, app) {
  this.win = win
  ipc.on('bootenv', function (event, e) {
    init.bootApps()
  })
  ipc.on('initd', function (event, e) {
    win.webContents.send('initd', global.gconf)
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
    if (global.gconf) {
      win.webContents.send('loaded', global.gconf)
    } else {
      win.webContents.send('nload')
    }
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
  ipc.on('openbash', function (event, args) {
    exec('"C:/Program Files/Git/git-bash.exe" --cd=' + args, {})
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
  ipc.on('download', function(event, args) {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }).then(files => {
      init.saveUrl = files.filePaths[0] + '\\' + args.name;
      if (!init.saveUrl || files.canceled === true) return;
      win.webContents.downloadURL(args.path);
    })
  })
  init.watchdownload(win)
  // setInterval(() => { init.readbit() }, 1000);// 读取cpu使用量
}
init.watchdownload = function (win) {
  win.webContents.session.on('will-download', (e, item, webContents) => {
    item.setSavePath(init.saveUrl)
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        win.webContents.send('downloadRate', 'shut')
      } else if (state === 'progressing') {
        var rate = item.getReceivedBytes() / item.getTotalBytes() * 100
        win.webContents.send('downloadRate', rate)
      }
    })
  })
}
init.bootApps = function () {
  var list = global.gconf.boot
  var i = 0
  while (typeof (list[i]) !== 'undefined') {
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
        init.win.webContents.send('errmsg', JSON.stringify(e))
      }
    })
}
init.readbit = function () {
  cpu.usagePercent(init.usagePercent);
  if (init.win) {
    init.win.webContents.send('addmemdata', (os.totalmem() - os.freemem()) * 100 / os.totalmem())
  }
}
init.usagePercent = function (msg, rate, diffsecond) {
  if (msg == null) {
    if (init.win) init.win.webContents.send('addcpudata', rate);
  }
}
module.exports = init
