<template>
  <div class="cb" v-if="line == ''">&nbsp;</div>
  <div v-else class="linepoz" @mouseenter="ishlight=1" @mouseleave="ishlight=0">
    <div class="stline" @click="openProject(line.path)" @contextmenu="openFolder(line.path)">
      <div class="line">
        <div class="linename">{{line.name}}</div>
      </div>
    </div>
    <div class="stline" @click="bash(line.path)">
      <div class="line fa fa-terminal"></div>
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
    },
    bash: function(path) {
      this.$ipc.send('openbash', path)
    }
  },
  created() {
  }
}
</script>
<style lang="stylus" scoped>
.linepoz
  font-size 1.1rem
  float left
  margin 0 .5rem
  .stline
    float left
    cursor pointer
    padding .3rem .7rem
    &:hover
      background red
      color white
.cb
  clear both
</style>
