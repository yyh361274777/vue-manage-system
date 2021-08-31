<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>采词推荐系统
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="create_task.country" placeholder="国家" class="handle-select2 mr10">
          <el-option v-for="(item) in country_list" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-select v-model="create_task.mode" placeholder="模式" class="handle-select mr10">
          <el-option v-for="(modekey) in modeobj" :key="modekey" :label="modeobj[modekey]" :value="modekey"></el-option>
        </el-select>
        <el-input v-model="create_task.keyword" placeholder="关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-lx-add" @click="createTask" class="mr10">新建任务</el-button>
        <el-input v-model="query.batch_id_or_keyword" placeholder="batch_id或关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="mr10">查询</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <!--        <el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column :prop="modeobj.mode" align="center" width="200" label="任务模式">
          <template #default="scope">
            {{ modeobj[scope.row.mode] }}
          </template>
        </el-table-column>
        <el-table-column prop="status_text" width="320" align="center" label="状态"></el-table-column>
        <el-table-column label="搜索词" align="center">
          <template #default="scope">
            <a :href="'http://www.amazon.com/s?k='+scope.row.keyword" target="_blank">{{ scope.row.keyword }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" width="170" align="center" label="创建时间"></el-table-column>
        <!--        <el-table-column prop="update_time" width="170" align="center" label="更新时间"></el-table-column>-->
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-lx-down"
                @click="downloadExcel(scope.$index, scope.row)"
            >下载结果
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.pageSize"
            :total="page_total"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import * as echarts from "echarts"
import {AddGroup, addTask, baseUrl, executeSearchRecommendTask, fetchSearchRecommendData} from "../api";

export default {
  name: "basetable",
  data() {
    return {
      page_total: 0,
      modeobj: {
        0: '关键词+类目词+bs',
        1: '单关键词',
        12: '关键词+类目词',
        13: '关键词+bs',
      },
      modeoReverseObj: {
        '关键词+类目词+bs': 0,
        '单关键词': 1,
        '关键词+类目词': 12,
        '关键词+bs': 13,
      },
      country_list: [
        'US',
        // 'CA',
        // 'MX',
        // 'AU',
        // 'JP',
        // 'UK',
        // 'FR',
        // 'DE',
        // 'IT',
        // 'ES',
        // 'NL',
        // 'SE',
      ],
      create_task: {
        country: 'US',
        keyword: '',
        mode: '',
      },
      query: {
        batch_id_or_keyword: '',

        page: 1,
        pageSize: 10,
      },
      tableData: [
        {
          mode: 0,
          keyword: 'gloves',
          status: '类目名搜索页与bs页产生的详情页任务正在执行',
          create_time: '2021-06-24 11:55:58',
          update_time: '2021-06-24 13:30:32',
        }
      ]
    };
  },
  mounted() {
    // 请求最新的十条任务列表信息
    this.getData()
  },
  created() {
  },
  methods: {
    handlePageChange(page){
      this.query.page = page
      this.getData()
    },
    createTask(){
      if (!this.create_task.mode){
        this.$message.error('请选择采集模式');
        return
      }
      if (!this.create_task.keyword){
        this.$message.error('关键词为空');
        return
      }
      let group_name = "srt-" + this.create_task.keyword
      AddGroup({group_name:group_name}).then(res => {
        let group_id = res.data.group_id;
        addTask({group_id:group_id, keyword_list:[this.create_task.keyword]}).then(res => {
          if (res.status==1){
            // 执行任务
            executeSearchRecommendTask({country:this.create_task.country ,keyword_recommend:'1', group_id:group_id, mode:this.modeoReverseObj[this.create_task.mode]}).then(res => {
              this.$message.success(res.msg);
              this.getData()
            });
          }
        });
      });

    },
    handleSearch() {
      this.getData()
    },
    // 获取任务数据
    getData() {
      fetchSearchRecommendData(this.query).then(res => {
        this.tableData = res.data;
        this.page_total = res.page_total;
      });
    },
    downloadExcel(temp, row) {
      if (row.status == 10) {
        window.location = baseUrl + '/search/get_recommend_result_excel?batch_id=' + row.batch_id
      } else {
            this.$message.error('任务未执行完毕!');
      }
    }
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.handle-select2 {
  width: 80px;
}

.handle-input {
  width: 270px;
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
