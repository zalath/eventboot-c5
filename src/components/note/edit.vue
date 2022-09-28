<template>
  <div class="edit" v-if="isshow">
    <h1>{{ title }}</h1>
    <div>
      <p v-if="title === 'new'">title</p>
      <textarea class="input" rows="2" v-model="lin.title" />
    </div>
    <div>
      <p v-if="title === 'new'">comment</p>
      <textarea class="input" rows="2" v-model="lin.cmt" />
    </div>
    <div class="contentbox">
      <p v-if="title === 'new'">content</p>
      <div :class="'content editpart '+editcontent">
        <textarea class="input" rows="20" v-model="lin.content" @contextmenu="contentswitch()" @change="rendertxt($event, lin.content)"/>
      </div>
      <div :class="'content showpart '+showcontent" @contextmenu="contentswitch()" v-html="re"></div>
    </div>
    <file :lin="lin" :filefrom="'note'"/>
    <div class="btns">
      <h4 class="fa fa-check" v-on:click="submit()" />
      <h4 class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
import file from '../File';
export default {
  name: 'edit',
  components: {
    file
  },
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: '',
      re: '',
      editcontent: 'hide',
      showcontent: ''
    };
  },
  created() {
    this.$bus.off('nedit')
    this.$bus.off('nnew')
    this.$bus.on('nedit', this.edit);
    this.$bus.on('nnew', this.new);
  },
  methods: {
    rendertxt(event, txt) {
      this.tomarkdown(txt)
    },
    tomarkdown(txt) {
      var mdi = require('markdown-it')()
      this.re = mdi.render(txt);
    },
    submit() {
      if (this.title === 'edit') {
        this.doedit();
      } else if (this.title === 'new') {
        this.donew();
      }
      this.close();
    },
    doedit() {
      console.log('saving')
      req.post(this.$store.state.conf, 'nsave', this.lin).then((res) => {
        console.log(res)
        if (res.data === 'done') {
          this.$bus.emit('editdone', this.lin)
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post(this.$store.state.conf, 'nnew', this.lin).then((res) => {
        if (res.data !== 'mis') {
          this.lin.id = res.data
          this.$bus.emit('editdone', this.lin)
          req.post(this.$store.state.conf, 'nel', { id: res.data }).then((res) => {
            if (res.status) {
              this.$bus.emit('nnew' + this.pid, res.data);
            }
          });
        }
      });
    },
    edit(da) {
      this.lin = da.lin;
      this.pid = da.lin.pid;
      this.tomarkdown(this.lin.content)
      this.show('edit');
    },
    new(da) {
      this.pid = da.pid;
      this.lin = {};
      this.tomarkdown('')
      this.show('new');
      this.editcontent = ''
      this.showcontent = 'hide'
    },
    show(title) {
      this.title = title;
      this.isshow = true;
    },
    close() {
      this.isshow = false;
    },
    contentswitch() {
      this.editcontent = this.editcontent === 'hide' ? '' : 'hide'
      this.showcontent = this.showcontent === 'hide' ? '' : 'hide'
    }
  }
};
</script>
<style scoped lang="stylus">
.edit
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  background-color black
  border solid 1px red
  width 80%
  text-align left
  padding 20px
.btns
  float right
  font-size 30px
.input
  width 100%
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.contentbox
  height 20rem
  position relative
.content
  width 100%
  height 100%
  position absolute
.showpart
  border-bottom solid 1px red
  overflow-y: scroll
.cb
  clear both
.hide
  display none
</style>
