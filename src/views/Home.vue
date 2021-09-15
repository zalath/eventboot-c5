<template>
  <div class="home">
    <box></box>
  </div>
</template>

<script>
import Box from '@/components/Box'

export default {
  name: 'Home',
  components: {
    Box
  },
  data: function() {
    return {
      config: {}
    }
  },
  created() {
    var that = this
    console.log('make window')
    this.$ipc.on('initd', (event, e) => {
      this.$store.commit('setConf', e)
      this.$store.commit('setConfReady', 1)
    })
    this.$ipc.send('initd')
    this.$ipc.on('confsaved', (event, e) => {
      console.log('ok')
    })
    this.$ipc.on('confdata', (event, e) => {
      var c = JSON.parse(JSON.stringify(e))
      that.$ipc.send('setconfig', c)
    })
  },
  methods: {
    saveconf: function() {
      this.$ipc.send('getconfig')
    }
  }
}
</script>
<style lang="stylus" scoped>
.savebtn
  position absolute
  color red
  border solid 1px red
  left 0px
  cursor pointer
</style>
