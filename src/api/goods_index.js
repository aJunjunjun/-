import myaxios from './baseaxios'
// @param {param}

// 展示商品列表
export const getAllGoodsList = (params) => {
  return myaxios({
    method: 'get',
    url: `goods`,
    // url参数对应着传地方的为params
    params
  })
}

export const getAllCategoriesList = (type) => {
  return myaxios({
    method: 'get',
    url: `categories`,
    // url参数对应着传地方的为params
    params: { type: [type] }
  })
}

export const addGoodInfo = (data) => {
  return myaxios({
    method: 'post',
    url: `goods`,
    data
  })
}
