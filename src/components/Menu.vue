<template>
  <div class="menubox">
    <div class="clipbtn" @click="boot()">boot</div>
    <div class="clipbtn" @click="shut()">shut</div>
    <div class="clipbtn" @click="toggleconf()">
      <i class="fa fa-cog"/>
    </div>
    <div class="clipbtn" @click="minbtn()">-</div>
    <div class="clipbtn" @click="maxbtn()">□</div>
    <div class="clipbtn" @click="closebtn()">x</div>
  </div>
</template>
<script>
export default {
  name: 'menubox',
  methods: {
    boot: function() {
      this.$ipc.send('bootenv')
    },
    closebtn: function() {
      this.$ipc.send('closeapp')
    },
    maxbtn: function() {
      this.$ipc.send('maxapp')
    },
    minbtn: function() {
      this.$ipc.send('minapp')
    },
    shut: function() {
      this.$ipc.send('shut')
    },
    toggleconf: function() {
      this.$bus.emit('toggleconf')
    }
  }
}
</script>
<style lang="stylus" scoped>
.menubox
  position fixed
  right 2rem
  top 2rem
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
