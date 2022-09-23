<template>
  <div class="edit" v-if="isshow">
    <h1>{{ title }}</h1>
    <div>
      <p v-if="title === 'new'">title</p>
      <textarea class="input" rows="4" v-model="lin.title" />
    </div>
    <div>
      <p v-if="title === 'new'">comment</p>
      <textarea class="input" rows="9" v-model="lin.cmt" />
    </div>
    <div class="contentbox">
      <p v-if="title === 'new'">content</p>
      <div class="content editpart">
        <textarea class="input" rows="12" v-model="lin.content" @change="rendertxt($event, lin.content)"/>
      </div>
      <div class="content showpart" v-html="re"></div>
    </div>
    <div class="cb"></div>
    <div class="piclistbox">
      <div class="piclist">
        <img src=""/>
      </div>
      <div class="picadd fa fa-plus" v-on:click="addpic()"></div>
    </div>
    <div class="btns">
      <h4 class="fa fa-check" v-on:click="submit()" />
      <h4 class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
export default {
  name: 'edit',
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: '',
      re: ''
    };
  },
  created() {
    this.$bus.on('nedit', this.edit);
    this.$bus.on('nnew', this.new);
  },
  methods: {
    rendertxt(event, txt) {
      this.tomarkdown(txt)
    },
    tomarkdown(txt) {
      console.log(txt)
      var mdi = require('markdown-it')()
      this.re = mdi.render(txt);
    },
    addpic() {

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
      req.post(this.$store.state.conf, 'nsave', this.lin).then((res) => {
        if (res === 'done') {
          this.$bus.emit('nedit', this.lin);
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post(this.$store.state.conf, 'nnew', this.lin).then((res) => {
        if (res.data !== 'mis') {
          req.post(this.$store.state.conf, 'nel', { id: res.data }).then((res) => {
            if (res.status) {
              console.log(res.data);
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
      console.log(this.lin)
      this.show('edit');
    },
    new(da) {
      this.pid = da.pid;
      this.lin = {};
      this.tomarkdown('')
      this.show('new');
    },
    show(title) {
      this.title = title;
      this.isshow = true;
    },
    close() {
      this.isshow = false;
    }
  }
};
</script>
<style scoped lang="stylus">
.edit
  position fixed
  top 20px
  left 25%
  background-color black
  border solid 1px red
  width 50%
  text-align left
  overflow hidden
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
.piclistbox
  line-height 100px
.picadd
  border solid 1px red
  padding 3px
  width 15px
  height 15px
  text-align center
  border-radius 3px
  &:hover
    background-color red
    color black
.contentbox
  position relative
.content
  position absolute
.cb
  clear both
</style>
