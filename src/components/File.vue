<template>
  <div class="filelistbox">
  <div class="filelist">
  <img src=""/>
    </div>
    <div class="fileadd fa fa-plus" v-on:click="addpic()"></div>
  </div>
</template>

<script>
export default {
  name: 'file',
  props: {
    lin: {}
  },
  data: function() {
    return {
    }
  },
  created: function() {
  },
  methods: {
    addpic() {
    }
  }
}
</script>

<style lang="stylus" scoped>
.filelistbox
  line-height 100px
.fileadd
  border solid 1px red
  padding 3px
  width 15px
  height 15px
  text-align center
  &:hover
    background-color red
    color black
</style>
