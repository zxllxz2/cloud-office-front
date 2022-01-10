<template>
    <div>
        <div class="permissManager">
            <el-input size="small" 
                      placeholder="Please input a role name in English..." 
                      v-model="role.name" 
                      @keydown.enter.native="addRole"
                      clearable>
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" 
                      v-model="role.nameZh" 
                      placeholder="Please input a role name in Chinese..." 
                      @keydown.enter.native="addRole"
                      clearable></el-input>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addRole" round>Add Role</el-button>
        </div>
        <div class="promissMain">
            <el-collapse v-model="activeName" @change="change" accordion>
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
                <el-card class="box-card" shadow="always">
                    <div slot="header" class="clearfix">
                        <span>Accessible Resources</span>
                        <el-button icon="el-icon-delete-solid" 
                                   style="float: right; padding: 3px 0; color:#ff0000" 
                                   type="text"
                                   size="medium"
                                   @click="deleteRole(r)"></el-button>
                    </div>
                    <div>
                        <el-tree :data="allMenus" 
                                 :props="defaultProps"
                                 :default-checked-keys="selectedMenus"
                                 node-key="id" 
                                 ref="tree"
                                 :key="index"
                                 show-checkbox></el-tree>
                    </div>
                    <div style="display: flex; justify-content: flex-end">
                        <el-button size="mini" type="info" @click="cancelUpdate" round>Cancel Revision</el-button>
                        <el-button size="mini" type="success" @click="doUpdate(r.id, index)" round>Confirm Revision</el-button>
                    </div>
                </el-card>                    
                </el-collapse-item>
            </el-collapse>            
        </div>
    </div>
</template>
        
        
<script>
    export default{
        name: 'PermissionManager',
        data(){
            return{
                activeName: -1,
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus: []
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            deleteRole(data) {
                this.$confirm('This will permanently delete the role ['+data.nameZh+']. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/permiss/role/' + data.id).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });          
                });                
            },
            addRole() {
                if (this.role.name && this.role.nameZh) {
                    this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
                        if (resp) {
                            this.initRoles();
                            this.role.name = '';
                            this.role.nameZh = '';
                        }
                    });
                } else {
                    this.$message.error('Fields cannot be empty!');
                }
            },
            cancelUpdate() {
                this.activeName = -1;
            },
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);   //true则仅返回leaf节点的数据
                let url = '/system/basic/permiss/?rid=' + rid;
                selectedKeys.forEach(element => {
                    url += '&mids=' + element;
                });
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.activeName = -1;
                    }
                });
            },
            initSelectedMenus(rid) {
                this.getRequest('/system/basic/permiss/mid/' + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                });
            },
            change(rid) {   //当collapse展开时rid为":name"， 关闭时rid为空
                if (rid) {
                    this.initSelectedMenus(rid);
                    this.initAllMenus();
                    
                }
            },
            initAllMenus() {
                this.getRequest('/system/basic/permiss/menus').then(resp => {
                    if (resp) {
                        this.allMenus = resp;
                    }
                });
            },
            initRoles() {
                this.getRequest('/system/basic/permiss/').then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                });
            }
        }
    }
</script>
        
        
<style>
    .permissManager {
        display: flex;
        justify-content: flex-start;
    }
    .permissManager .el-input {
        width: 350px;
        margin-right: 8px;
    }
    .promissMain {
        margin-top: 10px;
        margin-left: 10px;
        width: 800px;
    }
        
</style>