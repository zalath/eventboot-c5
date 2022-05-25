<template>
  <div class='space'>
    <div>
      <a class='tik tikall' @click='withtik(-1)' />
      <a class='tik tik0' @click='withtik(0)' />
      <a class='tik tik1' @click='withtik(1)' />
      <a class='tik tik2' @click='withtik(2)' />
      <a class='tik fa fa-plus' @click='add()' />
    </div>
    <Taskline v-for='(lin) in lins' :lin='lin' :key='lin.id'/>
  </div>
</template>
<script>
import Taskline from './Taskline';
import req from '../js/req';
export default {
  name: 'Taskwin',
  props: {
    title: String
  },
  components: {
    Taskline
  },
  data: function() {
    return {
      pid: 0,
      lins: {}
    }
  },
  created: function() {
    this.getlins();
    this.$bus.on('new0', this.donew)
    this.$bus.on('edit0', this.doedit)
    this.$bus.on('del0', this.dodel)
  },
  methods: {
    getlins() {
      // console.log(this.pid);
      req.post(this.$store.state.conf, 'list', { id: this.pid }).then((res) => {
        // console.log(res)
        this.lins = res.data;
      });
    },
    withtik(tik) {
      this.$bus.emit('withtik', tik);
    },
    add() {
      this.$bus.emit('new', {pid: 0})
    },
    donew(da) {
      this.lins.push(da)
    },
    doedit(da) {
      var i = this.lins.map((item) => item.id).indexOf(da.id)
      this.lins[i] = da
    },
    dodel(id) {
      var i = this.lins.map((item) => item.id).indexOf(id)
      this.lins.splice(i, 1)
    }
  }
}
</script>
<style lang="stylus">
.tik0
  background-color gray
.tikname0
  color gray
//green
.tik1
  background-color #00d944
.tikname1
  color #00d944
//red
.tik2
  background-color red
.tikname2
  color red
.tikall
  background-color white
.tiknameall
  color white
.tik
  width 10px
  height 10px
  display inline-block
  margin-left 5px
  border-bottom-right-radius 50%
  border-top-right-radius 50%
  border-bottom-left-radius 50%
a
  cursor pointer
</style>
