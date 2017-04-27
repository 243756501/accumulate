var gamble={
	/*
	 * 获取某个用户的押注信息
	 */
	getPerGamble:function(postInfo,callback){
		var id=postInfo.id;
		var request=new httpRequest();
		request.addData('id',id);
		request.get('gamble_personal',function(res){
			callback(res);
		});
	},
	
	/*
	 * 获取历史期数
	 */
	getGamHistory:function(postInfo,callback){
		var page=postInfo.page || 1;
		var request=new httpRequest();
		request.addData('page',page);
		request.get('gamble_history',function(res){
			callback(res);
		})
	},
	/*
	 * 获取当前押注情况
	 */
	getGamResult:function(callback)
	{
		var request=new httpRequest();
		request.get('gamble_result',function(res){
			callback(res);
		})
	},
	/*
	 * 获取最近一期获奖用户
	 */
	getLatestReward:function(postInfo,callback)
	{
		var page=postInfo.page || 1;
		var request=new httpRequest();
		request.addData('page',page);
		request.get('gamble_reward',function(res){
			callback(res);
		})
	},
	/*
	 * 获取近一期的押注时间
	 */
	getGamLatest:function(callback)
	{
		var request=new httpRequest();
		request.get('gamble_latest',function(res){
			callback(res);
		})
	},
	/*
	 * 获取积分类型
	 */
	getScoreType:function(callback)
	{
		var request=new httpRequest();
		request.addData('mod_name','shop');
		request.get('mod_config',function(res){
			callback(res.data.shop.score_type);
		})
	},
	/*
	 * 获取押注分类
	 */
	getGamType:function(callback)
	{
		var request=new httpRequest();
		request.get('gamble_type',function(res){
			callback(res);
		})
	},
	/*
	 * 用户押注
	 */
	userGamble:function(postInfo,callback)
	{
		var request=new httpRequest();
		var state = app.getState();
		request.addData('open_id',state.open_id);
		request.addData('gamble',JSON.stringify(postInfo.gambleArray));
		request.post('gamble',function(res){
			callback(res);
		})
	},
	/*
	 * 获取押注用户信息
	 */
	gamUserInfo:function(callback)
	{
		var request=new httpRequest();
		var state = app.getState();
		request.addData('open_id',state.open_id);
		request.get('gamble_userinfo',function(res){
			callback(res);
		}) 
	}
	
}
