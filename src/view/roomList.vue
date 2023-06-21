<template>
  <div class="roomPage">
    <div class="roomList">
      <div
        class="room"
        v-for="(item, index) in roomList"
        :key="`room_${index}`"
        @click="goToPage(item)"
      >
        <div class="roomImg"></div>
        <div class="roomContent">
          <div class="roomName">{{ item.roomName }}</div>
          <div class="message" v-if="item.allMessages.length > 0">
            {{
              item.allMessages[item.allMessages.length - 1].userName
                ? item.allMessages[item.allMessages.length - 1].userName
                : ""
            }}:{{
              item.allMessages[item.allMessages.length - 1].content
                ? item.allMessages[item.allMessages.length - 1].content
                : ""
            }}
          </div>
        </div>
        <div class="roomDate" v-if="item.allMessages.length > 0">
          {{ item.date }}
        </div>
      </div>

      <div class="error" v-if="roomList.length == 0">
        <div>暂无聊天记录</div>
        <el-button @click="dialogStatus = true"> 点击新增 </el-button>
      </div>

      <el-dialog
        v-model="dialogStatus"
        title="新增聊天"
        width="100%"
        :before-close="handleClose"
      >
        <el-form :model="form" label-width="70px" :rules="rules">
          <el-form-item label="名称" prop="roomName">
            <el-input v-model="form.roomName"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">Cancel</el-button>
            <el-button type="primary" @click="confirm"> Confirm </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let query = reactive({});
query = route.query;

// webSocket实例
let webSocket = ref(null);
// 定时器1
let timeObj = null;
// 定时器2
let timeObj2 = null;
// 房间列表
let roomList = ref([]);
// 弹窗状态
let dialogStatus = ref(false);
let form = reactive({
  roomName: "",
});
const rules = reactive({
  roomName: [
    {
      required: true,
      message: "名称不能为空",
      trigger: "blur",
    },
  ],
});
onMounted(() => {
  initWebSocket();
});
// 页面销毁清除定时器
onBeforeUnmount(() => {
  heartbeatClearTimeout();
  console.log("ws ===============>");
  if (webSocket.value && webSocket.value.readyState == webSocket.value.OPEN) {
    webSocket.value.close();
    webSocket.value = null;
  }
});
const initWebSocket = () => {
  webSocket.value = new WebSocket("ws://10.3.2.117:8666"); // Replace with your WebSocket server URL
  // 监听 WebSocket 事件
  webSocket.value.onopen = onOpen;
  webSocket.value.onmessage = onMessage;
  webSocket.value.onclose = onClose;
  webSocket.value.onerror = onError;
};

// 链接成功之后的回调
const onOpen = () => {
  // 重置心跳包
  heartCheck();
  // 獲取房價列表
  webSocket.value.send(
    JSON.stringify({
      type: "getRoomList",
      userName: query.userName,
    })
  );
};

//接收到消息之后的回调
const onMessage = (message) => {
  console.log("message: ", message);
  let data = JSON.parse(message.data);
  if (data.type == "roomList") {
    roomList.value = data.list;
    console.log("roomList.value ========> ", data.list);
  }
  // 重置心跳包
  heartCheck();
};

// 关闭链接之后的回调
const onClose = () => {};

//链接异常的回调
const onError = () => {};

//弹窗关闭
const handleClose = () => {
  dialogStatus.value = false;
  form.roomName = "";
};

// 提交按钮
const confirm = () => {
  if (!form.roomName) return;
  let data = {
    type: "addRoom",
    roomName: form.roomName,
    roomId: "A1", // 后期由数据库自动生成
    userName: query.userName,
  };
  webSocket.value.send(JSON.stringify(data));
  dialogStatus.value = false;
};

// 跳轉到聊天頁
const goToPage = (item) => {
  router.push({
    path: "/chat",
    query: {
      roomName: item.roomName,
      roomId: item.roomId,
      userName: query.userName,
    },
  });
};

// 心脏包
const heartCheck = () => {
  heartbeatClearTimeout();
  startHeartbeat();
};
// 清除定时器
const heartbeatClearTimeout = () => {
  clearTimeout(timeObj);
  clearTimeout(timeObj2);
};
// 定时发送心脏包
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
</script>


<style lang="less" scoped>
.roomPage {
  width: 100%;
  height: 100vh;
  .roomList {
    width: 100%;
    height: 100%;
    .error {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .el-button {
        margin-top: 16px;
      }
    }

    .room {
      width: 100%;
      display: flex;
      padding: 16px;
      box-sizing: border-box;
      .roomImg {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        background-color: rgb(0, 119, 255);
        margin-right: 8px;
      }
      .roomContent {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        .roomName {
          font-size: 15px;
        }
        .message {
          font-size: 14px;
          color: rgb(141, 141, 141);
        }
      }
      .roomDate {
        font-size: 14px;
        color: rgb(141, 141, 141);
      }
    }
  }
}
</style>