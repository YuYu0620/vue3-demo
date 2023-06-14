<template>
  <div class="tableCss">
    <div class="onlineUser">
      <div class="title">相亲相爱一家人</div>
      <div class="online">在线({{ onlineUser }})</div>
    </div>
    <div class="chatBox">
      <div class="chatList" ref="chatContainer">
        <div v-for="(item, index) in chatList" :key="`chat_${index}`">
          <div class="chatItemLeft" v-if="item.type == 'others'">
            <div class="head">{{ item.userName }}</div>
            <div class="text">{{ item.content }}</div>
          </div>
          <div class="chatItemRight" v-if="item.type == 'self'">
            <div class="head">{{ item.userName }}</div>
            <div class="text">{{ item.content }}</div>
          </div>
          <div class="alert" v-if="item.type == 'add'">
            <div class="text">欢迎 {{ item.userName }} 加入</div>
          </div>

          <div class="alert" v-if="item.type == 'cut'">
            <div class="text">{{ item.userName }} 退出群聊</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chatInput">
      <el-input type="text" class="input" v-model="value"></el-input>
      <el-button class="btn" @click="inputConfirm"> 发送 </el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="连接失败" width="100%">
      <span>是否重新链接</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">否</el-button>
          <el-button type="primary" @click="confirm"> 是 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  reactive,
  onBeforeUnmount,
  getCurrentInstance,
  onBeforeMount,
  watch,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
// 是否与服务端建立链接
let startWs = ref(false);
// 心脏包的定时器
let timeObj = null;
let timeObj2 = null;
// 失败次数
let errorNum = 0;
// 弹窗
let dialogVisible = ref(false);
// 输入的值
let value = ref("");
//消息列表
let chatList = ref([]);
// 在线人数
let onlineUser = ref(0);

const route = useRoute();
let query = reactive({});
onMounted(() => {
  initWebSocket();
  console.log("456");
});
query = route.query;
// 页面销毁清除定时器
onBeforeUnmount(() => {
  heartbeatClearTimeout();
  console.log("ws ===============>");
  console.debug();
  if (webSocket.value && webSocket.value.readyState == webSocket.value.OPEN) {
    let data = {
      type: "cut",
      userName: query.userName,
      token: query.token,
      content: "",
    };
    webSocket.value.send(JSON.stringify(data));
    webSocket.value.close();
    webSocket.value = null;
  }
});

let chatContainer = ref(null);
watch(
  chatList,
  () => {
    nextTick(() => {
      scrollDown();
    });
  },
  { deep: true }
);
const scrollDown = () => {
  const container = chatContainer.value;
  container.scrollTop = container.scrollHeight;
};
// webSocket 实例
const webSocket = ref(null);
// 初始化 WebSocket 连接
const initWebSocket = () => {
  webSocket.value = new WebSocket("ws://10.3.2.117:8666"); // Replace with your WebSocket server URL
  // 监听 WebSocket 事件
  webSocket.value.onopen = onOpen;
  webSocket.value.onmessage = onMessage;
  webSocket.value.onclose = onClose;
  webSocket.value.onerror = onError;
};

// 处理 WebSocket 连接打开事件
const onOpen = () => {
  console.log("WebSocket connection is open");
  if (errorNum == 1) {
    proxy.$messages({
      message: "连接成功",
      type: "success",
    });
  }
  // 发送心跳包或其他必要的初始化数据
  heartCheck();
  let data = {
    type: "login",
    token: query.token,
    userName: query.userName,
    content: "",
  };
  webSocket.value.send(JSON.stringify(data));
  getOnlineUser();
};

// 处理 WebSocket 收到消息事件
const onMessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("message ===========> ", message);
  // 收到消息后重置心脏包
  heartCheck();
  if (!message.type) return;
  if (message.type == "heartbeat") return;
  if (message.type == "getOnlineUser") {
    onlineUser.value = message.msg;
    return;
  }
  if (message.type == "messageList") {
    chatList.value = message.list;
    return;
  }
  let data = null;
  data = {
    type: message.type,
    content: message.content,
    userName: message.userName,
  };
  if (!data) return;
  chatList.value.push(data);
};

