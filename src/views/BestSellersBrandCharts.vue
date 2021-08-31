<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-pie-chart"></i> 品牌分析
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-select v-model="mineStatus" placeholder="类目筛选" multiple collapse-tags>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" @change="change" clearable size="small"></el-input>
      <el-option :value="mineStatusValue" style="height: auto">
        <el-tree
            :data="data"
            ref="tree"
            node-key="id"
            :filter-node-method="filterNode"
            :default-checked-keys="default_checked_keys"
            show-checkbox
            @check="handleCheckChange">
        </el-tree>
      </el-option>
    </el-select>
    <el-select v-model="query.group_id" placeholder="分组" class="handle-select mr10" @change="drawLine">
      <el-option v-for="(item) in group_list" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
    </el-select>
    <el-input-number v-model="query.limit" @change="drawLine" :min="1" :max="50" label="限制前多少名（默认20）"></el-input-number>
    <div id="myChart" :style="{width: '1600px', height: '600px'}"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"
import {fetchBestSellersBestBrandData, fetchBestSellersGroupData} from "../api";

export default {
  name: 'hello',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  change() {
    this.$forceUpdate()
  },
  data() {
    return {
      filterText: '',
      data: [{
        id: 0,
        label: '所有类目',
        children: []
      }
      ],
      group_list: [],
      query: {
        limit: 20,
        class_ids: [],
      },
      default_checked_keys: [],
    }
  },
  mounted() {
    this.getData();
    // this.drawLine();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取分组数据
    getData() {
      fetchBestSellersGroupData({}).then(res => {
        this.group_list = res.data;
        if (this.group_list.length > 0) {
          this.query.group_id = this.group_list[0].id
          this.drawLine()
        }
      });
      // 获取所有分组
    },
    // 获取当前所有选择的节点
    handleCheckChange(p1, p2) {
      if (p1.id === 0 && p2.checkedNodes.length === 0) {
        return
      }
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.id)
      })
      let menuArr = this.unique(arr); // 去除重复的节点
      this.query.class_ids = menuArr.join(',')
      this.drawLine()
    },
// 数组去重
    unique(arr) {
      let newArr = []
      let len = arr.length
      for (let i = 0; i < len; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    },
    drawLine() {
      // 请求数据
      fetchBestSellersBestBrandData(this.query).then(res => {
        this.brand_data = res.data;
        this.default_checked_keys = res.default_checked_keys;
        this.data[0].children = res.start_list;
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        let temp;
        temp = this.query.group_id ? this.group_list.find(ele => ele.id === this.query.group_id).group_name : ''
        myChart.setOption({
          title: {
            text: temp + '分组监控数据-监控类目品牌数量占比前' + this.query.limit,
            subtext: '数据更新于 ' + res.update_time,
            left: 'center'
          },
          tooltip: {  //提示框组件
            trigger: 'item',              //触发类型,'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
            // triggerOn: "mousemove",           //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
            // showContent: true,              //是否显示提示框浮层
            // alwaysShowContent: true,           //是否永远显示提示框内容
            // showDelay: 0,                 //浮层显示的延迟，单位为 ms
            // hideDelay: 100,                //浮层隐藏的延迟，单位为 ms
            // enterable: false,               //鼠标是否可进入提示框浮层中
            // confine: false,                //是否将 tooltip 框限制在图表的区域内
            // transitionDuration: 0.4,           //提示框浮层的移动动画过渡时间，单位是 s,设置为 0 的时候会紧跟着鼠标移动
            // position: ['50%', '50%'],          //提示框浮层的位置，默认不设置时位置会跟随鼠标的位置,[10, 10],回掉函数，inside鼠标所在图形的内部中心位置，top、left、bottom、right鼠标所在图形上侧，左侧，下侧，右侧，
            formatter: function(data){
              // console.log(data)
              return data.seriesName + '<br/>' + data.marker + data.data.name + ' <b>' + data.data.value + '</b>'
                  + '<br/>' + '预计月销售量合计 ' + data.data.sum_estimatedSales + '单'
                  + '<br/>' + '预计月销售额合计 ' + data.data.sum_estRevenue + '$'
            },   //提示框浮层内容格式器，支持字符串模板和回调函数两种形式,模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等
            // backgroundColor: "transparent",      //标题背景色
            // borderColor: "#ccc",            //边框颜色
            // borderWidth: 0,               //边框线宽
            // padding: 5,                 //图例内边距，单位px 5 [5, 10] [5,10,5,10]
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '品牌产品数量占比',
              type: 'pie',
              radius: '50%',
              data: this.brand_data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      });
    }
  }
}
</script>

<style scoped>
.schart-box {
  display: inline-block;
  margin: 20px;
}

.schart {
  width: 600px;
  height: 400px;
}

.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>