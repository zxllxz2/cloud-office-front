<template>
    <div>
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="部门管理" name="DepManager"><DepManager></DepManager></el-tab-pane>
            <el-tab-pane label="职位管理" name="PosManager"><PosManager></PosManager></el-tab-pane>
            <el-tab-pane label="职称管理" name="JobLevelManager"><JobLevelManager></JobLevelManager></el-tab-pane>
            <el-tab-pane label="奖惩规则" name="EcManager" disabled><EcManager></EcManager></el-tab-pane>
            <el-tab-pane label="权限组" name="PermissionManager"><PermissionManager></PermissionManager></el-tab-pane>
        </el-tabs>  
    </div>
</template>
        
        
<script>
    import DepManager from '../../components/sys/basic/DepManager.vue';
    import EcManager from '../../components/sys/basic/EcManager.vue';
    import PosManager from '../../components/sys/basic/PosManager.vue';
    import JobLevelManager from '../../components/sys/basic/JobLevelManager.vue';
    import PermissionManager from '../../components/sys/basic/PermissionManager.vue';

    export default{
        name: 'SysBasic',
        data() {
            return {
                activeName: 'DepManager'
            }
        },
        components: {
            DepManager,
            EcManager,
            PosManager,
            JobLevelManager,
            PermissionManager
        }
    }
</script>
        
        
<style scoped>
        
</style>