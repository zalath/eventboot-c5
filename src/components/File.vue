<template>
  <div class="filelistbox">
    <div class="filelist">
      <div class="filebox" v-for="(file,index) in fileshow" :key="index">
        <div v-if="files[index] != 'del'">
          <img class="file" @click="toBigpic(file)" :src="file"/>
          <div>
            <button class="fileboxbtn fa fa-refresh" @click="changeFile(index)" />
            <button class="fileboxbtn fa fa-times" @click="delFile(index)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="fileadd fa fa-plus" v-on:click="addFile()"></div>
    <input type="file" ref="file" class="hide" @change="tempFile($event)"/>
    <div class="bigpicdisplay" @click="showbigpic=false" v-if="showbigpic">
      <img :src="bigpic">
    </div>
    <button @click="confirm()" value="click"/>
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
      fileshow: [],
      files: [],
      baseurl: '',
      flin: {},
      refreshindex: false,
      newindex: 0
    }
  },
  created: function() {
    this.$bus.on('editdone', this.confirm)
    this.flin = this.lin
    this.filelist = this.flin.file && this.flin.file !== '' ? this.flin.file.split(',') : []
    this.baseurl = this.$store.state.conf.conf.api
    for (var i in this.filelist) {
      this.fileshow[i] = this.baseurl + this.filelist[i]
    }
    this.newindex = this.filelist.length
  },
  methods: {
    confirm(nlin) {
      this.tlin = nlin
      console.log('indone------------------------------')
      console.log(this.filelist)
      console.log(this.files)
      console.log(this.fileshow)
      for (var i in this.files) {
        if (this.files[i] === 'del') {
          this.toDel(i)
        } else if (!this.filelist[i]) {
          this.toUpload(i)
        } else {
          this.toDel(i)
          this.toupload(i)
        }
      }
    },
    changeFile(i) {
      this.refreshindex = i
      this.$refs.file.click()
    },
    delFile(i) {
      this.files[i] = 'del'
    },
    addFile() {
      this.refreshindex = this.newindex
      this.$refs.file.click()
      this.newindex += 1
    },
    tempFile(event) {
      event.preventDefault()
      var file = this.$refs.file.files[0]
      this.files[this.refreshindex] = file
      var img = new FileReader()
      img.readAsDataURL(file)
      img.onload = ({ target }) => {
        this.fileshow[this.refreshindex] = target.result
      }
    },
    toUpload(i) {
      var formData = new FormData()
      formData.append('file', this.files[i])
      console.log(i)
      req.upload(this.$store.state.conf, 'fupload', formData).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist[i] = res.data
            this.fileshow[i] = this.baseurl + res.data
            this.files[i] = null
            this.checkfin(i)
          }
        }
      })
    },
    toDel(i) {
      var file = this.filelist[i]
      console.log(i)
      console.log(file)
      if (file === undefined) return
      req.post(this.$store.state.conf, 'fdel', {del: file}).then((res) => {
        if (res.status) {
          if (res.data === 'done') {
            this.filelist[i] = ''
            this.checkfin(i)
          }
        }
      })
    },
    toBigpic(url) {
      this.showbigpic = true
      this.bigpic = url
    },
    checkfin(i) {
      console.log('isfin---------------')
      if (parseInt(i) + 1 === this.files.length && ['del', null].indexOf(this.files[i]) > -1) {
        this.saveNote()
      }
    },
    saveNote() {
      console.log('saving file')
      console.log(this.filelist)
      for (var i in this.filelist) {
        if (this.filelist[i] === '') {
          this.filelist.splice(i, 1)
        }
      }
      console.log(this.filelist)
      this.flin.file = this.filelist.join(',')
      console.log(this.flin.file)
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
