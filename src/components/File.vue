<template>
  <div class="filelistbox">
    <div class="filelist">
      <div class="filebox" v-for="(file,index) in fileshow" :key="index">
        <div v-if="files[index] != 'del'" @mouseover="showname(index)" @mouseout="showname('')">
          <img class="file" @click="toBigpic(index)" :src="file" @error="e => { e.target.src = blankimg }"/>
          <div>
            <button class="fileboxbtn fa fa-refresh" @click="changeFile(index)" />
            <button class="fileboxbtn fa fa-times" @click="delFile(index)"/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="filename">&nbsp;{{filename}}</div>
    </div>
    <div class="fileadd fa fa-plus" v-on:click="addFile()"></div>
    <input type="file" ref="file" class="hide" @change="tempFile($event)"/>
    <div class="bigpicdisplay" v-if="bigpic.isshow">
      <img :src="bigpic.pic" @click="bigpic.isshow=false" @error="e => { e.target.src = blankimg }">
      <div class="bigpicfilename">
        <span>&nbsp;{{bigpic.filename}}</span>
        <button v-if="bigpic.isdownload" class="bigpicbtn fa fa-level-down" @click="download()" />
      </div>
    </div>
  </div>
</template>

<script>
import req from '../js/req'
import blankimg from '../assets/blank.png'
export default {
  name: 'file',
  props: {
    lin: {},
    filefrom: String
  },
  data: function() {
    return {
      blankimg,
      filename: '',
      baseurl: '',
      bigpic: {
        filename: '',
        pic: '',
        isshow: false,
        isdownload: true,
        index: 0
      },

      filelist: [],
      fileshow: [],
      files: [],
      flin: {},
      refreshindex: false,
      refreshfin: 0,
      refreshmax: 0,
      newindex: 0
    }
  },
  created: function() {
    this.t('reg file part')
    this.$bus.off('editdone')
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
    // 文件预览
    toBigpic(i) {
      this.bigpic.isshow = true
      this.bigpic.pic = this.fileshow[i]
      this.bigpic.filename = this.getfilename(i)
      this.bigpic.isdownload = !(this.filelist[i] === undefined)
      this.bigpic.index = i
    },
    showname(i) {
      this.filename = this.getfilename(i)
    },
    getfilename(i) {
      if (i === '') {
        return ''
      }
      return this.filelist[i] === undefined ? this.files[i].name : this.filelist[i].substring(2)
    },
    download() {
      var i = this.bigpic.index
      // this.vueDownload(i)
      this.electronDownload(i)
    },
    electronDownload(i) {
      var d = {
        path: this.baseurl + this.filelist[i],
        name: this.getfilename(i)
      }
      this.$ipc.send('download', d)
    },
    vueDownload(i) {
      var dE = document.createElement('a')
      dE.href = this.filelist[i]
      dE.download = this.getfilename(i)
      document.body.append(dE)
      dE.click()
      document.body.removeChild(dE)
    },
    // end文件预览
    // 文件操作
    changeFile(i) {
      this.refreshindex = i
      this.refreshtype = 'update'
      this.$refs.file.click()
    },
    delFile(i) {
      this.files[i] = 'del'
      this.filename = ''
    },
    addFile() {
      this.refreshindex = this.newindex
      this.refreshtype = 'new'
      this.$refs.file.click()
    },
    tempFile(event) {
      event.preventDefault()
      var file = this.$refs.file.files[0]
      this.files[this.refreshindex] = file
      var img = new FileReader()
      img.readAsDataURL(file)
      img.onload = ({ target }) => {
        this.fileshow[this.refreshindex] = target.result
        if (this.refreshtype === 'new') this.newindex += 1
      }
    },
    confirm(nlin) {
      this.tlin = nlin
      this.t('')
      this.t('')
      this.t('')
      this.t('indone------------------------------')
      this.t(this.filelist, 'filelist')
      this.t(this.files, 'files')
      this.t(this.fileshow, 'fileshow')
      for (var i in this.files) {
        this.refreshmax += 1
      }
      for (i in this.files) {
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
    toUpload(i) {
      var formData = new FormData()
      formData.append('file', this.files[i])
      this.t('upload')
      this.t(i, 'upload')
      req.upload(this.$store.state.conf, 'fupload', formData).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist[i] = res.data
            this.fileshow[i] = this.baseurl + res.data
            this.files[i] = null
            this.refreshfin += 1
            this.checkfin()
          }
        }
      })
    },
    toDel(i) {
      var file = this.filelist[i]
      this.t('del--')
      this.t(i, 'del')
      this.t(file, 'del')
      if (file === undefined) {
        this.t('nofile', 'del')
        this.refreshfin += 1
        this.filelist[i] = ''
        this.checkfin()
        return
      }
      req.post(this.$store.state.conf, 'fdel', {del: file}).then((res) => {
        if (res.status) {
          if (res.data === 'done') {
            this.t('done', 'del')
            this.refreshfin += 1
            this.filelist[i] = ''
            this.checkfin()
          } else {
            this.t('mis', 'del')
          }
        }
      })
    },
    checkfin() {
      this.t('isfin-----------------------------')
      this.t(this.refreshfin + '--' + this.refreshmax)
      if (this.refreshfin === this.refreshmax) {
        this.saveNote()
      }
    },
    saveNote() {
      this.t('saving file')
      this.t(this.filelist, 'save1')
      for (var i in this.filelist) {
        while (this.filelist[i] === '') {
          this.filelist.splice(i, 1)
        }
      }
      this.t(this.filelist, 'save2')
      this.flin.file = this.filelist.join(',')
      this.t(this.flin.file, 'save3')
      var cmd = 'save'
      if (this.filefrom === 'note') {
        cmd = 'nsave'
      }
      req.post(this.$store.state.conf, cmd, this.flin)
    },
    // end文件操作
    t(a, txt = '') {
      console.log('FILE::::' + txt)
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
  color white
  font-size 11px
  line-height 1.5rem
  text-align center
.bigpicdisplay img
  max-width 50rem
  max-height 50rem
  border solid 1px red
.bigpicfilename
  background red
  padding 0px .5rem
  &:hover
    .bigpicbtn
      display inline-block
.bigpicbtn
  display none
  position absolute
  right 0px
  background red
  border none
  color white
  font-size 1rem
  padding 0px .7rem
  line-height 1.5rem
  clip-path polygon(0% 0%,70% 0%,100% 30%,100% 100%,35% 100%,0% 70%)
  &:hover
    background white
    color red
.filename
  text-align center
</style>
