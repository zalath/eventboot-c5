<template>
  <div class='space'>
    <div class="searchbar">
      <input type="text" v-model="searchval" />
      <a class='fa fa-search' @click='search()' />
    </div>
    <taskline v-for="(lin) in lins" :lin='lin' :key='lin.id'/>
  </div>
</template>
<script>
import taskline from './Taskline';
import req from '../js/req';
export default {
  name: 'searchpad',
  props: {
    title: String
  },
  components: {
    taskline
  },
  data: function() {
    return {
      lins: {},
      searchval: ''
    }
  },
  created: function() {
  },
  methods: {
    search() {
      this.lins = {}
      var that = this
      console.log(this.searchval)
      if (this.searchval === '') {
        console.log('err')
        return
      }
      req.post(this.$store.state.conf, 'find', { key: this.searchval}).then((res) => {
        console.log('searching')
        that.lins = res.data
        console.log(res.data)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.space
  position absolute
</style>
