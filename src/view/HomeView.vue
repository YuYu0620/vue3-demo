<script setup>
import { ref, getCurrentInstance } from "vue";
import { login } from "../api/login";
import { useRouter } from "vue-router";
import TimeInput from "../components/time.vue";
defineProps({
  msg: String,
});

const count = ref(0);
let username = ref("meixu");
let password = ref("Aa123456");
const router = useRouter();

let loginFun = async () => {
  try {
    let data = {
      username: username.value,
      password: password.value,
    };
    let res = await login(data);
    if (res.code == 200) {
      proxy.$messages({
        message: "成功",
        type: "success",
      });
      console.log("res.data ============> ", res.data);
      router.push({
        path: "/about",
      });
    }
  } catch (error) {}
};
let day = ref(0);
let inputChange = (event) => {
  day.value = event;
  console.log("event =============> ", event);
};
</script>

<template>
  <div>账号：<el-input type="text" v-model="username" /></div>
  <div>密码：<el-input type="text" v-model="password" /></div>
  <el-button type="primary" round @click="loginFun">登录</el-button>
  <time-input @change="inputChange"></time-input>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
