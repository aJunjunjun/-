<template>
    <!-- em-ui模板 -->
    <div class="login">
        <div class="container">
            <el-form
                :model="LoginForm"
                :rules="rules"
                ref="LoginForm"
                class="demo-ruleForm"
            >
                <img src="../assets/login.jpg" alt="" class="avatar" />
                <el-form-item label prop="username">
                    <el-input
                        v-model="LoginForm.username"
                        prefix-icon="myicon myicon-user" value="admin"
                    ></el-input>
                </el-form-item>
                <el-form-item label prop="password" >
                    <el-input
                        v-model="LoginForm.password"
                        prefix-icon="myicon myicon-key" value="123456"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        class="login-btn"
                        @click="loginSubmit('LoginForm')"
                        >登陆</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user_index'
// import { log } from 'util'
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    loginSubmit (formname) {
      //   console.log(1)
      //   console.log(this.$refs)
      //   console.log(this.$refs[formname])
      //   console.log(formname)
      this.$refs[formname].validate(valid => {
        if (valid) {
          login(this.LoginForm).then(result => {
            console.log(result)
            localStorage.setItem('itcastpro_token', result.data.token)
            if (result.meta.status === 200) {
              // 要进行跳转
              this.$router.push({ name: 'Home' })
            } else {
              this.$message.error(result.meta.msg)
            }
          })
        } else {
          this.$message.error('数据输入不合法')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #2f4050;
    .container {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 0px 40px 15px 40px;
        margin: 200px auto;
        background: white;
        .avatar {
            position: relative;
            left: 50%;
            width: 120px;
            height: 120px;
            margin-left: -60px;
            margin-top: -60px;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid #fff;
            box-shadow: 0 1px 5px #ccc;
            overflow: hidden;
        }
        .login-btn {
            width: 100%;
        }
    }
}
</style>
