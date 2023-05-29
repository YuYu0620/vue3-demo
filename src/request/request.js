import axios from "axios";
import { getToken } from "../util/auth"
import qs from "qs";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers["clientname"] = "demo";
axios.defaults.headers["clientversion"] = "1.0.6";

const service = axios.create({
    baseURL: "/driverServApi/admin",
    timeout: 1000 * 60 * 30,
});

let whileApi = ['/login'];

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        console.log("config ===============> ", config);
        if (!whileApi.includes(config.url)) {
            config.headers["Authorization"] = "Bearer " + getToken();
        }
        // get請求映射params參數
        if (config.method === "get" && config.params) {
            let params = qs.stringify(config.params);
            let url = config.url + "?" + params;
            config.params = {};
            config.url = url;
        }
        // // get請求映射params參數
        // if (config.method === "get" && config.params) {
        //     let url = config.url + "?";
        //     for (const propName of Object.keys(config.params)) {
        //         const value = config.params[propName];
        //         var part = encodeURIComponent(propName) + "=";
        //         if (value !== null && typeof value !== "undefined") {
        //             if (typeof value === "object") {
        //                 for (const key of Object.keys(value)) {
        //                     let params = propName + "[" + key + "]";
        //                     var subPart = encodeURIComponent(params) + "=";
        //                     url += subPart + encodeURIComponent(value[key]) + "&";
        //                 }
        //             } else {
        //                 url += part + encodeURIComponent(value) + "&";
        //             }
        //         }
        //     }
        //     url = url.slice(0, -1);
        //     config.params = {};
        //     config.url = url;
        // }
        return config;
    },
    (error) => {
        console.log(error);
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        /**
         * 根据业务和状态码进行逻辑判断
         */
        console.log("res ==============> ", res);
        return res.data;
    },
    (error) => {
        /**
         * 根据业务和状态码进行逻辑判断
         */
        Promise.reject(error);
    }
);

export default service;
