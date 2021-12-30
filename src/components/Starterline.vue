<template>
  <div v-if="line == ''">&nbsp;</div>
  <div v-else class="linepoz" @mouseenter="ishlight=1" @mouseleave="ishlight=0">
    <div class="stline" @click="openProject(line.path)" @contextmenu="openFolder(line.path)">
      <div class="line">
        <div class="linename">{{line.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'stLine',
  components: {
  },
  props: {
    line: {}
  },
  data: function() {
    return {
      stlLeft: 0,
      ishlight: 0
    }
  },
  methods: {
    openProject: function(path) {
      this.$ipc.send('openProject', path)
    },
    openFolder: function(path) {
      this.$ipc.send('openFolder', path)
    }
  },
  created() {
  }
}
</script>
<style lang="stylus" scoped>
.stline
  height 30px
  cursor pointer
  z-index 10
  border solid 1px black
  &:hover
    background-color red
    .line {
      background-color red
      color white
    }
.line
  color red
  background-color black
  margin 0px 2%
  position absolute
  height 30px
  line-height 30px
  z-index 10
.linepoz
  margin auto
</style>
