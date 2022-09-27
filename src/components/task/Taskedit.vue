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
    <file :lin="lin" :filefrom="'task'"/>
    <div class="btns">
      <h4 class="fa fa-check" v-on:click="submit()" />
      <h4 class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
import file from '../File.vue'
export default {
  name: 'Taskedit',
  components: {
    file
  },
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: ''
    };
  },
  created() {
    this.$bus.on('edit', this.edit);
    this.$bus.on('new', this.new);
  },
  methods: {
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
      req.post(this.$store.state.conf, 'save', this.lin).then((res) => {
        if (res === 'done') {
          this.$bus.emit('edit', this.lin);
          this.$bus.emit('editdone')
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post(this.$store.state.conf, 'new', this.lin).then((res) => {
        if (res.data !== 'mis') {
          req.post(this.$store.state.conf, 'el', { id: res.data }).then((res) => {
            if (res.status) {
              this.$bus.emit('new' + this.pid, res.data);
              this.$bus.emit('editdone')
            }
          });
        }
      });
    },
    edit(da) {
      this.lin = da.lin;
      this.pid = da.lin.pid;
      this.show('edit');
    },
    new(da) {
      this.pid = da.pid;
      this.lin = {};
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
  top 50%
  left 50%
  transform translate(-50%,-50%)
  background-color black
  border solid 1px red
  width 50%
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
</style>
