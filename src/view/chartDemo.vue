<template>
  <div class="chartDemoPage">
    <div class="screen">
      <el-form :model="form" label-width="120px">
        <el-row>
          <el-form-item label="总数">
            <el-input
              v-model="form.all"
              clearable
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item label="计算方式">
            <el-select
              v-model="form.countWay"
              filterable
              style="width: 240px"
              placeholder=" "
            >
              <el-option
                v-for="item in countWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数据图类型">
            <el-select
              v-model="form.chart"
              filterable
              style="width: 240px"
              placeholder=" "
            >
              <el-option
                v-for="item in chartList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-upload
            class="upload-demo"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
            :before-upload="upload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">点击 或者 <em>拖拽</em>上传表格</div>
            <template #tip>
              <div class="el-upload__tip">点击拖拽上传固定表格</div>
            </template>
          </el-upload>
        </el-row>
        <el-row class="text">
          <div>需要计算的数据</div>
          <!-- <div>
            <el-icon
              style="font-size: 20px; padding: 0px 16px"
              @click="iconClick('remove')"
              ><RemoveFilled
            /></el-icon>
            <el-icon
              style="color: #409eff; font-size: 20px; padding: 0px 16px"
              @click="iconClick('push')"
              ><CirclePlusFilled
            /></el-icon>
          </div> -->
        </el-row>
        <el-row v-for="(item, index) in list" :key="item + '_' + index">
          <el-form-item label="" class="icon">
            <el-checkbox v-model="item.check" size="large" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input
              v-model="item.label"
              clearable
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据">
            <el-input
              v-model="item.data"
              clearable
              style="width: 240px"
              @change="dataChange($event, item)"
            ></el-input>
          </el-form-item>
          <el-form-item label="计算后的数据">
            <el-input
              v-model="item.value"
              clearable
              style="width: 240px"
              disabled
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div v-if="form.chart == 1">
      <div class="title">
        <div
          v-for="(item, index) in list"
          :key="'title_' + index"
          class="itemBox"
        >
          <div class="label">
            {{ item.label }}
          </div>
          <div
            class="colour"
            :style="{
              background: item.colour,
            }"
          ></div>
        </div>
      </div>
      <div class="chartBox">
        <div class="sector">
          <div
            class="father"
            v-for="(item, index) in list"
            :key="'sector_' + index"
            :style="start(index)"
            :title="`${item.label} ${item.value}`"
          >
            <div class="content">
              <div class="container" :style="countAngle(index)"></div>
            </div>
          </div>
          <div class="mark">
            <div
              class="markLine"
              v-for="(item, index) in list"
              :key="'mark_' + index"
              :style="markAngle(index, 'straight')"
            >
              <div class="markText" :style="markAngle(index, 'burden')">
                <span>
                  {{ item.value }}
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="father" style="transform: rotate(0deg)">
          <div class="content">
            <div class="container"></div>
          </div>
        </div> -->
        </div>
      </div>
    </div>
    <div class="bar" v-if="form.chart == 2 && list.length > 0">
      <div
        class="chart"
        :style="{
          height: `${list.length * 50 + 10}px`,
          width: `${list.length * 50 + 50}px`,
        }"
      >
        <div class="y">
          <div
            class="label"
            v-for="(item, index) in list"
            :key="'barLabel_' + index"
            :style="{
              top: `${index * 50}px`,
            }"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="barCanvas">
          <div
            class="value"
            v-for="(item, index) in list"
            :key="'barLabel_' + index"
            :style="{
              top: `${index * 50 + 6}px`,
              width: barWidthCount(item.value),
            }"
          ></div>
          <div class="mask"></div>
        </div>
        <div class="x">
          <div
            class="num"
            v-for="(item, index) in Xaxis"
            :key="'barValue_' + index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="form.chart == 4 && list.length > 0" class="line">
      <div
        class="chart"
        :style="{
          height: `${list.length * 50 + 10}px`,
          width: `${list.length * 50 + 50}px`,
        }"
      >
        <div class="y">
          <div
            class="label"
            v-for="(item, index) in list"
            :key="'lineLabel_' + index"
            :style="{
              top: `${index * 50}px`,
            }"
          >
            {{ item.label }}
          </div>
        </div>
        <canvas
          ref="lineCanvas"
          class="lineCanvas"
          style="
            height: calc(100% - 10px);
            width: calc(100% - 10px);
            margin-top: 10px;
          "
        ></canvas>
        <div class="x">
          <div
            class="value"
            v-for="(item, index) in Xaxis"
            :key="'lineValue_' + index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  data() {
    return {
      form: {
        all: null,
        countWay: 1,
        chart: 2,
      },
      countWayList: [
        {
          label: "百分比",
          value: 1,
        },
      ],
      chartList: [
        {
          label: "饼状图",
          value: 1,
        },
        {
          label: "条形图",
          value: 2,
        },
        {
          label: "柱状图",
          value: 3,
        },
        {
          label: "折线图",
          value: 4,
        },
      ],
      list: [],
    };
  },
  watch: {
    // "form.chart": {
    //   handler(val) {
    //     if (val != 2 && this.list.length == 0) return;
    //     this.canvasStrat();
    //   },
    //   deep: true,
    // },
  },
  computed: {
    Xaxis() {
      let arr = this.list
        .map((item) => item.value.split("%")[0])
        .sort((a, b) => b - a);
      let newArr = [];
      let max = Math.ceil(arr[0]);
      let count = max % 10;
      if (count != 0) {
        max = 10 - (max % 10) + max;
      }
      for (let i = 5; i <= max; i += 5) {
        newArr.push(i);
      }
      console.log("newArr ==========>", newArr);
      return newArr;
    },
  },
  methods: {
    upload(rawFile) {
      this.list = [];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array", encoding: "utf-8" });
        // 假设Excel文件中只有一个工作表
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // 将工作表转换为JSON对象
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // 这里的 array 就是转换后的数组
        console.log(jsonData);
        this.form.all = 0;
        jsonData.forEach((item) => {
          this.form.all += item[1];
        });
        this.list = jsonData.map((item) => {
          return {
            label: item[0],
            data: item[1],
            value: this.count(item[1]),
            check: false,
            colour: this.getRandomHexColor(),
          };
        });
        if (this.form.chart == 4) {
          this.canvasStrat();
        }
      };
      reader.readAsArrayBuffer(rawFile);
      return false;
    },
    count(value) {
      let data = null;
      if (this.form.countWay == 1) {
        data = ((value / this.form.all) * 100).toFixed(2) + "%";
      }
      return data;
    },
    dataChange(value, item) {
      if (this.form.countWay == 1) {
        item.value = ((value / this.form.all) * 100).toFixed(2) + "%";
      }
      this.form.all = 0;
      this.list.forEach((item) => {
        this.form.all += Number(item.data);
      });
    },
    iconClick(type) {
      console.log(123);
      if (type == "push") {
        this.list.push({
          label: "",
          data: "",
          value: "",
          check: false,
          colour: this.getRandomHexColor(),
        });
      } else {
        let arr = this.list.filter((item) => {
          return item.check != true;
        });
        this.list = arr;
      }
    },
    start(index) {
      if (index == 0) return "transform: rotate(0deg)";
      let angle = 0;
      for (let i = 0; i < index; i++) {
        let num = this.list[i].value.split("%")[0];
        angle += (Number(num) / 100) * 360;
      }

      return `transform: rotate(${angle}deg)`;
    },
    countAngle(index) {
      let num = this.list[index].value.split("%")[0];
      let angle = ((Number(num) / 100) * 360).toFixed(3);
      return `transform: rotate(${angle}deg); background-color:${this.list[index].colour};`;
    },
    getRandomHexColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    markAngle(index, type) {
      let num = this.list[index].value.split("%")[0];
      let angle = ((Number(num) / 100) * 180).toFixed(3);

      console.log("angle =======> ", num, angle);
      if (index != 0) {
        for (let i = 0; i < index; i++) {
          num = this.list[i].value.split("%")[0];
          angle = Number(angle) + (Number(num) / 100) * 360;
          console.log(angle);
        }
      }
      return `transform: rotateZ(${type == "burden" ? "-" : ""}${angle}deg);`;
    },

    canvasStrat() {
      this.$nextTick(() => {
        const canvas = this.$refs[`lineCanvas`];
        console.log("canvas =========>", this.$refs);
        const ctx = canvas.getContext("2d");
        this.list.forEach((item, index) => {
          ctx.fillStyle = item.colour;
          ctx.fillRect(
            0,
            index * 24.5,
            this.list.length *
              50 *
              (Number(item.value.split("%")[0]) / 100) *
              ((this.list.length * 50) / 100),
            15
          );
        });
        console.log("ctx =============> ", ctx);
      });
    },

    barWidthCount(value) {
      let num = Number(value.split("%")[0]);
      let proportion = (this.list.length * 50 + 50) / 100;
      let width = ((this.list.length * 50 * num) / 100) * proportion;
      return `${width}px`;
    },
  },
};
</script>

