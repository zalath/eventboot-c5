<template>
  <div class="filelistbox">
    <div class="filelist">
      <div class="filebox" v-for="(file,index) in filelist" :key="index">
        <img class="file" @click="tobigpic(baseurl+file)" :src="baseurl + file"/>
        <div>
          <button class="fileboxbtn fa fa-refresh" @click="changefile(index)" />
          <button class="fileboxbtn fa fa-times" @click="delfile(index)"/>
        </div>
        <input type="file" :ref="'file' + index" @change="tempfile($event, index)"/>
      </div>
    </div>
    <div class="fileadd fa fa-plus" v-on:click="addfile()"></div>
    <input type="file" ref="file" class="hide" @change="uploadfile($event)"/>
    <div class="bigpicdisplay" @click="showbigpic=false" v-if="showbigpic">
      <img :src="bigpic">
    </div>
  </div>
</template>

<script>
import req from '../js/req'
export default {
  name: 'file',
  props: {
    lin: {},
    filefrom: String
  },
  data: function() {
    return {
      bigpic: '',
      showbigpic: false,
      filelist: [],
      files: [],
      baseurl: '',
      flin: {},
      refreshindex: false
    }
  },
  created: function() {
    this.$bus.on('', confirm())
    this.baseurl = this.$store.state.conf.conf.api
    console.log(this.baseurl)
    this.flin = this.lin
    this.filelist = this.flin.file && this.flin.file !== '' ? this.flin.file.split(',') : []
  },
  methods: {
    confirm() {},
    tobigpic(url) {
      this.showbigpic = true
      this.bigpic = url
    },
    delfile(i) {
      this.delreq(i, this.filelist[i], true)
    },
    delreq(i, file) {
      req.post(this.$store.state.conf, 'fdel', {del: file}).then((res) => {
        if (res.status) {
          if (res.data === 'done') {
            this.savenote()
          }
        }
      })
    },
    changefile(i) {
      this.refreshindex = i
      console.log(i)
      this.addfile()
    },
    addfile() {
      this.$refs.file.click()
    },
    tempfile(event, i) {
      event.preventDefault();
      var file = this.$refs.file.files[0]
      this.files[i] = file
    },
    tempdel(i) {
      this.files[i] = null
    },
    handlefile() {
      for (var i in this.files) {
        this.doupload(this.files[i], i)
      }
      this.savenote()
    },
    doupload(file, i) {
      var formData = new FormData()
      formData.append('file', file)
      req.upload(this.$store.state.conf, 'fupload', formData).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist[i] = res.data
          }
        }
      })
    },
    savenote() {
      this.flin.file = this.filelist.join(',')
      var cmd = 'save'
      if (this.filefrom === 'note') {
        cmd = 'nsave'
      }
      req.post(this.$store.state.conf, cmd, this.flin)
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
  width 6rem
  transform rotate3d(40,-200,-20,55deg)
  transform-origin left
  margin-left -3rem
  padding-top 1rem
  &:hover
    padding-top 0rem
    .fileboxbtn{
      display inline-block
    }
.file
  border solid 1px red
  height 6rem
  width 6rem
.fileboxbtn
  display none
  width 49%
  background none
  border solid 1px red
  color red
  &:hover
    color white
    background red
.filelist
  margin-left 4rem
  height 8rem
.filelistbox
  margin 2rem 0px
.fileadd
  margin .5rem 0px
.hide
  display none
.bigpicdisplay
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  border solid 1px red
  border-bottom solid 6px red
.bigpicdisplay img
  max-width 50rem
  max-height 50rem
</style>
