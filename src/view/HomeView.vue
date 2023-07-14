<script setup>
import { ref, getCurrentInstance } from "vue";
import { login } from "../api/login";
import { useRouter } from "vue-router";
import {
  Line,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "vue-chartjs";
import TimeInput from "../components/time.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
defineProps({
  msg: String,
});

const count = ref(0);
let username = ref("meixu");
let password = ref("Aa123456");
const router = useRouter();
const { proxy } = getCurrentInstance();
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
      router.push({
        path: "/roomList",
        query: {
          token: res.data.token,
          userName: username.value,
        },
      });
    }
  } catch (error) {}
};
let day = ref(0);
let inputChange = (event) => {
  day.value = event;
  console.log("event =============> ", event);
};

let chartData = ref({
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Max",
  ],
  datasets: [
    {
      label: "",
      data: [65, 59, 80, 81, 56, 55, 40, 120],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.3,
    },
  ],
});

let chartOptions = ref({
  responsive: true,
  events: [],
});

let chartRef = ref(null);
let onClick = (event) => {
  console.log(
    "chartRef =========> ",
    getDatasetAtEvent(chartRef.value.chart, event),
    getElementAtEvent(chartRef.value.chart, event),
    getElementsAtEvent(chartRef.value.chart, event)
  );
};
</script>

<template>
  <div>账号：<el-input type="text" v-model="username" /></div>
  <div>密码：<el-input type="text" v-model="password" /></div>
  <el-button type="primary" round @click="loginFun">登录</el-button>
  <time-input @change="inputChange"></time-input>

  <Line
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    ref="chartRef"
    @click="onClick"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
