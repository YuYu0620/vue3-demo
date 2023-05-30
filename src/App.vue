<script setup>
import { getCurrentInstance } from "vue";
import "element-plus/theme-chalk/dark/css-vars.css";
document.querySelector("html").className = ``;
const { proxy } = getCurrentInstance();
</script>

<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
}
</style>