// 处理 WebSocket 连接关闭事件
const onClose = () => {
  if (errorNum == 0) {
    errorNum = 1;
    dialogVisible.value = true;
  } else {
    proxy.$messages({
      message: "连接失败，请检查网络等设备",
      type: "success",
    });
    // 在连接错误后，重新初始化 WebSocket 连接
    // initWebSocket();
  }
  heartbeatClearTimeout();
  webSocket.value = null;
};
// 处理 WebSocket 连接错误事件
const onError = (error) => {
  console.error("WebSocket connection error:", error);
  if (errorNum == 0) {
    errorNum = 1;
    dialogVisible.value = true;
  } else {
    proxy.$messages({
      message: "连接失败，请检查网络等设备",
      type: "success",
    });
    // 在连接错误后，重新初始化 WebSocket 连接
    // initWebSocket();
  }
  heartbeatClearTimeout();
  webSocket.value = null;
};

// 重新链接的确认事件
const confirm = () => {
  initWebSocket();
  dialogVisible.value = false;
};

// 点击发送
const inputConfirm = () => {
  if (!value.value) return;
  console.log("value ==========> ", value.value);
  let data = {
    type: "msg",
    userName: query.userName,
    content: value.value,
  };
  webSocket.value.send(JSON.stringify(data));
  value.value = "";
};

// 心脏包
function heartCheck() {
  heartbeatClearTimeout();
  startHeartbeat();
}
// 清除定时器
const heartbeatClearTimeout = () => {
  clearTimeout(timeObj);
  clearTimeout(timeObj2);
};
const startHeartbeat = () => {
  timeObj = setTimeout(() => {
    webSocket.value.send(
      JSON.stringify({
        type: "heartbeat",
        content: "前端心脏包",
      })
    );
    timeObj2 = setTimeout(() => {
      webSocket.value.close();
    }, 60 * 1000);
  }, 10 * 1000);
};

// 获取在线人数
const getOnlineUser = () => {
  webSocket.value.send(
    JSON.stringify({
      type: "getOnlineUser",
      userName: query.userName,
      token: query.token,
    })
  );
};

// // 初始化webSocket
// const initWebSocket = () => {
//   if (ws) return;
//   ws = new WebSocket("ws://localhost:8666");
//   ws.onopen = WebSocketOnOpen;
//   ws.onclose = WebSocketOnclose;
//   ws.onmessage = WebSocketOnMessage;
//   ws.onerror = WebSocketOnError;
// };
// // 页面销毁清除定时器
// onBeforeUnmount(() => {
//   heartbeatClearTimeout();
//   console.log("ws ===============>");
//   console.debug();
//   if (ws && ws.readyState == ws.OPEN) {
//     let data = {
//       type: "cut",
//       userName: query.userName,
//       token: query.token,
//       content: "",
//     };
//     ws.send(JSON.stringify(data));
//     ws.close();
//     ws = null;
//   }
// });
// // 链接成功回调
// const WebSocketOnOpen = (e) => {
//   console.log("连接服务器成功");
//   if (errorNum == 1) {
//     proxy.$messages({
//       message: "连接成功",
//       type: "success",
//     });
//   }
//   errorNum = 0;
//   startWs.value = true;
//   // 重置心跳
//   heartCheck();
//   console.log("query.userName =========> ", query.userName);
//   let data = {
//     type: "login",
//     token: query.token,
//     userName: query.userName,
//     content: "",
//   };
//   ws.send(JSON.stringify(data));
// };
// // 服务器关闭的回调
// function WebSocketOnclose(e) {
//   console.log("服务器关闭");
//   if (errorNum == 0) {
//     errorNum = 1;
//     dialogVisible.value = true;
//   } else {
//     proxy.$messages({
//       message: "连接失败，请检查网络等设备",
//       type: "success",
//     });
//     heartbeatClearTimeout();
//     startWs.value = false;
//   }
//   // setTimeout(() => {
//   //   initWebSocket();
//   // }, 3000);
// }
// // 链接异常关闭的回调
// function WebSocketOnError(e) {
//   console.log("连接出错");
//   if (errorNum == 0) {
//     errorNum = 1;
//     dialogVisible.value = true;
//   } else {
//     proxy.$messages({
//       message: "连接失败，请检查网络等设备",
//       type: "success",
//     });
//     heartbeatClearTimeout();
//     startWs.value = false;
//   }
// }

