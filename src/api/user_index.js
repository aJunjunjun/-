import axios from 'axios';
import { type } from 'os';
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// 实现登陆验证
export const login = (obj, callback) => {
  return axios.post('login', obj).then(result => {
    return result.data
  })
};

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 获取token
    var token = localStorage.getItem('itcastpro_token')
    if (token) {
      //   在发送的时候传递token
      config.headers['Authorization'] = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 获取用户数据
export const getUserList = obj => {
  return axios
    .get('users', {
      params: obj
    })
    .then(result => {
      return result.data
    })
};

// 编辑信息
export const editUser = obj => {
  return axios.put(`users/${obj.id}`, obj).then(result => {
    return result.data
  })
};

// 删除信息
export const delUserById = id => {
  return axios.delete(`users/${id}`).then(result => {
    return result.data
  })
};

// 修改用户状态
export const updateUserStatuById = (id, type) => {
  return axios.put(`users/${id}/state/${type}`).then(result => {
    return result.data
  })
};
