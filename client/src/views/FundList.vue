<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="add_data" >
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%"
        max-height="450"
        border
      >
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="date" label="创建时间" width="250" align="center">
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" width="150" align="center"></el-table-column>
        <el-table-column prop="describe" label="收支描述" width="180" align="center"></el-table-column>
        <el-table-column prop="income" label="收入" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="220" align="center"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="320">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="handleEdit( scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="handleDelete(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog :dialog='dialog' @update='getProfile'></Dialog>
  </div>
</template>

<script>
import Dialog from '../components/Dialog';
export default {
  name: "fundList",
  components:{
          Dialog
      },
  data() {
    return {
      tableData: [],
      
      dialog:{
          show:false
      }
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      //获取表格数据
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {},
    handleDetelte(index, row) {},
    handleAdd(){
        this.dialog.show = true;
    }

  }
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
</style>