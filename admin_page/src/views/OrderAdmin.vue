<template>
<div id="orderadmin">

  <div class="OrderNumStatus">
    <el-badge :value="order_status_0.length" class="item">
      已下单数量
    </el-badge>
    <el-badge :value="order_status_1.length" class="item">
      预处理数量
    </el-badge>
    <el-badge :value="order_status_2.length" class="item">
      待结账数量
    </el-badge>
    <el-badge :value="order_status_3.length" class="item">
      总订单数量
    </el-badge>
  </div>
  <el-tabs type="border-card">
    <el-tab-pane label="已下单">
      <el-table
        ref="order_status_0"
        :data="order_status_0"
        tooltip-effect="dark"
        style="width: 100%"
        height="400px"
        @selection-change="handleSelection_status_0_Change">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="200">
          <template slot-scope="scope">{{ DateFormat(scope.row.no) }}</template>
        </el-table-column>
        <el-table-column
          label="订单号"
          width="120">
          <template slot-scope="scope">{{ scope.row.no }}</template>
        </el-table-column>
        <el-table-column
          prop="desk"
          label="桌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总价"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content[0].name"
          label="订单"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          type="expand"
          label="详细订单"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item class="details" label="详细订单">
                <div  v-for="(item,index) in props.row.content" :key="index">
                  <el-image :src="getPicAddr(item.pic)"></el-image>
                  <span>名称:{{item.name}}   </span>
                  <span>单价:{{item.price}}   </span>
                  <span>数量:{{item.num}}     </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="SelectionAll(0)">订单全选</el-button>
        <el-button @click="ReSelectionAll(0)">取消全选</el-button>
        <el-button @click="delSelectOrder(0)">作废订单</el-button>
        <el-button @click="WorkOrder(0)">确认订单</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="未结账">
      <el-table
        ref="order_status_1"
        :data="order_status_1"
        tooltip-effect="dark"
        style="width: 100%"
        height="400px"
        @selection-change="handleSelection_status_1_Change">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="200">
          <template slot-scope="scope">{{ DateFormat(scope.row.no) }}</template>
        </el-table-column>
        <el-table-column
          label="订单号"
          width="120">
          <template slot-scope="scope">{{ scope.row.no }}</template>
        </el-table-column>
        <el-table-column
          prop="desk"
          label="桌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总价"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content[0].name"
          label="订单"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          type="expand"
          label="详细订单"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item  class="details" label="详细订单">
                <div v-for="(item,index) in props.row.content" :key="index">
                  <el-image :src="getPicAddr(item.pic)"></el-image>
                  <span>名称:{{item.title}}   </span>
                  <span>单价:{{item.price}}   </span>
                  <span>数量:{{item.num}}     </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="SelectionAll(1)">订单全选</el-button>
        <el-button @click="ReSelectionAll(1)">取消全选</el-button>
        <el-button @click="delSelectOrder(1)">作废订单</el-button>
        <el-button @click="WorkOrder(1)">确认订单</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="已结账">
      <el-table
        ref="order_status_2"
        :data="order_status_2"
        tooltip-effect="dark"
        style="width: 100%"
        height="400px"
        @selection-change="handleSelection_status_2_Change">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="200">
          <template slot-scope="scope">{{ DateFormat(scope.row.no) }}</template>
        </el-table-column>
        <el-table-column
          label="订单号"
          width="120">
          <template slot-scope="scope">{{ scope.row.no }}</template>
        </el-table-column>
        <el-table-column
          prop="desk"
          label="桌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总价"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content[0].name"
          label="订单"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          type="expand"
          label="详细订单"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item class="details" label="详细订单">
                <div  v-for="(item,index) in props.row.content" :key="index">
                  <el-image :src="getPicAddr(item.pic)"></el-image>
                  <span>名称:{{item.title}}   </span>
                  <span>单价:{{item.price}}   </span>
                  <span>数量:{{item.num}}     </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="SelectionAll(2)">订单全选</el-button>
        <el-button @click="ReSelectionAll(2)">取消全选</el-button>
        <el-button @click="delSelectOrder(2)">作废订单</el-button>
        <el-button @click="WorkOrder(2)">确认订单</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="总订单">
      <el-table
        ref="order_status_3"
        :data="order_status_3"
        tooltip-effect="dark"
        style="width: 100%"
        height="400px"
        @selection-change="handleSelection_status_3_Change">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="200">
          <template slot-scope="scope">{{ DateFormat(scope.row.no) }}</template>
        </el-table-column>
        <el-table-column
          label="订单号"
          width="120">
          <template slot-scope="scope">{{ scope.row.no }}</template>
        </el-table-column>
        <el-table-column
          prop="desk"
          label="桌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总价"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content[0].name"
          label="订单"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          type="expand"
          label="详细订单"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item class="details" label="详细订单">
                <div v-for="(item,index) in props.row.content" :key="index">
                  <el-image :src="getPicAddr(item.pic)"></el-image>
                  <span>名称:{{item.title}}   </span>
                  <span>单价:{{item.price}}   </span>
                  <span>数量:{{item.num}}     </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="SelectionAll(3)">订单全选</el-button>
        <el-button @click="ReSelectionAll(3)">取消全选</el-button>
        <el-button @click="delSelectOrder(3)">作废订单</el-button>
        <el-button @click="WorkOrder(3)">确认订单</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>

