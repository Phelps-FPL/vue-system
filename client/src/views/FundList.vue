<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="add_data" :model='search_data'>
        <!-- 筛选 -->
        <el-form-item label='按时间筛选:'>
          <el-date-picker
           v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
          ></el-date-picker>
          --
          <el-date-picker
           v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" v-if="user.identity == 'manager'" icon="view" @click="handleAdd()">添加</el-button>
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
               v-if="user.identity == 'manager'"
              @click="handleEdit( scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
               v-if="user.identity == 'manager'"
              @click="handleDelete(scope.$index,scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.page_index"
              :page-sizes="pagination.page_sizes"
              :page-size="pagination.page_size"
              :layout="pagination.layout"
              :total="pagination.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 弹框页面 -->
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundList",
  components: {
    Dialog
  },
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData:[],
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      pagination: {
        page_index: 1, //当前位于页
        total: 0, //总数
        page_size: 8, //一页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" //翻页属性
      },
      //开始和结束事件
      search_data: {
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    this.getProfile();
  },
  computed: {
    user(){
      return this.$store.getters.user;
    }
  },
  methods: {
    getProfile() {
      //获取表格数据
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.allTableData = res.data;
          //过滤数据
          this.filterTableData = res.data;
          //设置分页数据
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    setPaginations() {
      //分页属性设置 总页数
      this.pagination.total = this.allTableData.length;
      this.pagination.page_index = 1;
      this.pagination.page_size = 5;
      //设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.pagination.page_size;
      });
    },
    handleSizeChange(page_size) {
      //切换页数
      this.pagination.page_index = 1;
      this.pagination.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      //获取当前页
      let index = this.pagination.page_size * (page - 1);
      //数据的总数
      let num = this.pagination.page_size * page;
      //容器
      let table = [];

      for (let i = index; i < num; i++) {
        if (this.allTableData[i]) {
          //如果存在数据
          table.push(this.allTableData[i]);
        }
        this.tableData = table;
      }
    },
    handleEdit(index, row) {
      //编辑方法
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
        this.$message("删除成功");
        this.getProfile();
      });
    },
    handleAdd() {
      //添加方法
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.formData = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleSearch(){
      //筛选
      if(!this.search_data.starTime || this.search_data.endTime){
        this.$$message({
          type:'warning',
          message:'请选择时间'
        });
        this.getProfile();
        return;
      }
      const sTmie = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.fliter(item=>{
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      //分页数据
      this.setPaginations();
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
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>