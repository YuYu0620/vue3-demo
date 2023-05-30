<template>
  <div>
    <el-input v-model="day" @change="inputChange"></el-input>
  </div>
</template>
<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  day: {
    type: Number,
    default: 0,
  },
});
let day = ref(props.day);
const emits = defineEmits(["change"]);
let inputChange = (event) => {
  day.value = event;
  emits("change", event);
};
</script>