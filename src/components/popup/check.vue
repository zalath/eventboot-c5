<template>
  <div class="popupcheck" v-if="ispopupcheck">
    <a class='checktxt fa fa-check'/>
  </div>
</template>
<script>
export default {
  name: '',
  data: function() {
    return {
      ispopupcheck: false
    }
  },
  created() {
    this.$bus.on('popupcheck', this.show)
  },
  methods: {
    show() {
      this.ispopupcheck = true
      setTimeout(() => {
        this.ispopupcheck = false
      }, 200);
    }
  }
}
</script>
<style lang="stylus" scoped>
.popupcheck
  background-color black
  position fixed
  left 50%
  top 50%
  transform translate(-50%,-50%)
  padding 40px
  border solid 1px red
.checktxt
  font-size 50px
</style>