<style lang="less" scoped>
.chartDemoPage {
  width: 100%;
  height: 100vh;
  padding: 20px;
  .screen {
    box-sizing: border-box;
    border-bottom: 1px solid #c5c5c5;
    .text {
      padding: 36px 70px;
      color: #606266;
      font-size: 15px;
      div {
        flex: 1;
      }
    }
    :deep(.icon) {
      .el-form-item__content {
        margin-left: 40px !important;
      }
    }
    .upload-demo {
      width: 100%;
    }
  }
  .title {
    display: flex;
    justify-content: center;
    padding: 16px;
    font-size: 14px;
    color: #606266;
    box-sizing: border-box;
    .itemBox {
      display: flex;
      padding: 0px 10px;
      align-items: center;
      .label {
        margin-right: 8px;
      }
      .colour {
        width: 15px;
        height: 10px;
        border: 1px solid #b8b9bb;
      }
    }
  }
  .chartBox {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;

    .sector {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      z-index: 1;
      .father {
        position: absolute;
        top: 0;
        left: 0;
        height: 200px;
        width: 200px;
        z-index: 2;
        transform: rotate(90deg);
        /* background: lightgoldenrodyellow; */
        .content {
          height: 200px;
          width: 200px;
          /* background: lightcoral; */
          position: absolute;
          z-index: 3;
          clip: rect(-20px, 200px, 200px, 200px);
          animation: mymove 1s;
          animation-fill-mode: forwards;
          .container {
            height: 200px;
            width: 200px;
            background: lightblue;
            position: absolute;
            border-radius: 50%;
            clip: rect(0px, 100px, 200px, 0px);
            transform: rotate(60deg);
            z-index: 4;
          }
        }
      }
      .mark {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0%;
        left: 0%;
        z-index: 5;
        background-color: transparent;
        // animation: markAnimation 1s;
        // animation-delay: 1s;
        // animation-fill-mode: forwards;
        .markLine {
          position: absolute;
          width: 1px;
          height: 100%;
          bottom: 0%;
          left: 50%;
          .markText {
            top: -40px;
            left: 0px;
            position: absolute;
            top: -24px;
            left: -12px;
            font-size: 12px;
            word-break: keep-all;
            border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          }
        }
      }
    }
  }
  .line,
  .bar {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 36px 0px;
    .chart {
      width: 200px;
      min-height: 200px;
      position: relative;
      .y {
        position: absolute;
        top: 5px;
        left: 0;
        width: 1px;
        height: 100%;
        font-size: 14px;
        color: #606266;
        background-color: #606266;
        .label {
          position: absolute;
          word-break: keep-all;
          left: -50px;
          height: 30px;
          top: 0px;
          line-height: 30px;
        }
      }
      .x {
        position: absolute;
        bottom: 0;
        left: -5px;
        height: 1px;
        width: 100%;
        background-color: #606266;
        display: flex;
        font-size: 12px;
        color: #606266;
        padding: 0px 15px;
        box-sizing: border-box;

        .num {
          width: 50px;
          height: 30px;
          padding-top: 5px;
          text-align: right;
          position: relative;
          &::before {
            content: "";
            width: 1px;
            height: 5px;
            position: absolute;
            top: 0;
            right: 3px;
            background-color: #606266;
          }
        }
      }
      .barCanvas {
        position: relative;
        height: 100%;
        width: 100%;
        .value {
          position: absolute;
          left: 1px;
          height: 30px;
          top: 0px;
          width: 0px;
          line-height: 30px;
          background: rgb(248, 161, 177);
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          transition: width 1s;
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 1px;
          background: #fff;
          animation: barCanvasMask 2s;
          animation-fill-mode: forwards;
        }
      }
    }
  }
}

@keyframes mymove {
  form {
    clip: rect(-20px, 200px, 200px, 200px);
  }
  to {
    clip: rect(-20px, 200px, 200px, 102px);
  }
}
@keyframes markAnimation {
  form {
    height: 0%;
  }
  to {
    height: 120%;
  }
}

@keyframes barCanvasMask {
  form {
    left: 1px;
  }
  to {
    left: 100%;
  }
}
</style>