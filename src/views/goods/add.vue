<template>
    <!-- 添加滑动组件 -->
    <div class="add">
        <el-steps :active="activeName-0" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
            <el-step title="步骤 5"></el-step>
        </el-steps>
        <!-- 左侧滑动组件 -->
        <el-form label-width="80px">
            <el-tabs v-model="activeName" tab-position="left" @tab-click='handleClick' style="margin-top:30px">
                <el-tab-pane label="用户管理" name="0">
                    <el-form-item label="商品名称">
                        <el-input v-model="goodsForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="goodsForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="goodsForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="goodsForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader :options="cateList" :props="cateProps" change-on-select="true" @change="cateChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                </el-tab-pane>
                <!-- 文件上传 -->
                <el-tab-pane label="文件上传" name='1'>
                    <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :file-list="fileList" list-type="picture" :headers='setToken()' :on-success='uploadSucess'>
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品描述" name='2'>
                    <quill-editor v-model="goodsForm.goods_introduce" ref="myQuillEditor" :options="editorOption" style="height:400px"></quill-editor>

                </el-tab-pane>
                <el-tab-pane label="定时任务补偿" name='3'></el-tab-pane>
                <el-tab-pane label="定时任务补偿" name='4'></el-tab-pane>

            </el-tabs>
            <el-button type="success" @click='addGoods'>添加商品</el-button>
        </el-form>
    </div>
</template>

<script>
import {
  getAllCategoriesList, addGoodInfo
} from '@/api/goods_index.js'

export default {
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      },
      fileList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateList: [],
      activeName: 0,
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  //   加载选项是用钩子函数一开始就加载
  mounted () {
    getAllCategoriesList().then(result => {
      console.log(result)
      this.cateList = result.data.data
    })
  },
  methods: {
    //   添加商品描述
    async addGoods () {
      console.log(this.goodsForm)
      let result = await addGoodInfo(this.goodsForm)
      console.log(result)
      if (result.data) {

      }
    },
    // 设置文件上传的token设置
    setToken () {
      return {
        'Authorization': localStorage.getItem('itcastpro_token')
      }
    },
    handleClick (obj) {
      //   console.log(a)
    },
    // 上传成功调用这个函数
    uploadSucess (response, file, fileList) {
      console.log(this.goodsForm.pics)
      //   console.log(response)
      //   console.log(this.goodsForm)
      this.goodsForm.pics.push({
        pic: response.data.tmp_path
      })
      console.log(this.goodsForm.pics)
    },

    cateChange (value) {
      // 传入value表示当前点击按钮 ,点击哪个就传入哪个的ID
      console.log(value.join(','))
      this.goodsForm.goods_cat = value.join(',')
    }
  }
}
</script>

<style lang="less">

</style>
