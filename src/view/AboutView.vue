<template>
  <div style="color: #000">数据{{ query.token }}</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
let query = reactive({});
query = route.query;
console.log("query ==========> ", query.token);
</script>