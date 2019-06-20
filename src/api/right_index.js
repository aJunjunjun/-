import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 实现登陆验证
export const login = (obj, callback) => {
  return axios.post('login', obj).then(result => {
    return result.data
  })
}
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

// 发起请求获取数据
export const getAllRightList = type => {
  return axios({
    // 根据后台的请求方法
    type: 'get',
    url: `rights/${type}`
  })
}
