<template>
<div class="dataanalysis">
  <div class="graph1">
    <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
    日订单成交数量图
    <div id="orderCount" style="width:500px;height:500px">
    </div>
  </div>
  <div id="menuSale" style="width:500px;height:500px">

  </div>
</div>
</template>

<script>
import service from '@/service';
export default{
  data () {
    return {
      orderlist:[],
      classificationData:{},
      num:7
    }
  },
  mounted(){
    this.handleChange();
    this.getclassificationData();
  },
  methods:{
    handleChange(){
       this.getLastOrder(this.num);
    },
    getSeriesData(data){
      var arr = []
      for( let i in data)
      {
        arr.push(data[i].length)
      }
      return arr
    },
    getclassificationData(){
      service.getclassificationData().then(res=>{
        this.classificationData = res.list;
        this.RenderMenuSaleCharts();
      })
    },
    getLastOrder(n){
      service.getLastOrder({no:n}).then(res=>{
        this.orderlist = res.data
        this.RenderOrderCountCharts();
      })
    },
    RenderOrderCountCharts(){
      this.$echarts.init(document.getElementById('orderCount')).setOption(
      {
        tooltip: {},
        xAxis: {
          type: 'category',
          data: Object.keys(this.orderlist)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.getSeriesData(this.orderlist),
          type: 'line',
          showBackground: true,
          backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      });
    },
    RenderMenuSaleCharts(){
      this.$echarts.init(document.getElementById('menuSale')).setOption({
        title: {
            text: '各类别菜数量占比',
            subtext: '来自数据库',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '详细数据',
                type: 'pie',
                radius: '50%',
                data: this.classificationData,
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
    }
  }
}
</script>

 
<style lang="scss" scope>
.dataanalysis{
  display: flex;
  overflow-y: auto;
  justify-content: space-around;
  div{
    flex: 1;
  }
}
</style>