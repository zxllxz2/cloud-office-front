<template>
    <div style="display: flex; justify-content: center">
        <el-card style="width:500px; margin-top:20px">
            <div slot="header" style="font-size:25px; font-family:Impact, Haettenschweiler">
                <span>{{admin.name}}</span>
            </div>
            <div>
                <div style="display: flex; justify-content: center;margin-bottom:15px">
                    <img title="Click to change avatar" :src="admin.userFace" @click="showUpdateAvaView"
                         style="height:100px;width:100px;border-radius:50px;cursor: pointer">
                </div>
                <div style="display: flex; justify-content: start">
                    <table style="width:95%; margin-left:35px" cellspacing="7px">
                        <tr>
                            <td>
                                Mobile Number:
                            </td>
                            <td>
                                <el-tag size="small" type="primary">{{admin.phone}}</el-tag>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Telephone Number:
                            </td>
                            <td>
                                <el-tag size="small" type="primary">{{admin.telephone}}</el-tag>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Address:
                            </td>
                            <td>
                                <el-tag size="small" type="primary">{{admin.address}}</el-tag>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                User Tags:
                            </td>
                            <td>
                                <el-tag style="margin-right:3px" size="small" type="warning" v-for="(role, index) in admin.roles" :key="index">{{role.nameZh}}</el-tag>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="display: flex; justify-content: space-around;margin-top:15px">
                    <el-button size="small" type="success" style="width:130px" @click="showAdminUpdate">Edit User Info</el-button> 
                    <el-button size="small" type="danger" @click="showUpdatePass">Change Password</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog
            title="Edit User Info"
            :visible.sync="dialogVisible"
            top="20vh"
            width="35%"
            center>
            <div style="margin-left:30px; margin-top:-20px; margin-bottom:-22px">
                <table style="width:95%" cellspacing="7px">
                    <tr>
                        <td>
                            Nickname:
                        </td>
                        <td>
                            <el-input size="mini" v-model="adminEdit.name" placeholder="New nickname"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Mobile Number:
                        </td>
                        <td>
                            <el-input size="mini" v-model="adminEdit.phone" placeholder="New mobile #"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Telephone Number:
                        </td>
                        <td>
                            <el-input size="mini" v-model="adminEdit.telephone" placeholder="New telephone #"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Address:
                        </td>
                        <td>
                            <el-input size="mini" v-model="adminEdit.address" placeholder="New address"
                                      type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer">
                <el-button size="small" type="info" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="updateAdmin">Confirm</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="Change Password"
            :visible.sync="dialogVisiblePass"
            top="20vh"
            width="35%"
            center>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="160px" size="mini">
                <el-form-item label="Enter Old Password:" prop="oldPass">
                    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="Enter New Password:" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="Confirm New Password:" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
                </el-form-item>
                <div style="display: flex; justify-content: space-around;margin-top:20px">
                    <el-button size="small" type="success" @click="submitForm('ruleForm')">Submit</el-button>
                    <el-button size="small" type="warning" @click="resetForm('ruleForm')">Reset</el-button>
                    <el-button size="small" type="info" @click="dialogVisiblePass = !dialogVisiblePass">Cancel</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            title="Change Avatar"
            :visible.sync="dialogVisibleAva"
            top="25vh"
            width="35%"
            center>
            <div style="margin-left:5px">
                URL:
                <el-input size="mini" type="textarea" placeholder="Please input image URL..." v-model="imgUpdate"
                          prefix-icon="el-icon-edit" :autosize="{ minRows: 3 }" 
                          style="margin-left:10px; width:85%; margin-top:-20px" clearable></el-input>
            </div>
            <div style="display: flex; justify-content: space-around; margin-top:20px">
                <el-button size="small" type="success" @click="updateAva">Confirm</el-button>
                <el-button size="small" type="warning" @click="imgUpdate = ''">Reset</el-button>
                <el-button size="small" type="danger" @click="resumeAva" :disabled="prevImg==''">Resume</el-button>
                <el-button size="small" type="info" @click="dialogVisibleAva = !dialogVisibleAva">Cancel</el-button>
            </div>
        </el-dialog>
    </div>
</template>
        
        
<script>
    export default{
        name: 'AdminInfo',
        data() {
            //校验规则必须放在校验（validator）之前
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password again'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('Two inputs don\'t match!'));
                } else {
                    callback();
                }
            };
            return {
                imgUpdate: '',
                prevImg: '',
                admin: {name:''},
                adminEdit: {name:''},
                dialogVisible: false,
                dialogVisiblePass: false,
                dialogVisibleAva: false,
                ruleForm: {
                    oldPass: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldPass: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.initAdmin();
        },
        methods: {
            resumeAva() {
                if (this.prevImg) {
                    this.postRequest('/admin/userface/?id=' + this.admin.id + '&url=' + this.prevImg).then(resp => {
                        if (resp) {
                            this.initAdmin();
                            this.prevImg = '';
                        }
                        this.dialogVisibleAva = false;
                    });
                } else {
                    this.$message.error("No image to resume the avatar!");
                }
            },
            updateAva() {
                this.prevImg = this.admin.userFace;
                this.postRequest('/admin/userface/?id=' + this.admin.id + '&url=' + this.imgUpdate).then(resp => {
                    if (resp) {
                        this.initAdmin();
                    }
                    this.dialogVisibleAva = false;
                });
            },
            showUpdateAvaView() {
                this.imgUpdate = this.admin.userFace;
                this.dialogVisibleAva = true;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.adminId = this.admin.id;
                        this.putRequest('/admin/pass', this.ruleForm).then(resp => {
                            if (resp) {
                                //更新密码成功后退出登录
                                this.postRequest('/logout');
                                window.sessionStorage.removeItem('user');
                                window.sessionStorage.removeItem('tokenStr');
                                this.$store.commit('initRoutes', []);
                                this.$router.replace('/');
                            }
                        });
                    } else {
                        console.log('error Submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            showUpdatePass() {
                this.dialogVisiblePass = true;
                this. ruleForm = {
                    oldPass: '',
                    pass: '',
                    checkPass: ''
                };
            },
            updateAdmin() {
                this.putRequest('/admin/info', this.adminEdit).then(resp => {
                    if (resp) {
                        this.initAdmin();
                    }
                    this.dialogVisible = false;
                });
            },
            showAdminUpdate() {
                this.adminEdit = Object.assign({}, this.admin);
                this.dialogVisible = true;
            },
            initAdmin() {
                this.getRequest('/admin/info').then(resp => {
                    if (resp) {
                        this.admin = resp;
                        // this.adminEdit = Object.assign({}, this.admin);
                        // this.imgUpdate = admin.userFace;
                        window.sessionStorage.setItem('user', JSON.stringify(resp));
                        this.$store.commit('INIT_ADMIN', resp);
                    }
                });
            }
        }
    }
</script>
        
        
<style>
        
</style>