// 初始化
// RongIMClient.init(appkey, [dataAccessProvider]);
// appkey:官网注册的appkey。
// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。

var rongyunIm = {
	
	/**
	 * 获取悟空IM凭证
	 */
	getIMToken:function(callback){
		var open_id = app.getState().open_id || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.get('RYIMToken', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 批量获取用户简单数据
	 */
	getUserInfos:function(userArr,callback){
		userArr = userArr ||'';
		var request = new httpRequest();
		request.addData('id', userArr);
		request.get('user_list', function(res) {
			callback(res);
		});
	},
	
};