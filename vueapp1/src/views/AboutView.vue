<template>
  <div class="about">
    <h1>这是一个关于页</h1>
    <img src="../assets/logo.png">
    <button @click="handle">测试一下</button>
    <h1>{{username}}</h1>
  </div>
</template>
<script>
export default {
  name: 'AboutView',
  data () {
    return {
      username: '暴走萝莉'
    }
  },
  methods: {
    async handle () {
      let url = 'https://autumnfish.cn/api/joke/list?num=3'
      let ret = await this.$http.get(url)
      console.log('别的组件...',ret);
    }
  }
}
</script>

<style>
.about{
  background-color: aquamarine;
}
</style>
