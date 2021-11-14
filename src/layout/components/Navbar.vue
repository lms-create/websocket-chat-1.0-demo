<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu flex-start-center">
      <el-button
        class="modifyBtn"
        style="font-size: 16px;"
        type="text"
        @click="dialogFormVisible = true"
      >
        修改密码
      </el-button>
      <p>{{ userInfo ? userInfo.user_name : "管理员" }}，你好</p>
      <p
        class="margin-left-10 pointer"
        @click="logout"
      >
        退出
      </p>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      center
      width="500px"
      @closed="close"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="Rules"
        label-width="100px"
      >
        <el-form-item
          label="新密码:"
          prop="OldPassword"
        >
          <el-input
            ref="OldPassword"
            v-model="form.OldPassword"
            name="OldPassword"
            placeholder="请输入密码"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="确认新密码:"
          prop="NewPassword"
        >
          <el-input
            ref="NewPassword"
            v-model="form.NewPassword"
            name="NewPassword"
            placeholder="请再次输入密码"
            clearable
            @keyup.enter.native="EditPassword"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click.native.prevent="EditPassword"
        >
          修改
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.OldPassword) {
        callback(new Error('两次密码不一致，请检查后重新输入'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        OldPassword: '',
        NewPassword: ''
      },
      Rules: {
        OldPassword: [{ required: true, trigger: 'blur', validator: validateOldPassword }],
        NewPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo'])
  },
  methods: {
    close() {
      this.$refs['form'].resetFields()
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$store.commit('websocket/setClose')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    EditPassword() {
      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     this.dialogFormVisible = false
      //     window.$common.post('/api/admin/reset', { id: this.userInfo.id, newpassword: this.$sha256(this.form.NewPassword) }).then(
      //       res => {
      //         if (res.data.retcode === 1) {
      //           console.log(res)
      //         } else {
      //           this.$message.error(res.data.msg)
      //         }
      //       }
      //     )
      //   } else {
      //     //
      //   }
      // })
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .modifyBtn{
    font-size: 16px;
    font-weight: 400;
    color: #303133;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    padding-right: 15px;
    .el-button{
      margin-right: 15px;
    }
  }
  .el-dialog__body{
    .el-form{
      margin-left: 20%;
      width: 60%;
    }
  }
}

</style>
