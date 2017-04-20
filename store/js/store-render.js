/*商品列表模板*/
var goods_list_render = function(goodsInfo){
	var rander = template.compile(goods_li);
	var html = rander(goodsInfo);
	return html;
}
var goods_li = '<img onload="load(this)" src="../../images/store.png" style="border: solid 1px #eee" class="store-list-img mui-pull-left" data-src="{{goods_icon.thumb}}">'+
'<div class="mui-media-body"><div class="mui-ellipsis-2">{{title}}</div>'+
'<p class="goods-price">¥{{price}}</p><div class="item-bottom"><span>销量：{{sell}}</span>'+
'<span style="float: right;">好评{{res_count}}%</span></div></div>';

/*购物车列表模板*/
var car_list_render = function(goodsInfo){
	var rander = template.compile(car_goods_li);
	var html = rander(goodsInfo);
	return html;
}
var car_goods_li = '<div style="padding: 0px;" class="mui-table-view mui-grid-view"><div style="padding: 5px;" class="mui-table-view-cell mui-col-xs-3">'+
'<div id=""><img onload="load(this)" src="../../images/store.png" data-src="{{goods_detail.goods_icon.thumb}}"></div></div><div class="mui-text-left mui-table-view-cell mui-col-xs-8">'+
'<div style="font-size: 15px;" class="goods-title mui-ellipsis-2">{{goods_detail.title}}</div><p class="goods-price">¥{{goods_detail.price}}</p>'+
'<div id="{{goods_detail.price}}" class="num-box"><button class="mui-btn reduce-btn" type="button">-</button><input class="item-input" type="number" value="{{count}}"/>'+
'<button class="mui-btn add-btn" type="button">+</button></div></div><div class="mui-table-view-cell mui-col-xs-1"><div class="mui-checkbox">'+
'<input style="position: relative;" class="item-check" name="checkbox1" value="1" type="checkbox" checked><div class="check-view"></div></div></div></div>'

var order_list_render = function(goodsInfo,type){
	var rander = template.compile(type);
	var html = rander(goodsInfo);
	return html;
}

var order = '<div class="order-store-title" id="{{id}}">'+
							'<span>{{id}}</span>'+
							'<span style="float: right;">{{if condition == 0}}未付款{{/if}}'+
							'{{if condition == 1}}已付款{{/if}}'+
							'{{if condition == 2}}已发货{{/if}}'+
							'{{if condition == 3}}已完成'+
							'{{/if}}</span>'+
						'</div>'+
						'{{each items as value i}}'+
						'<div class="order-store-body" >'+
        					'<div style="padding:5px;position:relative">'+
								'<img onload="load(this)" src="../../images/store.png" data-src="{{items[i].good.goods_icon.thumb}}" class="order-store-img"/>'+
								'<p style="height:100px;width: 80%;display: inline;">{{items[i].good.title}}</p>'+  
								'<span style="float:right;font-size:13px">￥ {{items[i].h_price}}</span>'+
								'</br><span style="float:right;font-size:13px;color:#909096">x{{items[i].count}}</span>'+
							'</div>'+	
						'</div>'+
						'{{/each}}'+
						'<div class="order-store-bottom">'+
							'<span>共{{total_count}}件商品</span>&nbsp;&nbsp;&nbsp;'+
							'<span>合计：￥{{total_cny}}</span>&nbsp;&nbsp;&nbsp;'+
							'<span>(含运费 0.00)</span> &nbsp;&nbsp;'+
						'</div>'+
						'<div id="{{id}}" class="button">'+
							'<span style="float:right;clear:both;">'+
								'{{if condition == 0}}'+
								'<button id="cancel" class="order-store-btn order-btn">取消订单</button>'+
								'{{/if}}'+
								'{{if condition == 3}}'+
								'<button id="reply" class="order-store-btn order-btn">评论</button>'+
								'{{/if}}'+
							'</span>'+
						'</div>';
						
var order_detail = '<div style="padding:5px;">'+
								'<div class="shop-title">'+
									'<div class="contact">'+
										'<i class="icon-stack"></i>'+
										'<span class="title" style="margin:0px;font-size: 14px;">{{s_user.nickname}}</span>'+
										'{{if condition == 1}}<span class="mui-pull-right" style="margin:0px;font-size: 12px;color: orangered;">等待卖家发货</span>{{/if}}'+
										'{{if condition == 2}}<span class="mui-pull-right" style="margin:0px;font-size: 12px;color: orangered;">卖家已发货</span>{{/if}}'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<ul class="mui-table-view goods-list">'+
							
							'{{each items as value i}}'+
								'<li class="goods mui-table-view-cell mui-media ">'+
									'<img class="mui-pull-left " onload="load(this)" src="../../images/store.png" data-src="{{items[i].good.goods_icon.thumb}}" style="border-radius:10px;height: 90px;width: 90px;margin-right: 0.5em; " />'+
									'<div class="mui-media-body ">'+
										'<p class="mui-ellipsis " style="height: 60px; ">{{items[i].good.title}}</p>'+
										'<div>'+
											'<div class="mui-pull-left " style="color: red; ">'+
												'<span class="price " style="margin-right: 1em; ">￥{{items[i].h_price}}</span>'+
											'</div>'+
											'<div class="mui-pull-right ">'+
												'<span>x</span><span class="count ">{{items[i].count}}</span>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</li>'+
							'{{/each}}'+	
							'</ul>';

var order_button = '<div class="mui-text-right">'+
						'{{if condition == 0}}'+
						'<button id="cancel" class="order-btn">取消订单</button>'+

						'<button id="pay" class="pay-btn order-btn">付款</button>'+
						'{{/if}}'+
						
						'{{if condition == 1}}'+
						'<button id="wait" class="order-btn">等待卖家发货</button>'+

						'{{/if}}'+
						
						'{{if condition == 2}}'+

						'<button id="confirm" class="pay-btn order-btn">确认收货</button>'+
						'{{/if}}'+
						
						'{{if condition == 3}}'+

						'<button id="reply" class="pay-btn order-btn">评价</button>'+
						'{{/if}}'+
				'</div>';
			
var comments = '{{each data as value i}}'+ 
					'<li class="mui-table-view-cell">'+
							'<div id="">'+
								'<span>{{data[i].user.nickname}}</span>'+
								'<span style="color: red;" class="mui-pull-right">{{if data[i].response == 1}}好评{{/if}}{{if data[i].response == 0}}中评{{/if}}{{if data[i].response == -1}}差评{{/if}}</span>'+
							'</p>'+
							'<p>购买于 {{data[i].response_time}}</p>'+
							'<div class="mui-ellipsis-3">'+
								'{{data[i].content}}'+
							'</div>'+
						'</li>'+
				'{{/each}}';
				
/*送货信息列表*/
var trans_list_render = function(transInfo){
	var rander = template.compile(trans);
	var html = rander(transInfo);
	return html;
}
var trans = '<div class="trans-info-view"><div>'+
'<strong>{{contact}}</strong><span class="trans-list-phone">{{phone}}</span></div>'+
'<div class="trans-list-adres">{{address}}</div></div><div class="trans-modify-view">'+
'<i style="font-size: 35px;" class="mui-icon mui-icon-compose"></i></div>';
