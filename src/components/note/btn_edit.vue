<template>
  <a class='fa fa-pencil' @click='edit()'></a>
</template>
<script>
export default {
  name: 'btn_edit',
  props: {
    lin: {}
  },
  data: function () {
    return {
      tlin: this.lin
    }
  },
  methods: {
    edit() {
      this.$bus.emit('nedit', { lin: this.tlin })
    }
  }
}
</script>
