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
          <div>
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
          </div>
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
    <div class="chartBox">
      <div class="sector" id="chartRef">
        <!-- <div
          class="father"
          v-for="(item, index) in list"
          :key="'sector_' + index"
          :style="start(index)"
          :title="`${item.label} ${item.value}`"
        >
          <div class="content">
            <div class="container" :style="countAngle(index)"></div>
          </div>
        </div> -->
        <!-- <div class="father" style="transform: rotate(0deg)">
          <div class="content">
            <div class="container"></div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import Highcharts from "highcharts";
export default {
  name: "chartDemo",
  data() {
    return {
      form: {
        all: null,
        countWay: 1,
      },
      countWayList: [
        {
          label: "百分比",
          value: 1,
        },
      ],
      list: [],
    };
  },
  mounted() {},
  methods: {
    upload(rawFile) {
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
        let series = [
          {
            name: "单位",
            data: [],
          },
        ];
        let categoriesX = [];
        let categoriesY = [];
        this.list = jsonData.map((item) => {
          categoriesX.push(item[0]);
          categoriesY.push(this.count(item[1]) + "%");
          let num = Number(this.count(item[1]));
          series[0].data.push(num);
          return {
            label: item[0],
            data: item[1],
            value: this.count(item[1]) + "%",
            check: false,
          };
        });

        Highcharts.chart("chartRef", {
          chart: {
            type: "bar",
          },
          title: {
            text: "条状图 （%）",
          },
          xAxis: {
            categories: categoriesX,
          },
          yAxis: {
            title: {
              text: "数据图",
            },
          },
          series: series,
        });
        console.log("Highcharts ==========> ", Highcharts);
      };
      reader.readAsArrayBuffer(rawFile);
      return false;
    },
    count(value) {
      let data = null;
      if (this.form.countWay == 1) {
        data = ((value / this.form.all) * 100).toFixed(2);
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
        });
      } else {
        let arr = this.list.filter((item) => {
          return item.check != true;
        });
        this.list = arr;
      }
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
    ::v-deep .icon {
      .el-form-item__content {
        margin-left: 40px !important;
      }
    }
    .upload-demo {
      width: 100%;
    }
  }
  .chartBox {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    // .sector {
    //   position: relative;
    //   width: 200px;
    //   height: 200px;
    //   border-radius: 50%;
    //   background-color: yellow;
    //   overflow: hidden;
    //   .sector-inner {
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     background-color: red;
    //     clip-path: polygon(0% 0%, 50% 50%, 0% 100%, 0% 0%);
    //     // transform: rotate(45deg);
    //   }
    // }
    // .sector {
    //   position: relative;
    //   width: 200px;
    //   height: 200px;
    //   border-radius: 50%;
    //   background-color: yellow;
    //   //   overflow: hidden;
    //   .sector-inner {
    //     width: 50%;
    //     height: 50%;
    //     background-color: red;
    //     transform: rotate(120deg) skew(15deg);
    //   }
    // }
    .sector {
      position: relative;
      width: 400px;
      height: 400px;
      .father {
        position: absolute;
        top: 0;
        left: 0;
        height: 200px;
        width: 200px;
        transform: rotate(90deg);
        /* background: lightgoldenrodyellow; */
        .content {
          overflow: hidden;
          height: 200px;
          width: 200px;
          /* background: lightcoral; */
          position: absolute;
          z-index: 999;
          clip: rect(0px, 200px, 200px, 100px);
          .container {
            height: 200px;
            width: 200px;
            background: lightblue;
            position: absolute;
            border-radius: 50%;
            clip: rect(0px, 100px, 200px, 0);
            transform: rotate(60deg);
          }
        }
      }
    }
  }
}
</style>