import axios from 'axios'
import {Message} from "element-ui"   //local import
import router from '../router'


//请求拦截器
axios.interceptors.request.use(config => {
    //如果存在token，并请求携带tokenStr
    if (window.sessionStorage.getItem('tokenStr')) {
        // console.log(window.sessionStorage.getItem('tokenStr'))
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
        //若token存在，则之后的请求都会携带该token；后端的token登录拦截器对token进行判断，若有token并且验证成功，则说明登录成功，可以
        //允许访问后续接口；否则过不了拦截器 
    } 
    return config;
}, error => {
    console.log(error);
})


//响应拦截器 - 方便统一处理失败的响应，而不用在每一个调用后端接口时进行判断 (http code, message, objects/data)
axios.interceptors.response.use(success => {     
    //是否成功调用后端接口
    if (success.status && success.status == 200) {  // if status exists and if http status code is 200 (successfully employed)
        //业务逻辑错误
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            Message.error({message: success.data.message});
            return success.data;
        }
        //业务逻辑操作成功
        if (success.data.message) {
            Message.success({message: success.data.message});
        }
    }
    return success.data;    //返回业务对象

}, error => {   //调用后端接口失败
    // console.log(error)
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({message: 'The server has been burnt...'});
    } else if (error.response.code == 403) {
        Message.error({message: 'Not enough permission. Please contact the admin.'});
    } else if (error.response.code == 401) {
        Message.error({message: "Please login"});
        router.replace('/');
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message});
        } else {
            Message.error({message: 'Unknown error'});
        }
    }
    return;
});




let base = '';  //预防项目结束后要求添加前缀路径


//传递json的post请求
export const postRequest = (url, params) => {
    return axios.post(`${base}${url}`, params)
}

//传送json格式的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

//传送json格式的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

//传送json格式的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}