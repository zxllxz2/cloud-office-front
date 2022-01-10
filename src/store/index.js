import Vue from 'vue'
import Vuex from 'vuex'
import { getRequest } from '../utils/api.js'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui';

Vue.use(Vuex)
const now = new Date()

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        currentSession: null,
        filterKey: '',
        stomp: null,
        isDot: {},
        notification2: {}
    },

    //同步改变state值
    mutations: {
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin;
        },
        INIT_CURRENTADMIN(state, admin) {
            state.currentAdmin = admin;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSession(state, currentSession) {
            state.currentSession = currentSession;
            Vue.set(state.isDot, state.currentAdmin.username + '@' + state.currentSession.username, false);
            Vue.set(state.notification2, state.currentAdmin.username, false);
        },
        addMessage(state, msg) {
            let mss = state.sessions[state.currentAdmin.username + '@' + msg.to];
            if (!mss) {
                // state.sessions[state.currentAdmin.username + '@' + msg.to] = [];
                Vue.set(state.sessions, state.currentAdmin.username + '@' + msg.to, []);
            }
            state.sessions[state.currentAdmin.username + '@' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            });
        },
        INIT_DATA(state) {
            //浏览器本地历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_ADMINS(state, data) {
            state.admins = data;
        }
    },

    //异步改变state值
    actions: {
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            let token = window.sessionStorage.getItem('tokenStr');
            context.state.stomp.connect({'Auth-Token' : token}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    //接受消息，to和from互换
                    let receiveMsg = JSON.parse(msg.body);
                    //如果在聊天入口页或不在当前发消息用户的聊天页面，弹框提醒新消息
                    if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username) {
                        Notification.info({
                            title: 'A message from [ ' + receiveMsg.fromNickName + ' ]',
                            message: receiveMsg.content.length > 12 ? receiveMsg.content.substr(0, 12) : receiveMsg.content,
                            position: 'bottom-right'
                        });
                        Vue.set(context.state.isDot, context.state.currentAdmin.username + '@' + receiveMsg.from, true);
                        Vue.set(context.state.notification2, context.state.currentAdmin.username , true);
                    }
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg);
                });
            }, error => {
                console.log(error);
            });
        },
        initData(context) {
            context.commit('INIT_DATA');
            getRequest('/chat/admin/?keywords=' + context.state.filterKey).then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp);
                }
            });
        }
    }
})


store.watch(function (state) {
    return state.sessions;
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;