<template>
    <div>
        <!-- ":" is the short hand for v-bind, which binds attributes/component props to an expression
             documentation: https://vuejs.org/v2/api/#v-bind-->

        <el-form :rules="rules" 
                 v-loading="loading"
                 element-loading-text="Please wait for login..."
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
                 :model="loginForm" 
                 ref="loginForm"
                 class="loginContainer">

            <h3 class="loginTitle">System Login</h3>

            <el-form-item prop="username"> <!--prop corresponds to the rules in return in script-->
                <el-input 
                    type="text" 
                    auto-complete="false" 
                    v-model="loginForm.username" 
                    placeholder="Please enter your username"
                    @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input 
                    type="password" 
                    auto-complete="false" 
                    v-model="loginForm.password" 
                    placeholder="Please enter your password"
                    @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>

            <el-form-item prop="code">
                <el-input 
                    type="text" 
                    auto-complete="false" 
                    v-model="loginForm.code" 
                    placeholder="Click to change the auth code" 
                    style="width: 250px;margin-right: 5px"
                    @keydown.enter.native="submitLogin"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
            </el-form-item>
            
            <el-checkbox v-model="checked" class="loginRemember">Remember me</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">Login</el-button>   
        </el-form>
        
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            captchaUrl: '/captcha?time=' + new Date(),  //add date to make sure the captcha can refresh correctly
            loginForm: {
                username: 'admin',
                password: '123',
                code: ''
            },
            loading: false,     //corresponds to "v-loading" in e-form; false if not loading, true if loading
            checked: true,
            rules: {    //corresponds to the ":rules" attribute in el-form
                username: [{required: true, message: 'Username is required', trigger: 'blur'}],
                password: [{required: true, message: 'Password is required', trigger: 'blur'}],
                code: [{required: true, message: 'Auth code is required', trigger: 'blur'}]
            }
        }
    },
    methods: {
        updateCaptcha() {
            this.captchaUrl = '/captcha?time=' + new Date();
        },
        submitLogin() {

            this.$refs.loginForm.validate((valid) => {      //refs corresponds to attribute "ref" in el-form
                if (valid) {
                    this.loading = true;
                    this.postRequest('/login', this.loginForm).then(resp => {
                        // console.log(resp)
                        if (resp && resp.code === 200) {
                            //停止“正在加载”图标
                            this.loading = false;
                            //存储用户token
                            const tokenStr = resp.obj.tokenHead + ' ' + resp.obj.token;
                            window.sessionStorage.setItem('tokenStr', tokenStr);
                            //页面跳转
                            let path = this.$route.query.redirect;
                            this.$router.replace((path === '/' || path == undefined) ? '/home' : path)
                            .catch(error => {
                                console.log(error);
                                this.$router.replace((path === '/' || path == undefined) ? '/home' : path)
                            });
                            //replace() cannot go back to the last page, while push() can
                        } else {
                            this.loading = false;
                            this.updateCaptcha();
                            this.loginForm.code = '';
                        }
                    });
                } else {
                    // console.log('error submit!!');     //shows error in the developer tool in the browser
                    this.$message.error('Please enter all required information');
                    this.updateCaptcha();
                    return false;
                }
            });
        }
    }
}
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background:paleturquoise;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #a7d4ff;
    }
    .loginTitle {
        margin: 0px auto 40px auto;
        text-align: center;
    }
    .loginRemember {
        text-align: left;
        margin: 0px 0px 20px 0px;
    }
    .el-form-item__content {
        display: flex;
        align-items: center;
    }
</style>