import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入font-awesome css包
import 'font-awesome/css/font-awesome.css'
//引入functions
import { postRequest } from './utils/api.js'
import { putRequest } from './utils/api.js'
import { getRequest } from './utils/api.js'
import { deleteRequest } from './utils/api.js'
import { initMenu } from "./utils/menus.js"
import { downloadRequest } from './utils/download.js'


Vue.config.productionTip = false
Vue.use(ElementUI)

//以插件的形式使用api.js中的请求，避免在每一个组件页面都需要导入对应的请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

/**
 * 全局前置守卫（路由导航守卫）：
 * 每次进行路由跳转之前，都会先经过此守卫
 * @param to    将要跳转到的路由
 * @param from  跳转来的路由
 * @param next  进行跳转
 */
router.beforeEach((to, from, next) => {
  //判断是否登录
  if (window.sessionStorage.getItem('tokenStr')) {
    //初始化菜单
    initMenu(router, store);
    //判断用户信息是否存在
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/admin/info').then(resp => {
        if (resp) {
          //存入用户信息
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          store.commit('INIT_CURRENTADMIN', resp);
          store.commit('INIT_ADMIN', resp);
          next();
        }
      });
    }
    if (from.path === '/chat') {
      store.state.currentSession = null;
    }
    next();
  }
  else {
    if (to.path === '/') {
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
