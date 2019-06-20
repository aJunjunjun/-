<template>
    <div class="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框部分 -->
        <div style="margin-top:15px;">
            <el-input placeholder="请输入内容" @keyup.enter.native="serachUser" v-model="query" class="input-with-select searchBox" clearable>
                <el-button slot="append" icon="el-icon-search" @click='serachUser'></el-button>
            </el-input>
            <el-button type="success" @click="addDialogFormVisible = true">添加用户</el-button>
        </div>
        <!-- 数据展示区 -->
        <el-table :data="userList" height="250" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <!-- 因为已经双向绑定数据,所以将用户输入的内容全部转换成小写  prop -->
            <el-table-column prop="username" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeStatu($event,scope.row.id)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content=" 分配角色" placement="top">
                        <el-button type="success" icon="el-icon-share" @click="showGrantRoleDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加用户弹出框结构 -->
        <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
            <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'120px'">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
                    <el-input v-model="addForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop='password'>
                    <el-input v-model="addForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
                    <el-input v-model="addForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop='mobile'>
                    <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click='addSubmit'>确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑提示 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
            <el-form :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="用户名" :label-width="formLabelWidth" dis>
                    <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配提示 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
            <el-form :model="roleForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.username" auto-complete="off" style='width:122px' disabled=""></el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="roleForm.rid" placeholder="请选择" @change='selectRole'>
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分页显示 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import {
  getUserList,
  editUser,
  delUserById,
  updateUserStatuById
} from '@/api/user_index'
import {
  grantRole,
  getAllRoleList,
  addUser
} from '@/api/role_index.js'
export default {
  data () {
    return {
      total: 0,

      addDialogFormVisible: false,
      roleDialogFormVisible: false,
      // 添加用户窗口
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色弹窗的粗存数据
      roleList: [],
      roleForm: {
        // 根据后台的需要存储
        id: '',
        username: '',
        // 默认值
        rid: '40'

      },
      formLabelWidth: '120px',
      editDialogFormVisible: false,

      // 用户状态
      userstatu: true,
      // 当前页码为1
      query: '',
      // 每页显示数据
      pagenum: 1,
      // 每页显示的记录数
      pagesize: 1,
      // 表格数据源
      userList: [],
      // 编辑对象
      editForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],

        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          pattern: /^1[34578]\d{9}$/,
          message: '目前只支持中国大陆的手机号码'
        }
        ]
      }
    }
  },
  methods: {
    //   显示分页功能
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 点击当前的事件传递当前的参数传递给this.pagesize
      this.pagesize = val
      //   局部刷新页面
      this.init()
    },
    handleCurrentChange (val) {
      // 点击当前的事件传递当前的参数传递给this.pagenum
      console.log(`当前页: ${val}`)
      this.init()
      this.pagenum = val
    },
    //   实现添加点击弹出添加的信息列表框
    addSubmit () {
      addUser(this.addForm).then(result => {
        console.log(result)
        if (result.meta.status === 201) {
          this.$message({
            type: 'success',
            'message': result.meta.msg
          })
          this.init()
          this.addDialogFormVisible = false
          // 没有绑上去
          this.$refs['addForm'].resetFields()

          console.log(123)
        }
      })
    },
    //   实现用户搜索功能
    serachUser () {
      this.init()
    },
    //   实现角色分配
    grantRoleSubmit () {
      grantRole(this.roleForm.id, this.roleForm.rid).then(result => {
        console.log(result)
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            'message': result.meta.msg
          })
          this.init()
          this.roleDialogFormVisible = false
        }
      })
    },
    selectRole (a) {
      console.log(a)
    },
    // 分配角色点击调用 this.editDialogFormVisible = true
    showGrantRoleDialog (row) {
      this.roleDialogFormVisible = true
      this.roleForm.id = row.id
      this.roleForm.username = row.username
      this.roleForm.rid = row.rid
    },
    //   修改状态信息
    changeStatu (type, id) {
      console.log(123)
      updateUserStatuById(id, type).then(result => {
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
          this.init()
        }
      })
    },
    // 让对话框显示
    showEditDialog (data) {
      this.editDialogFormVisible = true
      console.log(data)
      this.editForm.id = data.id
      this.editForm.username = data.username
      this.editForm.mobile = data.mobile
      this.editForm.email = data.email
    },
    // 封装了一个刷新页面的函数
    init () {
      // 获取用户列表数据
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result)
        this.userList = result.data.users
        this.total = result.data.total
      })
    },
    // 实现编辑
    editSubmit () {
      //   console.log(this.$refs)
      //   console.log(this.$refs.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm).then(result => {
            this.init()
            this.editDialogFormVisible = false
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    // 实现删除
    del (id) {
      // console.log(123);
      this.$confirm(`此操作将永久删除该文件${id}, 是否继续?, 提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id).then(result => {
          if (result.meta.status === 200) {
            // 给出提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
    }
  },
  //   挂载钩子函数
  mounted () {
    this.init()
    getAllRoleList().then(result => {
      console.log(result)
      this.roleList = result.data
    })
  }
}
</script>

<style lang="less" scoped>
.user .searchBox {
    width: 300px;
    margin-right: 10px;
}
</style>
