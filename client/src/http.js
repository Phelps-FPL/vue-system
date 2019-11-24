import axios from 'axios';
import { Loading,Message } from 'element-ui';

let loading;
function startLoading(){
    loading = Loading.service({
        lock:true,
        text: '拼命加载中',
        background:'rgba(0,0,0,0,7)'
    });
    
}

function endLoading(){
    loading.close();
}
//请求拦截
axios.interceptors.request.use(config=>{
        //加载动画
        startLoading();

         //判断本地token是否存在
         if(localStorage.eleToken){
             //设置统一请求头
             config.headers.Authorization = localStorage.eleToken;
         }

        return config;
}),
error =>{
    return Promise.reject(error);
};

//响应拦截
axios.interceptors.response.use(response=>{
    //结束动画
    endLoading();

    return response;
}),
error=>{
    //错误提醒 也要结束动画
    endLoading();
    // 添加提醒插件
    Message.error(error.response.data);
    return Promise.reject(error);
    //获取错误状态码
    const {status}  = error.response;
    if(status == 401){
        Message.error('token已失效，请重新登录');
        //清除token
        localStorage.removeItem('eleToken');
        //跳转到登录页面
        router.push('/login');
    }
}

export default axios;