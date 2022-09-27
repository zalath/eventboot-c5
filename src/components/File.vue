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
      refreshtype: '',
      newindex: 0,
      fin: 0
    }
  },
  created: function() {
    this.t('reg file')
    this.t(this.fin)
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
      this.t('in done------------------------------')
      this.t(this.files)
      for (var i in this.files) {
        if (this.files[i] === 'del') {
          this.toDel(i)
        } else if (!this.filelist[i]) {
          this.toUpload(i)
        } else {
          this.toDel(i)
          this.toUpload(i)
        }
      }
    },
    changeFile(i) {
      this.refreshindex = i
      this.refreshtype = 'update'
      this.$refs.file.click()
    },
    delFile(i) {
      this.files[i] = 'del'
    },
    addFile() {
      this.refreshindex = this.newindex
      this.refreshtype = 'new'
      this.$refs.file.click()
    },
    tempFile(event) {
      event.preventDefault()
      var file = this.$refs.file.files[0]
      if (file === undefined) return
      if (this.refreshtype === 'new') this.newindex += 1
      this.files[this.refreshindex] = file
      var img = new FileReader()
      img.readAsDataURL(file)
      img.onload = ({ target }) => {
        this.fileshow[this.refreshindex] = target.result
      }
    },
    toUpload(i) {
      this.t('upload ing')
      var formData = new FormData()
      formData.append('file', this.files[i])
      this.t('uploading ' + i)
      req.upload(this.$store.state.conf, 'fupload', formData).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist[i] = res.data
            this.fileshow[i] = this.baseurl + res.data
            this.files[i] = null
            this.fin += 1
            this.checkfin()
          }
        }
      })
    },
    toDel(i) {
      this.t('del ing')
      var file = this.filelist[i]
      this.t('del ' + i)
      this.t('del ' + file)
      if (file === undefined) {
        this.filelist[i] = ''
        this.fin += 1
        this.checkfin()
        return
      }
      req.post(this.$store.state.conf, 'fdel', {del: file}).then((res) => {
        if (res.status) {
          if (res.data === 'done') {
            this.filelist[i] = ''
            this.fin += 1
            this.checkfin()
          }
        }
      })
    },
    toBigpic(url) {
      this.showbigpic = true
      this.bigpic = url
    },
    checkfin() {
      this.t('isfin---------------' + this.fin)
      if (this.fin === this.files.length) {
        this.saveNote()
      }
    },
    saveNote() {
      this.t('saving file')
      this.t(this.filelist)
      this.t(this.files)
      this.t(this.fileshow)
      for (var i in this.filelist) {
        if (this.filelist[i] === '') {
          this.filelist.splice(i, 1)
        }
      }
      this.t(this.filelist)
      this.flin.file = this.filelist.join(',')
      this.t(this.flin.file)
      var cmd = 'save'
      if (this.filefrom === 'note') {
        cmd = 'nsave'
      }
      req.post(this.$store.state.conf, cmd, this.flin)
    },
    t(a) {
      console.log(a)
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
