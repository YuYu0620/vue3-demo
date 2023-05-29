<script setup>
import { ref } from "vue";
import { login } from "../api/login";
import { useRouter } from "vue-router";
defineProps({
  msg: String,
});

const count = ref(0);
let username = ref("");
let password = ref("");
const router = useRouter();
let loginFun = async () => {
  try {
    let data = {
      username: username.value,
      password: password.value,
    };
    let res = await login(data);
    console.log("res.data ============> ", res.data);
    if (res.code == 200) {
      router.push({
        path: "/about",
      });
    }
  } catch (error) {}
};
</script>

<template>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
  <div>账号：<input type="text" v-model="username" /></div>
  <div>密码：<input type="text" v-model="password" /></div>
  <div @click="loginFun">登录</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
