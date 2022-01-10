<template>
    <div>
        <div>
            <el-input 
                class="addClassInput"
                size="small"
                placeholder="Add a position..."
                prefix-icon="el-icon-plus"
                v-model="pos.name"
                @keydown.enter.native="addPosition"
                clearable>
            </el-input>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addPosition" round>Add</el-button>
        </div>
        <div class="PositionManagerMain">
            <el-table
                size="small"
                :data="positions"
                border
                stripe
                style="width: 60%"
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
                label="Position"
                align="center"
                width="220">
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
                        @click="showEditView(scope.$index, scope.row)">Edit</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                    @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <el-button size="small" style="margin-top: 10px" type="danger" 
                    :disabled="this.multipleSelection.length===0" @click="deleteBatch">Batch Deletion</el-button>
        <el-dialog
            title="Edit Position"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <el-tag>Position Name</el-tag>
                <el-input size="small" v-model="updatePos.name" class="updatePosInput"></el-input>
            </div>
            <div style="margin-top: 3px">
                <el-tag>   If Enabled   </el-tag>
                <el-switch
                    style="margin-left: 28px"
                    v-model="updatePos.enabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="Enabled"
                    inactive-text="Disabled">
                </el-switch>                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="doUpdate">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>
        
        
<script>
    export default{
        name: 'PosManager',
        data(){
            return {
                pos: {
                    name: ''
                },
                positions: [],
                dialogVisible: false,
                updatePos: {
                    name: '',
                    enabled: true
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.initPositions();
        },
        methods:{
            deleteBatch() {
                this.$confirm('This will permanently delete the selected ['+ this.multipleSelection.length +'] position(s). Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
                        if (resp) {
                            this.initPositions();
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
                this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
                    if (resp) {
                        this.initPositions();
                    }
                })
                this.dialogVisible = false;
            },
            initPositions() {
                this.getRequest('/system/basic/pos/').then(resp => {
                    if (resp) {
                        this.positions = resp;
                        this.pos.name = '';
                    }
                })
            },
            showEditView(index, data) {
                this.dialogVisible = true;
                Object.assign(this.updatePos, data);
                this.updatePos.createDate = '';
            },
            handleDelete(index, data) {
                this.$confirm('This will permanently delete the position ['+ data.name +']. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });          
                });
            },
            addPosition() {
                if (this.pos.name) {
                    this.postRequest('/system/basic/pos/', this.pos).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
                } else {
                    this.$message.error('Position name cannot be empty!')
                }
            }
        }
    }
</script>
        
        
<style>
    .addClassInput {
        width: 350px;
        margin-right: 10px;
    }
    .PositionManagerMain {
        margin-top: 10px;
    }
    .updatePosInput {
        width: 200px;
        margin-left: 7px;
    }
        
</style>