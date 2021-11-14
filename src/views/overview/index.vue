<template>
  <div class="index">
    <div class="chat-box">
      <div class="friend">
        <div class="serach-user">在线用户</div>
        <div v-for="item in socketUserList" :key="item.account" class="friend-card" @click="changeUser(item)">
          <div class="card-name"><p>{{ item.user_name }}</p></div>
          <div style="color: #1abb27;font-weight:400">在线</div>
        </div>
        <div v-show="socketUserList.length === 0" class="no-user-message">
          <p>当前无用户在线</p>
        </div>
      </div>
      <div class="chat">
        <div class="chat-head">{{ nowuser.now_user_name }}</div>
        <div class="message-box">
          <div id="message" class="show-message">
            <div v-show="nowuser.now_user_account !== ''" class="single-message-box">
              <div
                v-for="item in record"
                :key="item.id"
                :class="item.flag == 1 ? 'single-me' : 'single-message'"
              >
                <span />
                <div v-show="item.flag === 2">{{ item.message }}</div>
                <div v-show="item.flag === 1">{{ item.message }}</div>
              </div>
            </div>
          </div>
          <div class="input-message">
            <el-input v-model="textarea" class="textarea" type="textarea" />
            <div class="input-button">
              <el-button type="primary" :disabled="nowuser.flag" @click="sendMsg">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      textarea: '',
      socket: null,
      sendUserName: 'aaa',
      record: [],
      selectUser: '',
      nowuser: {
        now_user_name: '请选择聊天的对象',
        flag: true,
        now_user_account: ''
      }
    }
  },
  watch: {
    'socketUserList.length': function(val) {
      if (val === 0) {
        this.nowuser = {
          now_user_name: '请选择聊天的对象',
          flag: true,
          now_user_account: ''
        }
      }
    },
    socketMsgs: function() {
      this.getChatRecord()
      this.scrollEnd()
    }
  },
  created() {
    this.$store.commit('websocket/webSocketInit')
  },
  computed: {
    ...mapGetters(['userInfo', 'socketUserList', 'socketMsgs'])
  },
  methods: {
    scrollEnd() {
      this.$nextTick(() => {
        var div = document.getElementById('message')
        div.scrollTop = div.scrollHeight
      })
    },
    // 切换聊天的对象
    changeUser(data) {
      this.textarea = ''
      this.nowuser = {
        now_user_name: data.user_name,
        now_user_account: data.user_account,
        flag: false
      }
      this.getChatRecord()
      this.scrollEnd()
    },
    getChatRecord() {
      this.record = JSON.parse(sessionStorage.getItem(this.nowuser.now_user_account))
    },
    sendMsg() {
      if (this.textarea === '') {
        return true
      } else {
        const data = {
          type: 1,
          user_account: this.userInfo.user_account,
          msg: this.textarea,
          sendTo: this.nowuser.now_user_account
        }
        console.log(data)
        const chatRecord = JSON.parse(sessionStorage.getItem(this.nowuser.now_user_account)) || []
        chatRecord.push({
          flag: 1,
          message: this.textarea
        })
        sessionStorage.setItem(this.nowuser.now_user_account, JSON.stringify(chatRecord))
        this.$store.commit('websocket/webSocketSend', data)
        this.getChatRecord()
        this.scrollEnd()
        this.textarea = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index{
  display: flex;
  // background: url(../../assets/images/background.jpeg) repeat;
  height: calc(100vh - 50px);
  align-items: center;
  justify-content: center;
  .chat-box{
    background-color: #fff;
    border: 1px solid #a1a1a1;
    border-radius: 10px;
    // box-sizing: content-box;
    width: 800px;
    height: 550px;
    display: flex;
    .friend {
      border-right: 1px solid #b8b8b8;
      // padding: 5px 0px;
      width: 250px;
      .no-user-message{
        margin-top: 30px;
        text-align: center;
      }
      .serach-user{
        height: 49px;
        line-height: 49px;
        text-align: center;
        border-bottom: 1px solid #dddddd;
      }
      .friend-card{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        height: 60px;
        .card-name{
          margin-left: 10px;
          p{
            font-size: 17px;
            font-weight: 500;
          }
        }
      }
      .friend-card:hover{
        background-color: rgb(228, 228, 228);
      }
    }
    .chat {
      flex: 1;
      .chat-head{
        height: 49px;
        line-height: 49px;
        text-align: center;
        border-bottom: 1px solid #dddddd;
      }
      .message-box{
        height: calc(100% - 49px);
        display: flex;
        flex-direction: column;
        .show-message{
          height: 319px;
          overflow: auto;
          .single-message-box{
            display: flex;
            flex-direction: column;
            .single-me{
              align-self: flex-end;
              margin: 10px 20px;
              padding: 8px 20px;
              border-radius: 15px;
              border: 1px solid #000;
            }
            .single-message{
              align-self: start;
              margin: 10px 20px;
              padding: 8px 20px;
              border-radius: 15px;
              border: 1px solid #000;
            }
          }
        }
        .input-message{
          border-top:1px solid #dddddd;
          height: 180px;
          .input-button{
            height: calc(100% - 130px);
            margin-right: 10px;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
          }
          /deep/ .el-textarea__inner{
            height: 130px;
            resize: none;
            border: none;
          }
        }
      }
    }
  }
}
</style>
