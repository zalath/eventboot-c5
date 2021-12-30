<template>
  <div>
    <div class="closebtn" @click="closebtn()">x</div>
    <div class="max btn" @click="maxbtn()"></div>
    <div class="min btn" @click="minbtn()"></div>
    <div class="menu">
      <div class="movebox"></div>
      <div>
        <div class="menuline">
          <div :class="[page==1?'on':'',' menubtn']" @click="page=1">[t]ask</div>
          <div :class="[page==2?'on':'',' menubtn']" @click="page=2">[s]tarter</div>
          <div :class="[page==3?'on':'',' menubtn']" @click="page=3">con[f]</div>
          <div :class="[page==4?'on':'',' menubtn']" @click="page=4">t[q]ol</div>
          <div :class="[page==5?'on':'',' menubtn']" @click="page=5">[w]atcher</div>
        </div>
        &emsp;
        <span class="menuline menubtn">/</span>
        &emsp;&nbsp;&nbsp;
        <div class="menuline" style="float:right;margin-top:-20px;">
          <div class="menubtn" @click="boot()">boot</div>
          <div class="menubtn" v-for="(m,id) in menu" :key="id" @click="handle(m.url)">{{m.name}}</div>
          <div class="menubtn" @click="shut()">shut</div>
        </div>
      </div>
    </div>
    <div class="mainbody">
      <Task v-show="page === 1"/>
      <Starter v-show="page === 2"/>
      <Conf v-show="page === 3"/>
      <Tool v-show="page === 4"/>
      <Watcher v-show="page === 5"/>
    </div>
  </div>
</template>
<script>
import Task from './Task'
import Starter from './Starter'
import Conf from './Conf'
import Tool from './Tool'
import Watcher from './Watcher'
export default {
  components: {
    Task,
    Starter,
    Conf,
    Tool,
    Watcher
  },
  name: 'Box',
  data: function() {
    return {
      page: 1,
      menu: []
    }
  },
  created() {
    this.$ipc.on('setpage', (event, e) => {
      this.setpage(e)
    })
    this.$ipc.on('errmsg', (event, e) => {
      this.showerr(e)
    })
  },
  computed: {
    confReady: function() {
      return this.$store.state.confReady
    }
  },
  watch: {
    confReady: function(newval, oldval) {
      if (newval === 1) {
        this.menu = this.$store.state.conf.menu
      }
    }
  },
  methods: {
    handle: function(url) {
      this.$ipc.send('tobrowser', url)
    },
    boot: function() {
      this.$ipc.send('bootenv')
    },
    setpage: function(e) {
      this.page = e
    },
    closebtn: function() {
      this.$ipc.send('closeapp')
    },
    maxbtn: function() {
      this.$ipc.send('maxapp')
    },
    minbtn: function() {
      this.$ipc.send('minapp')
    },
    shut: function() {
      this.$ipc.send('shut')
    },
    showerr: function(e) {
      alert(e)
    }
  }
}
</script>
<style lang="stylus" scoped>
.box
  border solid 1px red
div
  color red
.menu
  z-index 20
  top 0px
  position fixed
.menu a
  margin-left 20px
.mainbody
  margin:34px auto;
  width:90%;
.movebox
  width 30px
  height 30px
  background-color red
  float left
  -webkit-app-region drag
.menuline
  float left
.menubtn
  display inline-block
  padding 0px 15px
  height 30px
  line-height 30px
  color red
  cursor pointer
  background-color black
  &:hover
    background-color red
    color white
.on
  background-color red
  color white
.menulinetool
  margin-top 10px
.closebtn
  position fixed
  right 0px
  top 0px
  width 30px
  height 30px
  font-size 57px
  line-height 17px
  cursor pointer
.btn
  position fixed
  top 0px
  background-color black
  cursor pointer
.min
  width 30px
  height 26px
  right 80px
  border-bottom solid 4px red
.max
  width 22px
  height 22px
  right 40px
  border solid 4px red
</style>
<style lang="stylus">
div::-webkit-scrollbar-track
  -webkit-box-shadow inset 0 0 6px rgba(0,0,0,0.3)
  background-color #000

div::-webkit-scrollbar
  width 10px
  background-color #000

div::-webkit-scrollbar-thumb
  background-color red
  background-image -webkit-gradient(linear, 0 0, 0 10%,
    color-stop(.5, rgba(255, 255, 255, .2)),
    color-stop(.5, transparent), to(transparent))
</style>
