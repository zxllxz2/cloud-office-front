<template>
    <div style="width: 600px">
        <el-input
            size="small"
            placeholder="Please input department name for searching..."
            prefix-icon="el-icon-search"
            v-model="filterText">
        </el-input>
        <el-tree
            :data="deps"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            style="margin-top:10px"
            size="medium"
            ref="tree">
            <!--node: 当前节点的node对象；data: 后端返回的对应数据-->
            <span class="custom-tree-node" slot-scope="{ data }" style="display:flex; justify-content:space-between; width:100%">
                <span>{{ data.name }}</span>
                <span>
                    <el-button
                        class="depBtn"
                        type="success"
                        size="mini"
                        @click="() => showAddView(data)"
                        plain>
                        Add Child
                    </el-button>
                    <el-button
                        class="depBtn"
                        type="danger"
                        size="mini"
                        @click="() => deleteDep(data)"
                        plain>
                        Delete
                    </el-button>
                </span>
            </span>            
        </el-tree>
        <el-dialog
            title="Add Department"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>Parent Department</el-tag></td>
                        <td style="margin-left:5px"><p style="margin-left:5px">{{parentName}}</p></td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>Department Name</el-tag>
                        </td>
                        <td>
                            <el-input style="margin-left:5px" 
                                      size="small" 
                                      v-model="dep.name" 
                                      placeholder="Please input department name..."
                                      @keydown.enter.native="doAdd"></el-input>
                        </td>
                    </tr>                     
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="doAdd">Confirm</el-button>
            </span>
        </el-dialog>        
    </div>
</template>
        
        
<script>
    export default{
        name: 'DepManager',
        data(){
            return{
                filterText: '',
                deps: [],
                defaultProps: {
                    children: 'children',     //对应department表中的children属性
                    label: 'name'             //对应department表中的name属性
                },
                dialogVisible: false,
                dep: {
                    name: '',
                    parentId: -1
                }, 
                parentName: ''
            }
        },
        mounted() {     //在生命周期开始时调用init方法获取所有的departmens
            this.initDeps();
        },
        methods: {
            addDep2Deps(deps, dep) {
                for (let i = 0; i < deps.length; ++i) {
                    let d = deps[i];
                    if (d.id === dep.parentId) {
                        d.children = d.children ? d.children.concat(dep) : [dep];
                        if (d.children.length > 0) {
                            d.isParent = true;
                        }
                        return;
                    } else {    //递归查找parent进行插入
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            initDep() { //初始化addDep输入框
                this.dep = {
                    name: '',
                    parentId: -1
                };
                this.parentName = '';
            },
            doAdd() {
                this.postRequest('/system/basic/department/', this.dep).then(resp => {
                    if (resp) {
                        this.addDep2Deps(this.deps, resp.obj);  //手动在页面中插入部门
                        this.initDep();      //不用initDeps()，从而防止添加完以后树形控件立马关闭
                    }
                });
                this.dialogVisible = false;
            },
            showAddView(data) {
                this.dep.parentId = data.id;
                this.parentName = data.name;    //获取即将添加的部门的父部门名称 i.e.当前所在的部门名称
                this.dialogVisible = true;
            },
            removeDepFromDeps(parent, deps, id) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id === id) {
                        deps.splice(i, 1);  //从array的当前位置开始删除一个元素
                        if (deps.length === 0) {
                            parent.isParent = false;
                        }
                        return;
                    } else {
                        this.removeDepFromDeps(d, d.children, id);
                    }
                }
            },
            deleteDep(data) {
                if (data.isParent) {
                    this.$message.error("Fail to delete the parent department!");
                } else {
                    this.$confirm('This will permanently delete the department ['+data.name+']. Continue?', 'Warning', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
                            if (resp && resp.code === 200) {
                                this.removeDepFromDeps(null, this.deps, data.id);
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'Delete canceled'
                        });          
                    });
                }
            },
            initDeps() {
                this.getRequest('/system/basic/department/').then(resp => {
                    if (resp) {
                        this.deps = resp;
                    }
                });
            },
            filterNode(value, data) {   //data: 当前鼠标点击的目录下的所有数据
                if (!value) return true;    //return true表示展示节点 - 此处意味若搜索框为空则展示全部节点
                return data.name.indexOf(value) !== -1;
            }
        },
        watch: {
            filterText(val) {   //监控该值的变化
                this.$refs.tree.filter(val);    //调用ref='tree'的控件中的filter-node-method方法
            }
        }
    }
</script>
        
        
<style>
    .depBtn {
        padding: 2px;
    }
        
</style>