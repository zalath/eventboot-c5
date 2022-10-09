<template>
  <div class="cb" v-if="line == ''">&nbsp;</div>
  <div v-else class="linepoz" @mouseenter="ishlight=1" @mouseleave="ishlight=0">
    <div class="stline" @click="click()" @contextmenu="contentMenu()">
      <div class="line">
        <div class="linename">{{line.name}}</div>
      </div>
    </div>
    <div v-if="line.type === 'project'" class="stline" @click="bash(line.path)">
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
    click: function() {
      switch (this.line.type) {
      case 'project' :
        this.openProject(this.line.path)
        break;
      case 'app' :
        this.$ipc.send('stt', this.line.path)
        break;
      case 'file' :
        this.openProject(this.line.path)
        break;
      case 'folder' :
        this.openFolder(this.line.path)
        break;
      }
    },
    contentMenu: function() {
      switch (this.line.type) {
      case 'project' :
        this.openFolder(this.line.path)
        break;
      }
    },
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
    position relative
    float left
    cursor pointer
    margin 0 .3rem .2rem 0
    padding .2rem .7rem
    border solid 2px red
    &::before
      background-color: black;
      border-top: 2px solid red;
      bottom: -3px;
      content: "";
      height: 6px;
      left: -5px;
      position: absolute;
      transform: rotate(45deg);
      width: 12px;
    &::after
      background-color: black;
      border-bottom: 2px solid red;
      top: -3px;
      content: "";
      height: 6px;
      right: -5px;
      position: absolute;
      transform: rotate(45deg);
      width: 12px;
    &:hover
      background red
      color white
.cb
  clear both
  height .7rem
</style>
