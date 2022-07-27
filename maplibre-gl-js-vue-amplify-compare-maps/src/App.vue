<template>
  <div>
    <el-container>
      <el-header height="48px" >Amazon Location × Amplify Geo</el-header>
      <el-main>
        <el-row>
          <el-col :span=12>
            <leftMap/>
          </el-col>
          <el-col :span=12>
            <rightMap/>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import leftMap from './components/leftMap';
import rightMap from './components/rightMap';

export default {
  data() {
  
  },
  components: {
    leftMap: leftMap,
    rightMap: rightMap
  } 
}
</script>

<style>
@import "@/assets/style.css";
</style>