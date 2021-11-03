<template>
  <div>
    <div v-if='isshow' v-on='{ mouseenter: showbtn, mouseleave: hidebtn }'>
      <div :class="'tik tik'+tlin.tik" @click='tik()'></div>
      <a :class="'tikname' + tlin.tik" @click='showlins()'>{{ tlin.title }}
        <!-- <a v-if='tlin.ct > 0'>{{ tlin.ct }}</a> -->
      </a>
      <template v-if="lin.tikc.length > 0">
        <a v-for="(t) in lin.tikc" :key="t.tik">
          <a :class="'fa tikname'+t.tik">{{t.c}}</a>
        </a>
      </template>
      <template v-if='isbtn'>
        <a class='fa fa-plus' @click='newl()'></a>
        <a class='fa fa-pencil' @click='edit()'></a>
        <a class='fa fa-refresh' @click='refresh()' v-if='tlin.ct > 0'></a>
        <a class='fa fa-times' @click='toggledel()'></a>
        <div class='isdel' v-if='isdel'>
          you sure?
          <a class='fa fa-check' @click='del()' />
        </div>
      </template>
      <pre class='cmt' v-if='tlin.cmt != ""'>{{ tlin.cmt }}</pre>
    </div>
    <div v-if='showchild'>
      <Taskline v-for='li in tlin.Child' :lin='li' :key='li.id' />
    </div>
  </div>
</template>
<script>
import req from '../js/req';
export default {
  name: 'Taskline',
  props: {
    lin: {}
  },
  data: function () {
    return {
      showchild: false,
      isbtn: false,
      isdel: false,
      isshow: true,
      tlin: this.lin,
      ishlight: 0
    }
  },
  created() {
    this.$bus.on('new' + this.tlin.id, this.donew)
    this.$bus.on('edit' + this.tlin.id, this.doedit)
    this.$bus.on('del' + this.tlin.id, this.dodel)
    this.$bus.on('withtik', this.withtik)
  },
  methods: {
    showlins() {
      if (this.tlin.ct > 0 && this.tlin.Child == null) {
        this.getlins()
      }
      this.showchild = !this.showchild
    },
    refresh() {
      this.tlin.Child = null
      this.getlins()
    },
    getlins() {
      var that = this
      req.post('list', { id: this.tlin.id }).then((res) => {
        that.tlin.Child = res.data
      })
    },
    tik() {
      if (this.tlin.tik === 2) {
        this.tlin.tik = 0
      } else {
        this.tlin.tik += 1
      }
      req.post('tik', { id: this.tlin.id, tik: this.tlin.tik })
    },
    newl() {
      this.$bus.emit('new', { pid: this.tlin.id })
    },
    edit() {
      this.$bus.emit('edit', { lin: this.tlin })
    },
    del() {
      req.post('del', { id: this.tlin.id }).then((res) => {
        if (res.data === 'done') {
          this.$bus.emit('del' + this.tlin.pid, this.tlin.id)
        }
      })
    },
    donew(da) {
      if (this.tlin.Child != null) this.tlin.Child.push(da)
      this.tlin.ct += 1
    },
    doedit(da) {
      this.tlin = da
    },
    dodel(id) {
      this.tlin.ct -= 1
      var i = this.tlin.Child.map((item) => item.id).indexOf(id)
      this.tlin.Child.splice(i, 1)
    },
    showbtn() {
      this.isbtn = true
    },
    hidebtn() {
      this.isbtn = false
    },
    toggledel() {
      this.isdel = !this.isdel
    },
    withtik(tik) {
      if (tik === -1) {
        this.isshow = true
      } else if (this.tlin.tik === tik) {
        this.isshow = true
      } else {
        this.isshow = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
div
  text-align left
  margin-left 10px
  margin-top 5px
a
  text-align left
  margin-left 10px
.cmt
  margin-left 30px
  color #999
.isdel
  display inline-block
.fblack
  color black
  padding 3px
</style>
