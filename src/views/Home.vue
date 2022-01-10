<template>
  <div>
      <el-container>    
          <el-header class="homeHeader">
              <div class="title">Cloud Office</div>
              <div>
                  <el-dropdown class="userInfo" @command="commandHandler">
                      <el-badge :is-dot="notify[user.username]" type="warning">
                          <span style="color:white;font-family:华文新魏;font-size:18px"> {{user.name}} </span>
                      </el-badge>
                      <span class="el-dropdown-link"><i><img :src="user.userFace"></i></span>
                      <el-dropdown-menu slot="dropdown" style="margin-right:50px">
                              <el-dropdown-item icon="el-icon-bell" command="chat">
                                  <el-badge :is-dot="notify[user.username]" type="warning">Chat</el-badge>
                              </el-dropdown-item>
                          <el-dropdown-item command="userinfo">Profile</el-dropdown-item>
                          <!-- <el-dropdown-item command="setting">Setting</el-dropdown-item> -->
                          <el-dropdown-item divided command="logout">Logout</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
              </div>
          </el-header>
          <el-container>
              <el-aside width="200px">
                  <el-menu router unique-opened>
                      <el-submenu :index="index+''" 
                                  v-for="(item,index) in routes" :key="index"
                                  v-if="!item.hidden">
                          <template slot="title">
                              <i :class="item.iconCls" style="color: rgb(123, 4, 153); margin-right: 5px"></i>
                              <span>{{item.name}}</span>
                          </template>
                          <el-menu-item :index="children.path" 
                                        v-for="(children, indexj) in item.children"
                                        :key="indexj"
                                        :disabled="underConstruction(item, children)">
                                        {{children.name}}
                          </el-menu-item>
                      </el-submenu>
                  </el-menu>
              </el-aside>
              <el-main>
                  <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }"> 首页 </el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                  </el-breadcrumb>
                  <div v-if="this.$router.currentRoute.path === '/home'">
                        <p class="homeWelcome">Welcome to the Cloud Office platform!</p>
                        <el-carousel arrow="always" :autoplay="false" height="650px">
                            <el-carousel-item>
                                <el-calendar class="calendar" :range="['2019-03-04', '2019-03-24']"></el-calendar>
                            </el-carousel-item>
                            <el-carousel-item>
                                <el-steps :active="4" finish-status="success" class="timeStep" align-center>
                                    <el-step title="Architecture" icon="el-icon-edit"></el-step>
                                    <el-step title="Login" icon="el-icon-upload"></el-step>
                                    <el-step title="Menu" icon="el-icon-picture"></el-step>
                                    <el-step title="Home Page" icon="el-icon-picture"></el-step>
                                </el-steps>
                                <el-steps :active="4" finish-status="success" class="timeStep" align-center>
                                    <el-step title="Basic Setting" icon="el-icon-picture"></el-step>
                                    <el-step title="Admin Setting" icon="el-icon-picture"></el-step>
                                    <el-step title="Basic Employee" icon="el-icon-picture"></el-step>
                                    <el-step title="Chat" icon="el-icon-picture"></el-step>
                                </el-steps>
                                <el-steps :active="3" process-status="finish" finish-status="success" class="timeStep" align-center>
                                    <el-step title="Payroll Setting" icon="el-icon-picture"></el-step>
                                    <el-step title="Employee - Payroll" icon="el-icon-picture"></el-step>
                                    <el-step title="Profile" icon="el-icon-picture"></el-step>
                                    <el-step title="Advance Employee" icon="el-icon-s-custom"></el-step>
                                    <el-step title="Hr Setting" icon="el-icon-document"></el-step>
                                </el-steps>
                                <el-steps finish-status="success" class="timeStep" align-center>
                                    <el-step title="Statistics" icon="el-icon-apple"></el-step>
                                    <el-step title="Salary Table" icon="el-icon-money"></el-step>
                                    <el-step title="System Admin" icon="el-icon-setting"></el-step>
                                    <el-step title="Database Admin" icon="el-icon-coin"></el-step>
                                </el-steps>
                            </el-carousel-item>
                        </el-carousel>
                  </div>
                  <router-view class="homeRouterView"/>
              </el-main>
          </el-container>
      </el-container>
  </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            unprepared: ['月末处理','工资表查询','操作日志管理','备份恢复数据库','初始化数据库']//,'高级资料','系统管理','工资表管理']
            // user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    computed: {
        routes() {
            return this.$store.state.routes;
        },
        notify() {
            return this.$store.state.notification2;
        },
        user() {
            return this.$store.state.currentAdmin;
        }
    }, 
    methods: {
        underConstruction(item, children) {
            return (item.name === '统计管理') || (item.name === '人事管理') || (this.unprepared.includes(children.name));
        },
        commandHandler(command) {
            if (command === 'logout') {
                //确认退出登录
                this.$confirm('This will log you out. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    //注销登录
                    this.postRequest('/logout');
                    //清空用户信息
                    window.sessionStorage.removeItem('tokenStr');
                    window.sessionStorage.removeItem('user');
                    //清空菜单
                    this.$store.commit('initRoutes', []);
                    //跳转到登录页
                    this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Logout canceled'
                    });          
                });
            } else if (command === 'chat') {
                this.$router.push('/chat');
            } else if (command === 'userinfo') {
                this.$router.push('/userinfo');
            }
        }
    }
}
</script>

<style>
    .homeHeader {
        background: #942408fa;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }
    .homeHeader .title {
        font-size: 30px;
        font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        color: white;
    }
    .homeHeader .userInfo {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
        margin-top: -6px;
    }
    .el-dropdown-link {
        margin-bottom: -10px;
    }
    .homeWelcome {
        text-align: center;
        font-size: 40px;
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        color:palevioletred;
        /* padding-top: 3px; */
    }
    .homeRouterView {
        margin-top: 15px;
    }
    .calendar {
        text-align: center;
        font-size: 20px;
        font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        color:palevioletred;
    }
    .timeStep {
        margin-left:100px;
        margin-bottom: 90px;
        margin-top: 40px;
        width: 1070px;
    }
</style>