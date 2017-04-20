var store = {
	
	
	/**
	 * 获取商品分类信息
	 */
	getGoodsClass:function(classId,callback){
		var classId = classId || 0;
		var request = new httpRequest();
		request.addData('id',classId);
		request.get('store_cate', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取用户微店数据信息
	 */
	getUSInfo:function(callback){
		var open_id = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('store_info', function(res) {
			callback(res);
		});
	},

	
	/**
	 * 获取推荐商品
	 */
	getRecommend:function(callback){
		var request = new httpRequest();
		request.get('store_adv', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取店铺列表
	 */
	getShopList:function(restInfo,callback){
		restInfo.page = restInfo.page ||'';
		restInfo.shop_id = restInfo.shop_id ||'';
		var request = new httpRequest();
		request.addData('page',restInfo.page);
		request.get('store_shop/' + restInfo.shop_id, function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取微店商品列表
	 */
	getGoodsList:function(restInfo,callback){
		restInfo.cateId = restInfo.cateId ||'';
		restInfo.order = restInfo.order ||'';
		restInfo.shop_id = restInfo.shop_id ||'';
		restInfo.page = restInfo.page ||'';
		var request = new httpRequest();
		request.addData('cate',restInfo.cateId);
		request.addData('order',restInfo.order);
		request.addData('page',restInfo.page);
		request.addData('shop_id',restInfo.shop_id)
		request.get('store_goods', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取商品详细信息
	 */
	getGoodsInfo:function(goodsId,callback){
		var open_id = app.getState().open_id || '';
		goodsId = goodsId ||'';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('store_goods/' + goodsId, function(res) {
			callback(res);
		},false);
	},
	
	
	/**
	 * 获取商品买家评论
	 */
	getGoodsComment:function(restInfo,callback){
		restInfo.goodsId = restInfo.goodsId ||'';
		restInfo.page = restInfo.page ||'';
		var request = new httpRequest();
		request.addData('id',restInfo.goodsId);
		request.addData('page',restInfo.page);
		request.get('store_response', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 收藏商品
	 */
	collect:function(goodsId,callback){
		var open_id = app.getState().open_id || '';
		goodsId = goodsId ||'';
		var request = new httpRequest();
		request.addData('id',goodsId);
		request.addData('open_id',open_id);
		request.post('store_fav', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 收藏商品列表
	 */
	myFavGoods:function(callback){
		var open_id = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('store_fav', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 取消收藏商品
	 */
	unCollect:function(goodsId,callback){
		var open_id = app.getState().open_id || '';
		goodsId = goodsId ||'';
		var request = new httpRequest();
		request.addData('id',goodsId);
		request.addData('open_id',open_id);
		request.delete('store_end', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 购物车
	 */
	handleCar:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo.goodsId = restInfo.goodsId ||'';
		restInfo.method = restInfo.method ||'';
		restInfo.page = restInfo.page ||'';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('page',restInfo.page);
		if(restInfo.method == 'get'){
			request.get('store_car', function(res) {
				callback(res);
			});
		}else if(restInfo.method == 'post'){
			request.addData('goods_id',restInfo.goodsId);
			request.post('store_car', function(res) {
				callback(res);
			});
		}else{
			request.addData('goods_id',restInfo.goodsId);
			request.delete('store_car', function(res) {
				callback(res);
			});
		}
		
	},
	
	
	/**
	 * 获取订单详情
	 */
	getOrderDetail:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo = restInfo || '';
		restInfo.orderId = restInfo.orderId || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('order_id',restInfo.orderId);
		request.get('store_order_detail', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 确认订单
	 */
	forOrder:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo.r_pos = restInfo.r_pos ||'';
		restInfo.r_code = restInfo.r_code ||'';
		restInfo.r_phone = restInfo.r_phone ||'';
		restInfo.r_name = restInfo.r_name ||'';
		var request = new httpRequest();
		request.addData('trans_id',restInfo.trans_id);
		request.addData('goods_id',restInfo.goods_id);
		request.addData('count',restInfo.count);
		request.addData('open_id',open_id);
		request.post('store_pay', function(res) {
			callback(res);
		});
	},

	/**
	 * 获取订单列表
	 */
	getOrderList:function(orderInfo,callback){
		var open_id = app.getState().open_id || '';
		orderInfo = orderInfo || '';
		orderInfo.page = orderInfo.page || '';
		orderInfo.condition = orderInfo.condition || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('condition',orderInfo.condition);
		request.addData('page',orderInfo.page);
		request.get('store_order', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 取消订单
	 */
	cancelOrder:function(order_id,callback){
		var open_id = app.getState().open_id || '';
		order_id = order_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',order_id);
		request.put('store_order',function(res){
			callback(res);
		})
	},
	
	/**
	 * 发送评论
	 */
	sendComment:function(sendInfo,callback){
		var open_id = app.getState().open_id || '';
		sendInfo.id = sendInfo.id || '';
		sendInfo.response = sendInfo.response || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',sendInfo.id);
		request.addData('content',sendInfo.content);
		request.addData('response',sendInfo.response);
		request.put('store_response',function(res){
			callback(res);
		})
	},
	
	/**
	 * 确认收货
	 */
	confirmOrder:function(id,callback){
		var open_id = app.getState().open_id || '';
		id = id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',id);
		request.post('store_confirm',function(res){
			callback(res);
		})
	},
	
	
	/**
	 * 商品搜索功能
	 */
	searchGoods:function(strKey,callback){
		strKey = strKey || '';
		var request = new httpRequest();
		request.addData('key',strKey);
		request.get('store_search',function(res){
			callback(res);
		})
	},
	
	
	/**
	 * 获取收货地址列表数据
	 */
	getTransList:function(callback){
		var open_id = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('store_trans_list',function(res){
			callback(res);
		})
	},
	
	
	/**
	 * 创建/修改收货地址
	 */
	setTrans:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo.phone = restInfo.phone||'';
		restInfo.zip_code = restInfo.zip_code||'';
		restInfo.contact = restInfo.contact||'';
		restInfo.address = restInfo.address||'';
		restInfo.is_default = restInfo.is_default||'';
		restInfo.trans_id = restInfo.trans_id||'';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',restInfo.trans_id);
		request.addData('phone',restInfo.phone);
		request.addData('zip_code',restInfo.zip_code);
		request.addData('contact',restInfo.contact);
		request.addData('address',restInfo.address);
		request.addData('is_default',restInfo.is_default);
		request.post('store_cfg_trans',function(res){
			callback(res);
		})
	},
	
	
	/**
	 *删除收货地址
	 */
	delTrans:function(transId,callback){
		var open_id = app.getState().open_id || '';
		transId = transId ||'';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',transId);
		request.delete('store_del_trans',function(res){
			callback(res);
		})
	},
}
