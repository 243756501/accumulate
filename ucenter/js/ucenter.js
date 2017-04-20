var ucenter = {
	
	/**
	 * 获取用户列表
	 * @param {Object} restInfo		请求参数
	 * @param {Function} callback	返回回调函数
	 */
	getUserList:function(restInfo,callback){
		var request = new httpRequest();
		request.addData('type', restInfo.type);
		request.addData('page', restInfo.page);
		request.get('friends/' + restInfo.uid, function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 加关注操作
	 */
	following:function(userId,callback){
		var request = new httpRequest();
		request.addData('follow_who', userId);
		request.post('follow', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 取消关注操作
	 */
	unFollowing:function(userId,callback){
		var request = new httpRequest();
		request.addData('follow_who', userId);
		request.delete('follow', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 上传头像
	 */
	setAvatar:function(avatarInfo,callback){
		var request = new httpRequest();
		request.addData('data', avatarInfo);
		request.post('avatar', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 个人基本资料的修改
	 */
	setUserInfo:function(settingInfo,callback){
		var request = new httpRequest();
		request.addData('sex', settingInfo.sex);
		request.addData('signature', settingInfo.signature);
		request.addData('nickname', settingInfo.nickname);
		request.addData('province', settingInfo.province);
		request.addData('city', settingInfo.city);
		request.addData('district', settingInfo.district);
		request.put('user', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 修改个人资料QQ
	 */
	setInfoqq:function(setInfoqq,callback){
		var request = new httpRequest();
		request.addData('name', 'qq');
		request.addData('data', setInfoqq);
		request.put('field', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 修改账号
	 */
	changeAccount:function(rqstInfo,callback){
		var request = new httpRequest();
		request.addData('account', rqstInfo.account);
		request.addData('verify', rqstInfo.verify);
		request.addData('action', rqstInfo.action);
		request.put('account', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 签到
	 */
	signIn:function(callback){
		var request = new httpRequest();
		request.post('check',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取签到信息
	 */
	getSignInfo:function(callback){
		var request = new httpRequest();
		request.get('check',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取签到排行榜
	 */
	getSignTop:function(data,callback){
		var request = new httpRequest();
		request.addData('type',data.type);
		request.addData('page',data.page);
		request.get('check_rank',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取积分类型
	 */
	getScoreType:function(callback){
		var request = new httpRequest();
		request.get('score_type',function(res){
			callback(res);
		});
	},
	
	
	/**
	 * 获取充值配置参数
	 */
	checkRecharge:function(callback){
		var request = new httpRequest();
		request.get('pingxx_check_recharge',function(res){
			callback(res);
		});
	},
	
	
	/**
	 * 提交充值订单
	 */
	crtReOrder:function(restInfo,callback){
		var request = new httpRequest();
		request.addData('recharge_type',restInfo.type_id);
		request.addData('amount',restInfo.amount);
		request.addData('channel','alipay_pc_direct');
		request.post('pingxx_ctre_order',function(res){
			callback(res);
		});
	},
	
	
	/**
	 * 获取用户账号绑定信息
	 */
	getBindInfo:function(callback){
		var request = new httpRequest();
		request.get('sync',function(res){
			callback(res);
		});
	},
	
	
	/**
	 * 获取用户账号绑定信息
	 */
	setBindInfo:function(requstInfo,callback){
		var request = new httpRequest();
		request.addData('type',requstInfo.type);
		request.addData('bind',requstInfo.bind);
		request.addData('auth_result',requstInfo.auth_result);
		request.put('sync',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取消息类型
	 */
	getMsgType:function(callback){
		var request = new httpRequest();
		request.get('message_type',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取消息列表
	 */
	getMsgList:function(rqstInfo,callback){
		var request = new httpRequest();
		request.addData('type',rqstInfo.type);
		request.addData('page',rqstInfo.page);
		request.get('message',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取排行榜信息
	 */
	getRankInfo:function(rqstInfo,callback){
		var request = new httpRequest();
		request.get('rank',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取排行榜成员列表
	 */
	getRankList:function(rqstInfo,callback){
		var request = new httpRequest();
		request.addData('type',rqstInfo.type);
		request.addData('page',rqstInfo.page);
		request.get('rank_member',function(res){
			callback(res);
		});
	},
}