</div>
</template>


<script>
import service from "@/service";
import { Message } from 'element-ui';
export default{
  data() {
    return {
      time:null,
      order_status_0:[],
      order_status_1:[],
      order_status_2:[],
      order_status_3:[],
      SelectionOrder_status_0:[],
      SelectionOrder_status_1:[],
      SelectionOrder_status_2:[],
      SelectionOrder_status_3:[]
    }
  },
  mounted(){
    this.getTodayAllOrder()
    this.getAllOrder()
    // setInterval(this.getOrderStatus(),500)
    setInterval(this.getOrderStatus,3000)
  }, 
  methods: {
    getPicAddr(add){
      return 'https://alongz.cn'+add
    },
    getOrderStatus(){
      service.getOrderStatus().then(res=>{
        if(res.msg == "has")
        {
          this.getTodayAllOrder()
          this.getAllOrder()
          this.$message("有新的订单！")
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    Time(date) {
      var year = date.getFullYear()
      var m = date.getMonth()+1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return year + "-" + m + "-" + d + " " + h + ':' + minute + ':' + second
    },
    DateFormat(time){
      return  this.Time(new Date(time*1000))
    },
    getTodayAllOrder(){
      service.getTodayAllOrder().then(res=>{
        this.order_status_0 = res.data.filter(item=>item.status==0)
        this.order_status_1 = res.data.filter(item=>item.status==1)
        this.order_status_2 = res.data.filter(item=>item.status==2)
      })
    },
    getAllOrder(){
      service.getAllOrder().then(res=>{
        this.order_status_3 = res.data
      })
    },
    SelectionAll(no){
      this.$refs['order_status_'+no].toggleAllSelection();
    },
    ReSelectionAll(no){
      this.$refs['order_status_'+no].clearSelection();
    },
    delSelectOrder(no){
      var name = 'SelectionOrder_status_'+no
      service.delOrder(this[name]).then(res=>{
        this.getAllOrder()
        this.getTodayAllOrder()
        Message({
          type:"success",
          message:res.msg,
          iconClass: "el-icon-success",
          duration: 3000,
          showClose: true,
          center: true
        })
      })
    },
    WorkOrder(no){
      var name = 'SelectionOrder_status_'+no
      var data = {
        datas:this[name],
        status:no+1
      }
      service.updateOrederStatus(data).then(res=>{
        Message({
          type:"success",
          message:res.msg,
          iconClass: "el-icon-success",
          duration: 3000,
          showClose: true,
          center: true
        })
        this.getAllOrder()
        this.getTodayAllOrder()
      })
    },
    handleSelection_status_0_Change(val) {
      this.SelectionOrder_status_0 = val;
    },
    handleSelection_status_1_Change(val) {
      this.SelectionOrder_status_1 = val;
    },
    handleSelection_status_2_Change(val) {
      this.SelectionOrder_status_2 = val;
    },
    handleSelection_status_3_Change(val) {
      this.SelectionOrder_status_3 = val;
    }

  }
}
</script>


<style lang="scss" scope>
#orderadmin{
  .orderadmin-model{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .OrderNumStatus{
    height: 70px;
    margin: 10px auto 20px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .OrderNumStatus .item:first-child{
    margin-left:0;
    background-size: 660px 305px; 
    background-position: 0px 0px;
  }
  .OrderNumStatus .item:nth-child(2){
    background-size: 660px 305px; 
    background-position: -220px 0px;
  }
  .OrderNumStatus .item:nth-child(3){
    background-size: 660px 305px; 
    background-position: -440px 0px;
  }
  .OrderNumStatus .item:nth-child(4){
    background-size: 660px 305px; 
    background-position: 0px -152.5px;
  }
  .OrderNumStatus .item{
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: linear;
    transition-delay: 0s;
    padding: 20px 20px;
    margin: 0 20px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    background-image: linear-gradient(to right top, rgb(0, 255, 240), rgb(92, 159, 247) 40%, rgb(211, 34, 255) 80%);
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .OrderNumStatus .item:hover{
    box-shadow: 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%), 0 2px 4px -1px rgb(0 0 0 / 30%);
  }
  .details{
    div>span{
      display: inline-block;
      line-height: 60px;
      margin: 0 5px;
    }
    .el-image{
      width: 60px;
      height: 60px;
      margin: 10px;
      vertical-align: bottom;
    }
  }
}
</style>