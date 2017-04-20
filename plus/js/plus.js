var userPlus = {
	
	/**
	 * 网站平台支付
	 */
	orderPay:function(orderId,callback){
		var open_id = app.getState().open_id || '';
		var orderId = orderId || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.post('store_pay/' + orderId, function(res) {
			callback(res);
		});
	},
	
	/**
	 * ping++平台支付
	 */
	alipayWapPay:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo = restInfo || '';
		restInfo.orderId = restInfo.orderId || '';
		restInfo.channel = restInfo.channel || '';
		restInfo.subject = restInfo.subject || '';
		restInfo.body = restInfo.body || '';
		restInfo.mod = restInfo.mod || 'store';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('subject',restInfo.subject);
		request.addData('body',restInfo.body);
		request.addData('mod',restInfo.mod);
		request.addData('order_id',restInfo.orderId);
		request.addData('channel',restInfo.channel);
		request.post('pingxx_pay', function(res) {
			callback(res);
		});
	},
}