<template>
  <div id="app">
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
    if (this.confReady === 1) {
      this.stList = this.$store.state.conf.starter
    }
  },
  computed: {
    confReady: function () {
      return this.$store.state.confReady
    }
  },
  watch: {
    starterReady: function (newst, oldst) {
      if (newst === 1) {
        console.log('st is ready')
        this.stList = this.$store.state.conf.starter
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  margin-top 30px
</style>
