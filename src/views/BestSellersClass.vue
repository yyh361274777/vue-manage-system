<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>类目操作
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
            type="primary"
            icon="el-icon-lx-add"
            class="handle-del mr10"
            @click="addAllSelection"
        >添加至分组
        </el-button>
        <el-select v-model="add.group_id" placeholder="分组" class="handle-select mr10">
          <el-option v-for="(item) in group_list" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
        </el-select>
        <el-input v-model="query.keyword" placeholder="搜索词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="mr10">搜索</el-button>
        <el-input v-model="new_group_name" placeholder="分组名" class="handle-group-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAddGroup">新建分组</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="65" align="center"></el-table-column>
        <el-table-column prop="class_level" align="center" width="80" label="类目等级"></el-table-column>
        <el-table-column prop="class_name" min-width="30%" label="类目名"></el-table-column>
        <el-table-column label="类目导航">
          <template #default="scope">
            <a :href="scope.row.class_url" target="_blank">{{ scope.row.navigate }}</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="类目名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {AddGroup, addTask, fetchBestSellersData, fetchBestSellersGroupData} from "../api/index";

export default {
  name: "basetable",
  data() {
    return {
      new_group_name: "",
      query: {
        keyword: "",
        pageIndex: 1,
        pageSize: 99999
      },
      add: {},
      tableData: [],
      multipleSelection: [],
      group_list: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.handleSearch();
  },
  methods: {
    // 获取分组数据
    getData() {
      fetchBestSellersGroupData({}).then(res => {
        this.group_list = res.data;
      });
      // 获取所有分组
    },
    // 新建分组按钮
    handleAddGroup(){
      const data = new FormData();
      data.append('group_name', this.new_group_name)
      AddGroup(data).then(res => {
        if (res.status===1){
          this.$message.success(res.msg);
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSearch() {
      fetchBestSellersData(this.query).then(res => {
        this.tableData = res.data;
        this.pageTotal = res.data.length;
      });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addAllSelection() {
      const length = this.multipleSelection.length;
      if (!this.add.group_id){
        this.$message.error(`未选择任何分组`);
        return
      }
      if (length===0){
        this.$message.error(`未选择任何类目`);
        return
      }
      // 二次确认添加
      this.$confirm(`确定要添加这${length}条吗？`, "提示", {
        type: "warning"
      })
          .then(() => {
            let class_ids = [];
            for (let i = 0; i < length; i++) {
              class_ids.push(this.multipleSelection[i].id);
            }
            const data = {
              group_id: this.add.group_id,
              class_ids: class_ids
            };
            addTask(data).then((res)=>{
              this.$message.success(res.msg);
            })
          })
          .catch(() => {
          });

    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑 git test
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
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
