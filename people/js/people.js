var people = {
	
	/**
	 * 获取会员||查找某会员
	 */
	getPeopleList : function (option,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		option.peopleId = option.peopleId || '';
		option.selectId = option.selectId || '';
		option.page = option.page || '';
		var request = new httpRequest();
		request.addData('role',option.peopleId);
		request.addData('keywords',option.selectId);
		request.addData('open_id',open_id);
		request.addData('page',option.page);
		request.get('people_list',function(res){
			callback(res);
		}) 
	},
	
	/**
	 * 获取角色列表
	 */
	getPeopleClass : function(callback){
		callback = callback || mui.noop;
		var request = new httpRequest();
		request.get('people_type',function(res){
			callback(res);
		})
	},
	
	/**
	 * 附件的人
	 */
	getNearPeople : function(placeInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop();
		placeInfo = placeInfo || '';
		placeInfo.lat = placeInfo.lat || '';
		placeInfo.lng = placeInfo.lng || '';
		placeInfo.distance = placeInfo.distance || '';
		if (open_id == ''){
			return callback('请先登录');
		}
		var request = new httpRequest();
		request.addData('lat',placeInfo.lat);
		request.addData('lng',placeInfo.lng);
		request.addData('distance',placeInfo.distance);
		request.addData('open_id',open_id);
		request.addData('page',placeInfo.page);
		request.get('people_near',function(res){
			callback(res);
		})
	},
	
	/**
	 * 清除地址信息
	 */
	clearNearPeople : function(callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop();
		if (open_id == ''){
			return callback('请先登录');
		}
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.put('people_near',function(res){
			callback(res);
		})
	}
	
}
