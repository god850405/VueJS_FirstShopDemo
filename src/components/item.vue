<!---------------  商品描述  -------------------->
<template>
  <div class="container-fluid" >
    <!---------------  上方目錄  -------------------->
    <b-breadcrumb style="margin-top:20px;">
      <b-breadcrumb-item>
        <router-link to="/" >
          <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
            所有商品
        </router-link>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>商品詳細資訊</b-breadcrumb-item>
    </b-breadcrumb>
      <div class="item">
        <!---------------  商品描述區域  左半部-------------------->
        <div class="item-left">
          <b-carousel
            id="carousel"
            controls
            indicators
            no-hover-pause
          >
            <b-carousel-slide
              v-for="(image,index) in images"
              :key="index"
            >
              <template v-slot:img>
                <img
                class="carousel-image"
                :src="image.imagesrc"
                alt="image slot">
              </template>
            </b-carousel-slide>
          </b-carousel>
        </div>
        <!---------------  商品描述區域 右半部  -------------------->
        <div class="item-right">
          <div class="info">
            <b-row class="info-row" cols="2">
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品編號</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">{{items.productno}}</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品名稱</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">{{items.producttitle}}</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品售價</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6"><a style="color:red;">${{items.productprice}}</a></b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品規格</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">
                <b-form-select
                  v-model="specificationselected"
                  size="sm"
                  v-bind:change="specificationChange()"
                  style="width:10vh;"
                  class="mt-3">
                  <b-form-select-option  :value="s.itemspecification" v-for="(s,i) in specification" :key=i>
                    {{s.itemspecification}}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品尺寸</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">
                <b-form-select
                  v-model="measurementselected"
                  size="sm"
                  style="width:10vh;"
                  class="mt-3">
                  <b-form-select-option :value="m.itemmeasurement" v-for="(m,j) in measurement" :key=j>
                    {{m.itemmeasurement}}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">商品數量</b-col>
              <b-col class="info-col"  cols-sm="2" cols-md="4" cols-lg="6">
                <b-form-spinbutton
                  id="sb-inline"
                  v-model="quantity"
                  min="1" max="100"
                  size="sm">
                </b-form-spinbutton>
                </b-col>
            </b-row>
            <hr>
            <center>
              <b-button  style="width:200px;" v-on:click="cartClicked">加入購物車</b-button>
            </center>
          </div>

        </div>
      </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      // ---routere接收的參數(productno)------
      productNo:this.$route.params.id,
      items:'',
      // -------------productno 包含的 Item
      images:[], // productno 包含的 Image
      specificationselected: null,  // 規格 selected
      specification: [], // Item 規格
      measurementselected: null, // 尺寸 selected
      measurement: [], // Item 尺寸
      quantity:1, // 數量
    }
  },mounted(){
    //  撈 productno 的資料
    this.$http.get(process.env.VUE_APP_API+`/Product/GetProduct?no=${this.productNo}`)
      .then(response => {
        console.log(response.data)
        this.items = response.data[0]
      });
    //  撈  ProductNo裡所有Item 的 Image 圖片
    this.$http.get(process.env.VUE_APP_API+`/Product/GetProductImage?no=${this.productNo}`)
      .then(response => {
        this.images = response.data;
      });
    //  撈 ProductNo裡所有Item的規格資料
    this.$http.get(process.env.VUE_APP_API+`/Product/GetItemSpecification?no=${this.productNo}`)
      .then(response => {
        this.specification = response.data;
      });
  },computed:{

  },methods:{
     //  選擇規格後 顯示 Item 裡相對應的尺寸資料
    specificationChange(){
      if(this.productNo!=null&this.specificationselected!=null){
        this.$http.get(process.env.VUE_APP_API+`/Product/GetItemMeasurement?no=${this.productNo}&specification=${this.specificationselected}`)
        .then(response => {
          this.measurement = response.data;
        });
      }
    },
    cartClicked(){
      if(this.$store.state.items.some(item => item.productno === this.items.productno)){
            var i = this.$store.state.items.findIndex(x => x.productno === this.items.productno);
            this.$store.commit("cartDelete",i)
      }else{
        this.$store.commit({
            type:"cartInsert",
            productno: this.items.productno,
            producttitle:this.items.producttitle,
            productprice:this.items.productprice,
            ProductQantity:this.quantity,
            productspecification:this.specificationselected,
            productmeasurement:this.measurementselected
        })
      }
    },
  }
}
</script>
<style>
.item{
  padding: 20px;
  max-height: 100%;
  max-width: 100%;
  margin:auto;
  height:inherit; /*自動填滿瀏覽器高度*/
  display: flex;
}
.item-left{
    width: 50%; /*第二層flex--nav固定寬度*/
    height: 600px;
}
#carousel{
  width: 100%;
  height: 100%;
  max-width:  100%;
  display:  flex;
  align-items: center;
  justify-content:  center;
  overflow: hidden;
  padding:30px;

}
.carousel-image{
  max-width: 100%;
  max-height: 100%;
}

.item-right{
  margin-top: 50px;
  padding:10px;
  flex: 1;
  display:  flex;
  align-items: center;
  justify-content:  center;
}
.item-right .info{
  height: 100%;
  width: 100%;
}

.item-right .info .info-col{
  padding:10px;
  font-size: 1em;
  font-weight: bold;
  display:  flex;
  align-items: center;
  justify-content:  center;
}

</style>
