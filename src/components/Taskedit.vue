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
    <div class="btns">
      <h4 class="fa fa-check" v-on:click="submit()" />
      <h4 class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../js/req';
export default {
  name: 'Taskedit',
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: ''
    };
  },
  methods: {
    submit() {
      if (this.title === 'edit') {
        this.doedit();
      } else if (this.title === 'new') {
        this.donew();
      }
      this.close();
    },
    doedit() {
      req.post('save', this.lin).then((res) => {
        if (res === 'done') {
          this.$bus.emit('edit', this.lin);
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post('new', this.lin).then((res) => {
        if (res.data !== 'mis') {
          req.post('el', { id: res.data }).then((res) => {
            if (res.status) {
              console.log(res.data);
              this.$bus.emit('new' + this.pid, res.data);
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
  },
  created() {
    this.$bus.on('edit', this.edit);
    this.$bus.on('new', this.new);
  }
};
</script>
<style scoped>
.edit {
  position: fixed;
  top: 20px;
  left: 25%;
  background-color: black;
  border: solid 1px red;
  width: 50%;
  text-align: left;
  overflow: hidden;
  padding: 20px;
}
.btns {
  float: right;
  font-size:30px;
}
.input {
  width: 100%;
  border:none;
  border-bottom: solid 1px red;
  background-color: black;
  color:aqua
}
</style>
