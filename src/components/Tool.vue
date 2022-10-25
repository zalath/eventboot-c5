<template>
  <div id="app">
    <div class="toolbox">
      <div class="txtbox">
        <textarea :value="originval" class="txt origin"/>
        <textarea :value="targetval" class="txt target"/>
      </div>
      <div class="cb"/>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        b64.en
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        b64.de
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        url.en
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        url.de
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        md5
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        json
      </div>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        QR
      </div>
      <div class="cb"/>
      <div class="toolbtn clipbtn" @click="copy(ip)">
        {{ip}}
      </div>
      <div class="cb"/>
      <div class="toolbtn clipbtn" @click="copy(timestamps)">
        {{timestamps}}
      </div>
      <div class="toolbtn clipbtn" @click="copy(timestamp)">
        {{timestamp}}
      </div>
      <div class="toolbtn clipbtn" @click="copy(dateval)">
        {{dateval}}
      </div>
      <div class="toolbtn clipbtn" @click="settime()">
        <i class="fa fa-refresh"/>
      </div>
      <div class="cb"/>
    </div>
    <div class="tool1box">
      <input ref="inputCopy" value="for copy" style="opacity:0;position:absolute" />
      <br/>
      <a @click="genclist()">加密列表</a>
      <div class="tlist">
        <div class="tbox">
          <h1>IP</h1>{{ip}}<a class="fa fa-copy" @click="copy(ip)"></a>
          <h1>TIME</h1>
          <div>
            {{timestamps}}
            <a class="fa fa-copy" @click="copy(timestamps)"></a>&emsp;
            {{timestamp}}
            <a class="fa fa-copy" @click="copy(timestamp)"></a>&emsp;
            {{dateval}}
            <a class="fa fa-copy" @click="copy(dateval)"></a>&emsp;
            <textarea class="wNine f20" v-model="dateval" /><br/>
            <a title='convert' class='fa fa-calendar-check-o' @click="convert()"></a>
            &emsp;
            <a title='refresh' class='fa fa-refresh' @click="settime()"></a>
          </div>
          <h1>base64</h1>
          <div>
            <textarea class="wNine f20" v-model="debase64val"/>
            <br/>
            <a class="fa fa-cog" @click="base64()"></a>
            &emsp;
            <a class="fa fa-copy" @click="copy(debase64val)"></a>
            <br />
            <textarea class="wNine f20" v-model="base64val"/>
            <br/>
            <a class="fa fa-cog" @click="debase64()"></a>
            &emsp;
            <a class="fa fa-copy" @click="copy(base64val)"></a>
          </div>
          <h1>url</h1>
          <div>
            <textarea class="wNine f20" v-model="deurlval"/>
            <br/>
            <a class="fa fa-cog" @click="url()"></a>
            &emsp;
            <a class="fa fa-copy" @click="copy(deurlval)"></a>
            <br/>
            <textarea class="wNine f20" v-model="urlval"/>
            <br/>
            <a class="fa fa-cog" @click="deurl()"></a>
            &emsp;
            <a class="fa fa-copy" @click="copy(urlval)"></a>
          </div>
          <h1>md5</h1>
          <div>
            <textarea class="wNine f20" v-model="md5str" />
            <br/>
            <a class="fa fa-cog" @click="md5()"></a>
            &emsp;
            <a class="fa fa-copy" @click="copy(md5str)"></a>
          </div>
          <h1>JSON</h1>
          <div v-if='!jsonpage'>
            <a title='convert' class='fa fa-indent' @click='jsonconvert()'></a>
            <br/>
            <textarea rows="15" class="wNine" v-model='jsonstr' />
          </div>
          <div v-if='jsonpage'>
            <a class="fa fa-times" @click="jsonpage = !jsonpage;jsonstr = ''"></a>
            <br/>
            <pre class="tl wNine ma">{{jsonstrd}}</pre>
          </div>
          <h1>qrcode</h1>
          <div>
            <textarea class="wNine f20" v-model="qrtxt"/>
            <br/>
            <a class="fa fa-cog" @click="qrcode()"></a>
            <br />
            <div class="fa wNine" ref="qrdiv"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
// import Qrcode from 'qrcodejs2'
const Ip = require('ip')
const base64 = require('js-base64').Base64;
// import Cb from 'clipboard'
export default {
  name: 'Tool',
  components: {
  },
  data: function() {
    return {
      dateval: '',
      timestamp: '',
      timestamps: '',
      jsonstr: '',
      jsonstrd: '',
      jsonpage: false,
      closetitle: 'toolclose',
      base64val: '',
      debase64val: '',
      urlval: '',
      deurlval: '',
      md5str: '',
      qrtxt: '',
      ip: Ip.address()
    }
  },
  created: function() {
    this.settime()
  },
  methods: {
    genclist: function() {
      console.log(222)
      this.$ipc.send('genclist')
    },
    settime: function() {
      this.timestamp = new Date().valueOf()
      this.timestamps = parseInt(this.timestamp / 1000)
      this.dateval = this.datefmt(new Date())
    },
    convert: function() {
      this.timestamp = Date.parse(this.dateval)
      this.timestamps = Date.parse(this.dateval) / 1000
      if (isNaN(this.timestamp)) {
        this.timestamps = this.datefmt(new Date(this.dateval * 1000))
      }
    },
    jsonconvert: function() {
      if (this.jsonstr !== '') {
        this.jsonstrd = JSON.parse(this.jsonstr)
        this.jsonpage = true
      }
    },
    copy: function(text) {
      const input = this.$refs.inputCopy
      input.value = text
      input.select()
      document.execCommand('copy')
    },
    datefmt(date) {
      var fmt = 'yyyy-MM-dd hh:mm:ss'
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ''));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
      return fmt;
    },
    base64: function() {
      this.base64val = base64.encode(this.debase64val)
    },
    debase64: function() {
      this.debase64val = base64.decode(this.base64val)
    },
    url: function() {
      this.urlval = encodeURIComponent(this.deurlval)
    },
    deurl: function() {
      this.deurlval = decodeURIComponent(this.urlval)
    },
    md5: function() {
      this.md5str = md5(this.md5str)
    },
    qrcode: function() {
      this.$refs.qrdiv.innerHTML = ''
      // var qr = new Qrcode(this.$refs.qrdiv, {
      //   text: this.qrtxt,
      //   width: 200,
      //   height: 200,
      //   colorDark: '#333',
      //   colorLight: '#fff',
      //   correctLevel: Qrcode.CorrectLevel.L
      // })
      // qr.width = 200
    }
  }
}
</script>

<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
<style scoped lang="stylus">
.wNine
  width 90%
.tl
  text-align left
  font-weight bold
.ma
  margin auto
.tool1box
  margin-top 30px
  overflow auto
textarea
  background-color black
  border solid 1px red
  color red
  outline none
.tbox div
  text-align center
.tlist div
  text-align center
.f20
  font-size 20px
.tbox h1
  text-align left
.toolbox
  position fixed
  right 20px
  bottom 20px
  .txtbox
    position relative
    width 100%
    height 2rem
    margin .8rem .2rem
    .txt
      position absolute
      height 100%
      width 100%
      overflow scroll
    .target
      left -5px
      top -5px
    .origin
      z-index 20
.toolbtn
  margin .3rem .2rem
.cb
  clear both
</style>
