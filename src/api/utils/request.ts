// const axios = require('axios')

import axios from "axios";
import qs from "qs";
// const qs = require('qs')
// import Toast from 'vant/lib/toast';
// import 'vant/lib/toast/style';
import {
    sleep
} from "./index";


class NbRequest {
    timeout:any
    method:any
    retryTimes:any
    retryDelay:any
    constructor() {
        this.timeout = 30 * 1000 // request timeout  0表示不超时
        this.method = 'post'
        this.retryTimes = 3 //重新请求次数
        this.retryDelay = 1000 //重新发起请求的延迟时间
    }
    /**
     *创建一个axios实例
     *
     * @param {*} url 请求url
     * @param {*} method 请求方法
     * @param {*} [params={}] 请求数据
     * @param {*} [headers={}] 请求头
     * @param {boolean} [needQs=false] 请求数据是否需要qs序列化
     * @param {string} [contentType='json'] 请求头类型 值为[json]或者[formData]
     * @param {string} [responseType='json'] 返回数据类型   
     * @param {*} timeout 超时时间
     * @param {*} [AxiosOptions={}] axios配置 会覆盖前面的参数
     * @returns
     * @memberof NbRequest
     */
    request(url, method, params = {}, headers = {}, needQs = false, contentType = 'json', responseType = 'json', timeout, AxiosOptions = {}) {
        let instance = axios.create();
        this.setInterceptor(instance, needQs);
        method = method ? method : this.method;
        let _method = method.toLocaleUpperCase()
        const config = { // 将用户传过来的参数与公共配置合并。
            url: url,
            method: method,
            headers: Object.keys(headers).length ?
                headers : contentType === 'json' ? {
                    'Content-Type': 'application/json;charset=utf-8'
                } : contentType === 'formData' ? {
                    'Content-Type': 'multipart/form-data'
                } : {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            data: ['POST', 'PUT', 'PATCH'].includes(_method) ? params : null,
            params: ['GET', 'DELETE'].includes(_method) ? params : null,
            timeout: timeout ? timeout : this.timeout,
            responseType: responseType,
            ...AxiosOptions,
        };
        return instance(config)
    }
    /**
     *设置拦截器
     *
     * @param {*} request axios实例
     * @param {*} needQs 是否需要qs处理
     * @memberof DzRequest
     */
    setInterceptor(request, needQs) {
        // request interceptor 请求拦截
        request.interceptors.request.use(
            config => {
                config.retryTimes = config.retryTimes === undefined ? this.retryTimes : config.retryTimes; //重新请求次数
                config.retryDelay = config.retryDelay ? config.retryDelay : this.retryDelay; //每次请求的delay
                // config.headers['Authorization'] = 'Basic ' + 'eGlhb2ppZXd1MTlAZ21haWwuY29tOkxpdS4uMTIw'
                // config.headers['Content-Type'] = 'application/json'
                config.transformRequest = [function (data) {
                    // 对 data 进行任意转换处理
                    return needQs ? qs.stringify(data) : data;
                }, ...axios.defaults.transformRequest];
                return config
            },
            error => {
                // do something with request error
                return Promise.reject(error)
            }
        )
        // 添加响应拦截器
        request.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            return responseThen(response);
        }, function (error) {
            // 对响应错误做点什么
            return responseCatch(error, request);
        });

    }
    get(url, params = {}, headers = {}, needQs?, contentType?, responseType?, timeout?, AxiosOptions?) {
        
        return this.request(url, 'GET', params, headers, needQs, contentType, responseType, timeout, AxiosOptions)
    }
    post(url, params = {}, headers = {}, needQs?, contentType?, responseType ?, timeout?, AxiosOptions?) {
        return this.request(url, 'POST', params, headers, needQs, contentType, responseType, timeout, AxiosOptions)
    }

}

// 正常返回拦截
function responseThen(response) {
    // Toast.clear()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    // 可以做一些 errcode的判断之类的 ，但是因为目前没有统一... 直接返回的是数据
    // if (res.code !== 0) {
    //     return Promise.reject(new Error(res.msg || 'Error'))
    // } else {
    return res
    // }
}

// 返回异常处理
function responseCatch(err, axios) {
    // Toast.clear()
    var config = err.config;
    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
    if (config.__retryCount < config.retryTimes) {
        // console.log(`${config.baseURL}${config.url} 当前重试次数:${config.__retryCount}`);
        //重试次数自增
        config.__retryCount += 1;
        //延时处理
        //重新发起axios请求
        return sleep(config.retryDelay || 1).then(function () {
            return axios(config);
        });
    } else {
        // console.log(`错误次数超过总次数：${config.retryTimes}`);
        // 当响应异常时做一些处理
        if (err && err.response) {
            // console.log('axios 请求失败： ', err.response.status, err.response.data) // for debug
            // console.log(config);
            switch (err.response.status) {
                case 400:
                    err.message = err.response.data || '请求错误(400)';
                    break;
                case 401:
                    err.message = '未授权，请重新登录(401)';
                    break;
                case 403:
                    err.message = '拒绝访问(403)';
                    break;
                case 404:
                    err.message = '请求出错(404)';
                    break;
                case 407:
                    err.message = 'Unauthorized(407)';
                    break;
                case 408:
                    err.message = '请求超时(408)';
                    break;
                case 500:
                    err.message = '服务器错误(500)';
                    break;
                case 501:
                    err.message = '服务未实现(501)';
                    break;
                case 502:
                    err.message = '网络错误(502)';
                    break;
                case 503:
                    err.message = '服务不可用(503)';
                    break;
                case 504:
                    err.message = '网络超时(504)';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持(505)';
                    break;
                default:
                    err.message = `连接出错(${err.response.status})!`;
            }
        } else {
            err.message = '连接服务器失败!'
        }
        // Toast.fail({
        //     message: err.message || '未知错误',
        //     duration: 3 * 1000
        // })
        return Promise.reject(err)
    }
}

export default new NbRequest();