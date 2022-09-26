<template>
  <div class="filelistbox">
    <div class="filelist">
      <div class="filebox" v-for="(file,index) in filelist" :key="index">
        <img class="file" :src="baseurl+file"/>
      </div>
    </div>
    <div class="fileadd fa fa-plus" v-on:click="addpic()"></div>
    <input type="file" ref="file" class="hide" @change="uploadfile($event)"/>
    <div class="bigpicdisplay">
      <img :src="bigpic">
    </div>
  </div>
</template>

<script>
import req from '../js/req'
export default {
  name: 'file',
  props: {
    lin: {}
  },
  data: function() {
    return {
      bigpic: '',
      filelist: [],
      baseurl: '',
      flin: {}
    }
  },
  created: function() {
    this.baseurl = this.$store.state.conf.conf.api
    console.log(this.baseurl)
    this.flin = this.lin
    this.filelist = this.flin.file.split(',')
  },
  methods: {
    addpic() {
      this.$refs.file.click()
    },
    uploadfile(event) {
      event.preventDefault();
      var formData = new FormData()
      var file = this.$refs.file.files[0]
      formData.append('file', file)
      console.log(this.lin.id)
      req.upload(this.$store.state.conf, 'fupload', formData).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist.push(res.data)
            console.log(this.flin)
            console.log(this.filelist)
            this.flin.file = this.filelist.join(',')
            console.log(this.flin.file)
            req.post(this.$store.state.conf, 'nsave', this.flin)
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.fileadd
  border solid 1px red
  padding 3px
  width 15px
  height 15px
  text-align center
  &:hover
    background-color red
    color black
.filebox
  display inline-block
  height 6rem
  width 6rem
  transform rotate3d(40,-200,-20,55deg)
  transform-origin left
  margin-left -3rem
.file
  border solid 1px red
  height 6rem
  width 6rem
  margin-top 1rem
  &:hover
    margin-top 0rem
    border-bottom solid 1rem rgba(0,0,0,0)
.filelist
  margin-left 4rem
  height 8rem
.filelistbox
  margin 2rem 0px
.fileadd
  margin .5rem 0px
.hide
  display none
</style>
