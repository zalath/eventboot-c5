<template>
  <div id="app" class="noselect">
    <div class="tlist">
      <h2>starter</h2>
      <div v-for='(s,ind) in config.starter' :key='ind' v-light="ind">
        <span v-drag="ind" class="dragbar">
          <span>{{ind}}:</span>
          <input v-if='s != ""' @change='changeval($event,"starter",ind,"name")' :value='s.name'/>
          <input v-if='s != ""' @change='changeval($event,"starter",ind,"path")' :value='s.path'/>
          <div class="fa fa-times funcbtn" @click="del('starter',ind)"></div>
          <div class="fa fa-reorder funcbtn"></div>
        </span>
      </div>
      <br/>
      <div>
        <div class="fa fa-plus funcbtn" @click="add('starter')"></div>
      </div>

      <h2>menu</h2>
      <div v-for='(s,ind) in config.menu' :key='ind'>
        <span>{{ind}}:</span>
        <input @change='changeval($event,"menu",ind,"name")' :value='s.name'/>
        <input @change='changeval($event,"menu",ind,"url")' :value='s.url'/>
        <div class="fa fa-times funcbtn" @click="del('menu',ind)"></div>
        <!-- <div>{{s.name}}:{{s.id}}:{{s.url}}</div> -->
      </div>
      <br/>
      <div>
        <div class="fa fa-plus funcbtn" @click="add('menu')"></div>
      </div>

      <h2>boot</h2>
      <div v-for='(s,ind) in config.boot' :key='ind'>
        <span>{{ind}}:</span>
        <input @change='changeval($event,"boot",ind,"")' :value='s'/>
        <div class="fa fa-times funcbtn" @click="del('boot',ind)"></div>
      </div>
      <br/>
      <div>
        <div class="fa fa-plus funcbtn" @click="add('boot')"></div>
      </div>
      <div class="fa fa-check cp" @click="setconf()"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Conf',
  components: {
  },
  data: function() {
    return {
      config: {},
      closetitle: 'confclose',
      moving: 0,
      movto: 0
    }
  },
  created: function() {
    if (this.$store.state.confReady === 1) {
      this.initstarter(this.$store.state.conf)
    }
    this.$ipc.on('confsaved', (event, e) => {
      alert('saved');
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
        this.initstarter(this.$store.state.conf)
      }
    }
  },
  directives: {
    drag(el, binding) {
      el.lastElementChild.onmousedown = function(e) {
        var ev = binding.instance;
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        el.style.left = e.pageX - disx - 30 + 'px'
        el.style.top = e.pageY - disy + 'px'
        el.style.position = 'absolute'
        ev.movi = binding.value
        ev.movis = true
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx - 30 + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
          el.style.position = ''
        }
      }
    },
    light(el, binding) {
      el.onmouseenter = function(e) {
        if (binding.instance.movis) {
          el.style.borderTop = 'solid 1px red'
        }
      }
      el.onmouseleave = function() {
        if (binding.instance.movis) {
          el.style.borderTop = ''
        }
      }
      el.onmouseup = function() {
        if (binding.instance.movis) {
          binding.instance.movto = binding.value
          binding.instance.move()
          el.style.borderTop = ''
        }
      }
    }
  },
  methods: {
    initstarter(e) {
      if (e !== null) {
        this.config = e
      }
    },
    add(type) {
      switch (type) {
      case 'starter':
        this.config.starter.push({name: '', path: ''})
        break
      case 'menu':
        this.config.boot.push({name: '', url: ''})
        break
      case 'boot':
        this.config.boot.push('')
        break
      }
    },
    setconf() {
      var c = JSON.parse(JSON.stringify(this.config))
      this.$ipc.send('setconfig', c)
    },
    changeval(e, part, ind, col = '') {
      if (col === '') {
        this.config[part][ind] = e.target.value
      } else {
        this.config[part][ind][col] = e.target.value
      }
    },
    del(type, i) {
      switch (type) {
      case 'starter':
        this.config.starter.splice(i, 1)
        break
      case 'menu':
        this.config.menu.splice(i, 1)
        break
      case 'boot':
        this.config.boot.splice(i, 1)
        break
      }
    },
    emptyline(i) {
      this.config.starter.splice(i, 0, '')
    },
    move() {
      if (this.movi < this.movto) {
        this.movto -= 1
      }
      var c = JSON.parse(JSON.stringify(this.config.starter[this.movi]))
      this.config.starter.splice(this.movi, 1)
      this.config.starter.splice(this.movto, 0, c)
      this.movis = false
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  margin-top 30px
  overflow auto
.funcbtn
  margin-left 10px
  cursor pointer
.movbar
  position absolute
.noselect
  user-select none
input
  background-color black
  border none
  border-bottom solid 1px red
  color red
  outline none
  width 40%
</style>
