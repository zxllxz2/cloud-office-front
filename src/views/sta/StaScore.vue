<template>
    <div style="display:flex; justify-content:center; margin-top:100px">
        <el-carousel :interval="4000" type="card" height="250px" style="width:800px">
            <el-carousel-item class="x1">
                <p style="margin-left:117px">Employee Score Stats</p>
            </el-carousel-item>
            <el-carousel-item class="x2">
                <p style="margin-left:80px">Currently under construction......</p>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
        
        
<script>
export default{
    name: 'StaScore'
}
</script>
        
        
<style scoped>

  .x1 {
    color: #020813;
    font-size: 20px;
    line-height: 200px;
    background-color: #fcca90;
  }

  .x2 {
      color: #020813;
    font-size: 20px;
    line-height: 200px;
    background-color: #ccc2ce;
  }
        
</style>