// // 接受到消息的回调
// function WebSocketOnMessage(event) {
//   let e = JSON.parse(event.data);
//   console.log("e ========> ", e);
//   // 重置心跳
//   heartCheck();
//   if (!e.type) return;
//   if (e.type == "heartbeat") {
//     onlineUser.value = e.msg;
//     return;
//   }

//   if (e.type == "messageList") {
//     chatList.value = e.list;
//     return;
//   }

//   let data = null;
//   data = {
//     type: e.type,
//     content: e.content,
//     userName: e.userName,
//   };
//   if (!data) return;
//   chatList.value.push(data);
// }
// // 心脏包
// function heartCheck() {
//   heartbeatClearTimeout();
//   startHeartbeat();
// }

// const startHeartbeat = () => {
//   timeObj = setTimeout(() => {
//     ws.send(
//       JSON.stringify({
//         type: "heartbeat",
//         content: "前端心脏包",
//       })
//     );
//     timeObj2 = setTimeout(() => {
//       ws.close();
//     }, 60 * 1000);
//   }, 10 * 1000);
// };

// // 清除定时器
// const heartbeatClearTimeout = () => {
//   clearTimeout(timeObj);
//   clearTimeout(timeObj2);
// };

// // 重新链接的确认事件
// const confirm = () => {
//   initWebSocket();
//   dialogVisible.value = false;
// };

// // 点击发送
// const inputConfirm = () => {
//   if (!value.value) return;
//   console.log("value ==========> ", value.value);
//   let data = {
//     type: "msg",
//     userName: query.userName,
//     content: value.value,
//   };
//   ws.send(JSON.stringify(data));
//   value.value = "";
// };
</script>

<style lang="less" scoped>
.tableCss {
  width: 100%;
  height: 100vh;
  .onlineUser {
    height: 7%;
    width: 100%;
    background-color: #fff;
    color: #000;
    display: flex;
    justify-items: center;
    align-items: center;
    font-size: 15px;
    padding: 0px 16px;
    box-sizing: border-box;
    position: relative;
    .title {
      width: 100%;
      text-align: center;
      span {
        font-size: 13px;
        color: #ccc;
      }
    }
    .online {
      position: absolute;
      font-size: 13px;
      color: #ccc;
      right: 16px;
    }
  }
  .chatBox {
    width: 100%;
    height: 83%;
    box-sizing: border-box;
    background-color: rgba(1, 190, 248, 0.2);
    .chatList {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 16px;
      box-sizing: border-box;
      .chatItemLeft {
        display: flex;
        margin-top: 16px;
        .head {
          width: 42px;
          height: 42px;
          margin-right: 16px;
          background-color: #ccc;
          border-radius: 8px;
        }
        .text {
          max-width: calc(100% - 72px);
          border-radius: 8px;
          background-color: #fff;
          line-height: 26px;
          padding: 8px;
          box-sizing: border-box;
          font-size: 15px;
          word-break: break-all;
        }
      }
      .chatItemRight {
        margin-top: 16px;
        display: flex;
        flex-direction: row-reverse;
        .head {
          width: 42px;
          height: 42px;
          margin-left: 16px;
          background-color: #ccc;
          border-radius: 8px;
        }
        .text {
          max-width: calc(100% - 72px);
          border-radius: 8px;
          background-color: #fff;
          height: 42px;
          line-height: 26px;
          padding: 8px;
          box-sizing: border-box;
          font-size: 15px;
        }
      }

      .alert {
        width: 100%;
        height: 16px;
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
          min-width: 46px;
          max-width: 50%;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 2px 8px;
          border-radius: 16px;
          font-size: 12px;
          text-align: center;
          color: rgb(138, 138, 138);
        }
      }
    }
  }
  .chatInput {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10%;
    background-color: rgba(127, 255, 212, 0.219);
    .input {
      padding: 0px 16px;
      ::v-deep .el-input__wrapper {
        input {
          height: 32px;
          line-height: 32px;
        }
      }
    }
    .btn {
      margin-right: 16px;
      height: 32px;
      line-height: 32px;
    }
  }
  // .item {
  //   content-visibility: auto;
  //   contain-intrinsic-size: 22px;
  // }
}
</style>