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

export const getAllRoleList = () => {
  return axios.get('roles').then(result => {
    return result.data
  })
}

export const grantRole = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid: rid }).then(result => {
    return result.data
  })
}

export const addUser = obj => {
  return axios.post(`users`, obj).then(result => {
    return result.data
  })
}
// 删除角色指定权限
export const removeRightByUserId = (roleId, rightId) => {
  return axios({
    // 根据后台的请求方法
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 用户列表--添加用户
export const addRole = (params) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: params
  })
}

// 授权用户数据
export const grantRoleSubmit = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { roleId, rids }
  })
}

// 获取左侧菜单栏
export const getLeftMenus = () => {
  return axios({
    url: 'menus'
    // method: 'get'
  })
}
