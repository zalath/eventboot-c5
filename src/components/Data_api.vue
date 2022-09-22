<template>
  <div class='space' v-if="showsetapi">
    <div class="inputbar">
      <input class="fs30" type="text" v-model="apiurl" />
      <input class="fs30" type="text" v-model="apiport" />
      <a class='fs30 fa fa-refresh' @click='reload()' />
    </div>
  </div>
</template>

<script>
export default {
  name: 'setapi',
  components: {
  },
  data: function() {
    return {
      showsetapi: false,
      apiurl: 'http://192.168.',
      apiport: ':10488'
    }
  },
  created() {
    this.$bus.on('showsetapi', this.show)
  },
  methods: {
    reload() {
      this.$store.state.conf.conf.api = this.apiurl + this.apiport + '/'
      var c = JSON.parse(JSON.stringify(this.$store.state.conf))
      this.$ipc.send('setconfig', c)
      this.$bus.emit('taskreload')
      this.showsetapi = false
    },
    show(val) {
      if (val) {
        this.showsetapi = val
      } else {
        this.showsetapi = !this.showsetapi
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.space
  position absolute
  width 90%
  background-color black
  z-index 10
  text-align center
  padding 3%
  border solid 1px red
.inputbar
  width 100%
.inputbar input
  display inline-block
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.fs30
  font-size 30px
.fs25
  font-size 25px
.fa-search
  display inline-block
</style>
