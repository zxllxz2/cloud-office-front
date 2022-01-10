<template>
    <div>
        <div style="display:flex; justify-content:center; margin-top:15px">
            <el-input style="width:500px; margin-right:8px" 
                      size="small" 
                      prefix-icon="el-icon-search" 
                      placeholder="Please input usernames to search for users..."
                      v-model="keywords"
                      @keydown.enter.native="doSearch"
                      clearable></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="doSearch" round>Search</el-button>
        </div>
        <el-empty :image-size="150" description="No data" style="display:flex; justify-content:center" v-if="admins.length===0"></el-empty>
        <div class="admin-content">
            <el-card class="admin-card" v-for="(admin, index) in admins" :key="index" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>{{admin.name}}</span>
                    <el-button style="float: right; padding: 3px 0; color:red" 
                               type="text" 
                               icon="el-icon-delete-solid" 
                               @click="doDelete(admin)"></el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userface-img"/>
                    </div>
                </div>
                <div class="userinfo-container">
                    <table style="border-spacing: 5px 5px; margin-bottom:10px" align="left">
                        <tr>
                            <td>Username: </td>
                            <td>{{admin.name}}</td>
                        </tr>
                        <tr>
                            <td>Mobile #: </td>
                            <td>{{admin.phone}}</td>
                        </tr>
                        <tr>
                            <td>Home #: </td>
                            <td>{{admin.telephone}}</td>
                        </tr>
                        <tr>
                            <td>Address: </td>
                            <td>{{admin.address}}</td>
                        </tr>
                        <tr>
                            <td>
                                User Status: 
                            </td>
                            <td>
                                <el-switch
                                    style="margin-left: 4px"
                                    v-model="admin.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="Enabled"
                                    inactive-text="Disabled"
                                    @change="enablingAdmin(admin)">
                                </el-switch>                             
                            </td>
                        </tr>
                        <tr>
                            <td>
                                User Role: 
                            </td>
                            <td>
                                <el-tag size="small" type="warning" 
                                        v-for="(role, indexj) in admin.roles" :key="indexj" 
                                        style="margin-right:7px">
                                    {{role.nameZh}}
                                </el-tag>
                                <el-popover
                                    placement="right"
                                    title="Role List"
                                    width="230"
                                    trigger="click"
                                    @show="showPops(admin)">
                                    <el-button class="confirmEdit" type="success" 
                                               icon="el-icon-check" 
                                               @click="hidePops(admin)" circle></el-button>
                                    <el-select v-model="selectedRoles" placeholder="Select" multiple>
                                        <el-option
                                            v-for="(role, index) in allRoles"
                                            :key="index"
                                            :label="role.nameZh"
                                            :value="role.id">
                                        </el-option>
                                    </el-select>
                                    <el-button slot="reference" size="small" type="text" 
                                               icon="el-icon-more" style="color:rgb(87, 84, 85)"></el-button>
                                </el-popover>             
                            </td>
                        </tr>
                        <tr><td>Remark: </td><td>{{admin.remark}}</td></tr>                                          
                    </table>
                </div>
            </el-card>            
        </div>
    </div>
</template>
        
        
<script>
export default{
    name: 'SysAdmin',
    data() {
        return {
            admins: [],
            keywords: '',
            allRoles: [],
            selectedRoles: []
        }
    },
    mounted() {
        this.initAdmins();
    },
    methods: {
        hidePops(admin) {
            let url = '/system/admin/role/?adminId=' + admin.id;
            this.selectedRoles.forEach(r => {
                url += '&rids=' + r;
            })
            this.putRequest(url).then(resp => {
                if (resp) {
                    this.initAdmins();
                }
            });
        },
        showPops(admin) {
            this.initAllRoles();
            let roles = admin.roles;
            this.selectedRoles = [];
            roles.forEach(element => {
                this.selectedRoles.push(element.id);
            });
        },
        initAllRoles() {
            this.getRequest('/system/admin/roles').then(resp => {
                if (resp) {
                    this.allRoles = resp;
                }
            })
        },
        enablingAdmin(admin) {
            this.putRequest('/system/admin/', admin).then(resp => {
                if (resp) {
                    this.initAdmins();
                }
            });
        },
        doDelete(data) {
            this.$confirm('This will permanently delete the admin ['+ data.name +']. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/admin/' + data.id).then(resp => {
                    if (resp) {
                        this.initAdmins();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });          
            });
        },
        doSearch() {
            this.initAdmins();
        },
        initAdmins() {
            this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
                if (resp) {
                    this.admins = resp;
                }
            });
        }
    }
}
</script>
        
        
<style>
    .admin-card {
        width: 400px;
        margin-right: 10px;
        margin-left: 10px;
        margin-bottom: 20px;
        background-color: rgb(241, 191, 191);
    }
    .admin-content {
        margin-top: 30px;
        flex-wrap: wrap;
        display: flex;
        /* justify-content: flex-start;*/
    }
    .userface-img {
        width: 70px;
        height: 70px;
        border-radius: 70px;
    }
    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userinfo-container {
        font-size: 14px;
        color: rgb(11, 52, 110);
    }
    .confirmEdit {
        transform: scale(0.55, 0.55);
        margin-left: 190px;
        display: flex;
        margin-bottom: -5px;
        margin-top: -38px;
    }
        
</style>