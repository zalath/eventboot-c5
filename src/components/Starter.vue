<template>
  <div id="app" class="app">
    <div class="tlist">
      <stLine v-for="(line,ind) in stList" :line="line" :key="ind"></stLine>
    </div>
  </div>
</template>

<script>
import stLine from './Starterline'
export default {
  name: 'App',
  components: {
    stLine
  },
  data: function() {
    return {
      stList: [],
      closetitle: 'starterclose',
      stlLeft: 0
    }
  },
  created: function() {
    this.initstart()
  },
  methods: {
    initstart: function() {
      this.stList = this.$store.state.conf.starter
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  max-height 90%
  overflow-y scroll
</style>
