var shop = {
	/**
	 * 积分商城分类列表
	 */
	getShopClass:function(callback){
		callback = callback || mui.noop;
		var request = new httpRequest();
		request.get('shop_cate',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取积分商城列表
	 */
	getShopList:function(listInfo,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		listInfo = listInfo || '';
		listInfo.page = listInfo.page || '';
		listInfo.type_id = listInfo.type_id || '';
		var request = new httpRequest();
		request.addData('page',listInfo.page);
		request.addData('id',listInfo.type_id);
		request.get('shop_goods_list',function(res){
			callback(res);
		});
	},
	
	/**
	 * 兑换商品
	 */
	changeShop:function(changeInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		changeInfo = changeInfo || '';
		changeInfo.page = changeInfo.page || '';
		changeInfo.address = changeInfo.address || '';
		changeInfo.zipcode = changeInfo.zipcode || '';
		changeInfo.name = changeInfo.name || '';
		changeInfo.phone = changeInfo.phone || '';
		changeInfo.id = changeInfo.id || '';
		if (open_id == ''){
			var res = {};
			res.info = '请先登入'
			return callback(res);
		}
		if (changeInfo.name == '') {
			var res = {};
            res.info = '姓名不能为空';
			return callback(res);
        }
		
		var patterns = new Object();
        patterns.Phone = /^(1[3|4|5|7|8])[0-9]{9}$/;
        if (!patterns.Phone.test(changeInfo.phone)) {
        	var res = {};
        	res.info = '请输入正确的手机';
            return callback(res);
        }

        patterns.Zipcode = /^[0-9]{6}$/;
        if (!patterns.Zipcode.test(changeInfo.zipcode)) {
        	var res = {};
        	res.info = '请输入正确的邮政编码';
            return callback(res);
        }
        
        if (changeInfo.address == '') {
            return callback('收货地址不能为空');
        }
        
		var request = new httpRequest();
		request.addData('open_id',open_id); 
		request.addData('address',changeInfo.address);
		request.addData('zipcode',changeInfo.zipcode);
		request.addData('name',changeInfo.name);
		request.addData('phone',changeInfo.phone);
		request.addData('id',changeInfo.id);
		request.post('shop_consignee',function(res){
			callback(res);
		})
	},
	
	/**
	 * 我的订单
	 */
	getMyShopList:function(myInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		myInfo = myInfo || '';
		myInfo.page = myInfo.page || '';
		myInfo.type = myInfo.type || '';
		var request = new httpRequest();
		request.addData('page',myInfo.page);
		request.addData('type',myInfo.type);
		request.addData('open_id',open_id);
		request.get('shop_orders',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取回复
	 */
	getComment: function(commentInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		commentInfo = commentInfo || {};
		commentInfo.row_id = commentInfo.row_id || '';
		commentInfo.page = commentInfo.page || '';
		var request = new httpRequest();
		request.addData('page',commentInfo.page);
		request.addData('id',commentInfo.row_id);
		request.get('shop_goods_comment',function(res){
			callback(res);
		})
	},
	
	/**
	 * 发送评论
	 */
	sendComment: function(sendInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		sendInfo = sendInfo || {};
		sendInfo.row_id = sendInfo.row_id || '';
		sendInfo.page = sendInfo.page || '';
		sendInfo.content = sendInfo.content || '';
		open_id = open_id || '';
		var request = new httpRequest();
		request.addData('content',sendInfo.content);
		request.addData('id',sendInfo.row_id);
		request.addData('open_id',open_id);
		request.post('shop_send_comment',function(res){
			callback(res);
		})
	},
	
	/**
	 * 删除评论
	 */
	deleteComment: function(deleteInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		deleteInfo = deleteInfo || {};
		deleteInfo.id = deleteInfo.id || '';
		deleteInfo.row_id = deleteInfo.row_id || '';
		
		if (open_id == ''){
			return callback('请先登录');
		}
		
		var request = new httpRequest();
		request.addData('id',deleteInfo.row_id);
		request.addData('open_id',open_id);
		request.delete('shop_del_comment',function(res){
			callback(res);
		})
	},
}
