<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>销量与评论数
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.country" placeholder="国家" class="handle-select mr10">
          <el-option v-for="(item) in country_list" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input v-model="query.asin_or_sku" placeholder="ASIN或SKU" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="mr10">查询</el-button>
      </div>
      <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"
import {fetchBestSellersGroupData, fetchSalesAndReviews} from "../api/index";
export default {
  name: "basetable",
  data() {
    return {
      query: {
        asin_or_sku: '',
        country: '',
      },
      country_list: [
          'US',
          'CA',
          'MX',
          'AU',
          'JP',
          'UK',
          'FR',
          'DE',
          'IT',
          'ES',
          'NL',
          'SE',
      ]
    };
  },
  mounted(){
    // this.drawLine();
  },
  created() {
  },
  methods: {
    handleSearch() {
      fetchSalesAndReviews(this.query).then(res => {
        let date_list = res.data.date_list
        let sale_order_count_list = res.data.sale_order_count_list
        let sale_order_count_pair_list = res.data.sale_order_count_pair_list
        let review_count_list = res.data.review_count_list
        let review_count_1_list = res.data.review_count_1_list
        let review_count_2_list = res.data.review_count_2_list
        let review_count_3_list = res.data.review_count_3_list
        let review_count_4_list = res.data.review_count_4_list
        let review_count_5_list = res.data.review_count_5_list
        this.drawLine(date_list, sale_order_count_list, sale_order_count_pair_list, review_count_list, review_count_1_list,
            review_count_2_list, review_count_3_list, review_count_4_list, review_count_5_list)
      })
    },
    // 获取产品销量与评论数据
    getData() {
      fetchBestSellersGroupData({}).then(res => {
        this.group_list = res.data;
      });
      // 获取所有分组
    },
    drawLine(
        date_list, sale_order_count_list, sale_order_count_pair_list, review_count_list, review_count_1_list,
        review_count_2_list, review_count_3_list, review_count_4_list, review_count_5_list
    ){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      let option = {
        title: {
          text: this.query.asin_or_sku + '销量与评论数'
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '100%'];
          }
        },
        legend: {
          data: ['评论总数', '销量-包数', '销量-双数', '1星数', '2星数', '3星数', '4星数', '5星数', ],
          selected: {
            '评论总数': true,
            '销量-包数': true,
            '销量-双数': false,
            '1星数': false,
            '2星数': false,
            '3星数': false,
            '4星数': false,
            '5星数': false,
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date_list
        },
        yAxis: [
          {
            //第一个y轴位置在左侧
            position:'left',
            type : 'value',
            name: '销量轴',
          },
          {
            //第二个y轴位置在右侧
            position:'right',
            type : 'value',
            name: '评论数轴',
          },
        ],
        dataZoom: [{
          type: 'inside',
          start: 0,
          // end: 100
        }, {
          start: 0,
          // end: 10
        }],
        series: [
          {
            name: '评论总数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_list
          },
          {
            name: '销量-包数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 0,
            data: sale_order_count_list
          },
          {
            name: '销量-双数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 0,
            data: sale_order_count_pair_list
          },
          {
            name: '1星数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_1_list
          },
          {
            name: '2星数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_2_list
          },
          {
            name: '3星数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_3_list
          },
          {
            name: '4星数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_4_list
          },
          {
            name: '5星数',
            type: 'line',
            stack: '总量',
            smooth: true,  // 圆滑
            yAxisIndex: 1,
            data: review_count_5_list
          }
        ]
      }
      myChart.setOption(option)
    }

  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.handle-group-input {
  width: 150px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
