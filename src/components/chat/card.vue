<template>
  <div>
    <header id="card">
      <img class="avatar" :src="user.userFace" :alt="user.name" />
      <p class="name">{{ user.name }}</p>
    </header>
    <!-- <footer> -->
    <el-input
      class="search"
      style="margin-bottom:10px;margin-top:5px"
      size="mini"
      prefix-icon="el-icon-search"
      v-model="$store.state.filterKey"
      placeholder="search user..."
	  @keydown.enter.native="doSearch"
      clearable
    ></el-input>
    <!-- </footer> -->
  </div>
</template>

<script>
export default {
  name: "card",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  methods: {
	  doSearch() {
		  this.$store.dispatch("initData");
	  }
  }
};
</script>

<style lang="scss" scoped>
#card {
  padding: 10px;
  margin-left: 15px;
  margin-top: -5px;
  margin-bottom: -7px;
  .avatar {
    width: 40px;
    height: 40px;
    margin-left: -7px;
    margin-top: -5px;
    vertical-align: middle; /*这个是图片和文字居中对齐*/
  }
  .name {
    display: inline-block;
    padding: 10px;
    margin-bottom: 10px;
    margin-left: 8px;
    font-size: 20px;
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  .search {
    // background-color: #dcdcdc;
    height: 15px;
    line-height: 10px;
    padding: 0 10px;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    outline: none; /*鼠标点击后不会出现蓝色边框*/
    // color: #FFF;
  }
}
</style>
