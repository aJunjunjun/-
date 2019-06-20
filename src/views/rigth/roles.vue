<template>
    <div class="role">
        <!-- 哈喽? -->
        <!-- 添加面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 添加角色 -->
        <div style="margin-top:15px;">
            <el-button type="success" @click="showAddDialog">添加角色</el-button>
        </div>
        <!-- 隐藏添加角色 -->
        <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
            <el-form :model="addForm">
                <el-form-item label="角色名称">
                    <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 隐藏分配角色 -->
        <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
            <div class="rightListBox">
                <el-tree :data="rightList" ref='rightTree' :default-expand-all='true' show-checkbox node-key="id" :default-checked-keys='selectedKeys' :props="defaultProps">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="grantDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 展开区域 -->
        <el-table :data="roleList" style="width: 100%" border>
            <el-table-column type="expand">
                <!-- 这里展开  二级展开模板 -->
                <!-- scope是获取当前表单元素李的数据 -->
                <template slot-scope="scope">
                    <el-row :type='"success"' v-for="first in scope.row.children " :key="first.id" style="margin-bottom:15px">
                        <el-col :span="4">
                            <div class="grid-content bg-purple">
                                <el-tag closable :type="'success'">
                                    {{first.authName}}
                                </el-tag>
                            </div>
                        </el-col>

                        <el-col :span="20">
                            <div class="grid-content bg-purple-light">
                                <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:15px">
                                    <el-col :span="6">
                                        <div class="grid-content bg-purple">
                                            <el-tag closable :type='"info"'>
                                                {{second.authName}}
                                            </el-tag>
                                        </div>
                                    </el-col>
                                    <el-col :span="18">
                                        <div class="grid-content bg-purple-light">
                                            <el-tag closable :type="'warning'" v-for="third in second.children" :key="third.id" style="margin-right:5px;margin-bottom:15px" @close='removeSingleRight(scope.row,third.id)'>
                                                {{third.authName}}
                                            </el-tag>

                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </template>

            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName">
            </el-table-column>
            <el-table-column label="描述" prop="roleDesc">
            </el-table-column>

            <!-- 操作按钮部分 -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content=" 授权" placement="top">
                        <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
  getAllRoleList,
  removeRightByUserId,
  addRole,
  grantRoleSubmit
} from '@/api/role_index.js'
import {
  getAllRightList
} from '@/api/right_index.js'
export default {
  data () {
    return {
      // 分配角色对话框
      grantDialogFormVisible: false,
      //   添加角色对话框
      addDialogFormVisible: false,
      //   添加角色的储存器
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      //   第三子集的id
      selectedKeys: [],
      roleList: [],
      // 隐藏非陪角色的储存器
      rightList: [],
      roleId: '',
      // 树形结构
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    //   加载页面的所有数据  可用于刷新
    async getRoleList () {
      let resule = await getAllRoleList()
      this.roleList = resule.data
    //   console.log(this.roleList)
    },
    async removeSingleRight (roleid, rightid) {
    //   console.log(roleid, rightid)
      let result = await removeRightByUserId(roleid.id, rightid)
      //   console.log(result)
      //   刷新局部的数据
      roleid.children = result.data.data
    },
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 显示隐藏分配角色
    async showGrantDialog (row) {
      this.grantDialogFormVisible = true
      let result = await getAllRightList('tree')
      this.rightList = result.data.data
      this.roleId = row.id
      //   console.log(result)
      this.selectedKeys = []
      //   要拿到第三层的ID 及回到数组
      // 打印输出 当前行的row的id
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.selectedKeys.push(third.id)
                })
              }
            })
          }
        })
      }

      //   发起请求
    },

    // 添加分配角色确定按钮
    async grantRoleSubmit () {
      //   console.log(this.$refs.rightTree.getCheckedNodes())
      var allNode = this.$refs.rightTree.getCheckedNodes()
      var arr = allNode.map(value => {
        return value.id + ',' + value.pid
      })
      //   console.log(arr)
      var ids = arr.join(',')
      //   console.log(ids)
      var temp = ids.split(',')
      //   console.log(temp)
      //   console.log('哈喽')
      // 数组去重复,去掉之后就没有重复的数组值了
      var finalIds = Array.from(new Set(temp))
      //   console.log(finalIds)
      let result = await grantRoleSubmit(this.roleId, finalIds.join(','))
      console.log(result)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.grantDialogFormVisible = false
        this.getRoleList()
      }
    },

    // 添加方法
    async addRole () {
      let result = await addRole(this.addForm)
      console.log(result)
      if (result.data.meta.status === 201) {
        //   这里使用this是因为要调用 组建的的 显示 提示的方法  然后 type 使用组件的 样式
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
      } else if (result.data.data === null) {
        this.$message({
          type: 'error',
          message: result.data.meta.msg
        })
      }
      this.addDialogFormVisible = false
      this.getRoleList()
      //   addForm
    }
  },
  //   添加角色权限描述

  //   钩子函数
  mounted () {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
</style>
