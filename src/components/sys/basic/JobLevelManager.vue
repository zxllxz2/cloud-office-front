<template>
    <div>
        <div>
            <el-input 
                size="small"
                style="width: 350px"
                placeholder="Enter a job level..."
                prefix-icon="el-icon-plus"
                v-model="jl.name"
                clearable>
            </el-input>
            <el-select size="small" style="margin-left: 8px; margin-right: 8px" v-model="jl.titleLevel" placeholder="Job Level">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addJobLevel" round>Add</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                size="small"
                :data="jls"
                border
                stripe
                style="width: 72%"
                @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                align="center"
                width="40">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                align="center"
                width="40">
            </el-table-column>
            <el-table-column
                prop="name"
                label="Job Level Name"
                align="center"
                width="220">
            </el-table-column>
            <el-table-column
                prop="titleLevel"
                label="Job Level Title"
                align="center"
                width="150">
            </el-table-column>
            <el-table-column
                prop="createDate"
                label="Created Date"
                align="center"
                width="150">
            </el-table-column>
            <el-table-column
                prop="enabled"
                label="If Enabled"
                align="center"
                width="120">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.enabled" type="success">Enabled</el-tag>
                    <el-tag v-else type="danger">Disabled</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Operations" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="showEditView(scope.row)">Edit</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">Delete</el-button>
                </template>
            </el-table-column>                    
            </el-table>
        </div>
        <el-button size="small" style="margin-top: 10px" type="danger" 
                    :disabled="this.multipleSelection.length===0" @click="deleteBatch">Batch Deletion</el-button>
        <el-dialog
            title="Edit Job Level"
            :visible.sync="dialogVisible"
            width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>Job Level Name</el-tag>
                    </td>
                    <td>
                        <el-input size="small" v-model="updateJl.name" style="margin-left: 6px"></el-input>
                    </td>
                </tr>
                 <tr>
                    <td>
                        <el-tag>Job Level Title </el-tag>
                    </td>
                    <td>
                        <el-select size="small" style="margin-left: 6px" v-model="updateJl.titleLevel">
                            <el-option
                                v-for="item in titleLevels"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </td>
                </tr>               
                <tr>
                    <td>
                        <el-tag>   If Enabled   </el-tag>
                    </td>
                    <td>
                        <el-switch
                            style="margin-left: 6px"
                            v-model="updateJl.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="Enabled"
                            inactive-text="Disabled">
                        </el-switch>
                    </td>
                </tr>                
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="doUpdate">Confirm</el-button>
            </span>
        </el-dialog>        
    </div>
</template>
        
        
<script>
    export default{
        name: 'JobLevelManager',
        data(){
            return{
                jl: {
                    name: '',
                    titleLevel: ''
                },
                titleLevels: [
                    '正高级',
                    '副高级',
                    '中级', 
                    '初级', 
                    '高级'
                ],
                jls: [],
                updateJl: {
                    name: '',
                    titleLevel: '',
                    enabled: true
                },
                dialogVisible: false,
                multipleSelection: []
            }
        },
        mounted() {
            this.initJls();
        },
        methods:{
            deleteBatch() {
                this.$confirm('This will permanently delete the selected ['+ this.multipleSelection.length +'] job level(s). Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });          
                });                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            doUpdate() {
                this.putRequest('/system/basic/joblevel/', this.updateJl).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                });
                this.dialogVisible = false;
            },
            showEditView(data) {
                this.dialogVisible = true;
                Object.assign(this.updateJl, data);
                this.updateJl.createDate = '';
            },
            handleDelete(data) {
                this.$confirm('This will permanently delete the job level ['+ data.name +']. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });          
                });
            },
            initJls() {
                this.getRequest('/system/basic/joblevel/').then(resp => {
                    if (resp) {
                        this.jls = resp;
                        this.jl.name = '';
                        this.jl.titleLevel = '';
                    }
                });
            },
            addJobLevel() {
                if (this.jl.name && this.jl.titleLevel) {
                    this.postRequest('/system/basic/joblevel/', this.jl).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    })
                } else {
                    this.$message.error('Fields cannot be empty!')
                }
            }
        }
    }
</script>
        
        
<style>
        
</style>