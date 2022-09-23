<template>
  <div>
    <div class="closebtn" @click="closebtn()">x</div>
    <div class="max btn" @click="maxbtn()"></div>
    <div class="min btn" @click="minbtn()"></div>
    <div class="menu">
      <!-- <div class="movebox"></div> -->
      <div class="menuline">
        <div :class="[page==1?'on':'',' menubtn']" @click="page=1">[t]ask</div>
        <div :class="[page==6?'on':'',' menubtn']" @click="page=6">note</div>
        <div :class="[page==2?'on':'',' menubtn']" @click="page=2">[s]tarter</div>
        <div :class="[page==4?'on':'',' menubtn']" @click="page=4">t[q]ol</div>
        <div :class="[page==3?'on':'',' menubtn']" @click="page=3">conf</div>
        <div class="menubtn" @click="boot()">&gt;boot</div>
        <div class="menubtn" v-for="(m,id) in menu" :key="id" @click="handle(m.url)">&gt;{{m.name}}</div>
        <div class="menubtn" @click="shut()">&gt;shut</div>
      </div>
    </div>
    <div class="mainbody">
      <Task v-show="page === 1"/>
      <Starter v-show="page === 2"/>
      <Conf v-show="page === 3"/>
      <Tool v-show="page === 4"/>
      <!-- <Watcher v-show="page === 5"/> -->
      <Note v-show="page === 6"/>
    </div>
    <Setapi/>
    <popcheck/>
  </div>
</template>
<script>
import Task from './task/Task'
import Starter from './Starter'
import Conf from './Conf'
import Tool from './Tool'
import popcheck from './popup/check'
import Note from './note/Note'
import Setapi from './Dataapi'
// import Watcher from './Watcher'
export default {
  components: {
    Task,
    Starter,
    Conf,
    Tool,
    popcheck,
    Note,
    Setapi
    // ,Watcher
  },
  name: 'Box',
  data: function() {
    return {
      page: 6,
      menu: []
    }
  },
  created() {
    this.menu = this.$store.state.conf.menu
    this.$ipc.on('setpage', (event, e) => {
      this.setpage(e)
    })
    this.$ipc.on('errmsg', (event, e) => {
      this.showerr(e)
    })
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
  width 100%
  background-color red
.menu a
  margin-left 20px
.mainbody
  margin:34px auto;
  width:90%;
.movebox
  width 100%
  height 30px
  z-index -1
  background-color red
  position absolute
  -webkit-app-region drag
.menuline
  float left
.menubtn
  display inline-block
  padding 0px 15px
  height 30px
  line-height 30px
  color white
  cursor pointer
  background-color red
  -webkit-app-region no-drag
  &:hover
    background-color black
    color red
.on
  background-color black
  color red
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
  color white
  z-index 30
  -webkit-app-region no-drag
.btn
  position fixed
  -webkit-app-region no-drag
  top 0px
  background-color red
  cursor pointer
  z-index 30
.min
  width 30px
  height 26px
  right 80px
  border-bottom solid 4px white
.max
  width 22px
  height 22px
  right 40px
  border solid 4px white
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
div::-webkit-scrollbar-corner
  background-color red
dev::-webkit-resizer
  background-color #000
  border solid 1px red

textarea::-webkit-scrollbar-track
  -webkit-box-shadow inset 0 0 6px rgba(0,0,0,0.3)
  background-color #000
textarea::-webkit-scrollbar
  width 10px
  background-color #000
textarea::-webkit-scrollbar-thumb
  background-color red
textarea::-webkit-resizer
  background-color #000
  border solid 1px red
</style>
