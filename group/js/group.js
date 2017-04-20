var group = {	
	/**
	 * 获取我的群组
	 */
	getMyGroup:function(callback){
		var open_id = app.getState().open_id || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.get('group_my', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取全部群组
	 */
	getAllGroup:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.page = info.page || '';
		info.type_id = info.type_id || '';
		var request = new httpRequest();
		request.addData('page',info.page);
		request.addData('open_id',open_id);
		request.addData('type_id',info.type_id);
		request.get('group_all', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取群组分类
	 */
	getGroupTypes:function(callback){
		callback = callback || mui.noop;
		var request = new httpRequest();
		request.get('group_type', function(res) {
			callback(res);
		});
	},
	/**
	 * 获取某个群组中的帖子
	 */
	getOneGroupItems:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.page = info.page || '';
		info.group_id = info.group_id || '';
		info.cate_id = info.cate_id || '';
		var request = new httpRequest();
		request.addData('group_id',info.group_id);
		request.addData('page',info.page);
		request.addData('cate_id',info.cate_id);
		request.addData('open_id',open_id);
		request.get('group_post_all', function(res) {
			callback(res);
		});
	},
	/*
	 * 获取某个群组中帖子的分类
	 */
	getOneGroupType:function(info,callback){
		callback = callback || mui.noop;
		info = info || '';
		info.group_id = info.group_id || '';
		var request = new httpRequest();
		request.addData('group_id',info.group_id);
		request.get('group_post_type', function(res) {
			callback(res);
		});
	},
	/**
	 * 获取群组帖子详情数据
	 * @param {Object} 提交参数
	 * @param {function} 返回结果的回调函数
	 */
	getPostDetail:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo.postId = restInfo.postId || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('id', restInfo.postId);
		request.get('group_post_detail', function(res) {
			callback(res);
		});
	},

	/**
	 * 获取群组帖子详情数据
	 * @param {Object} 提交参数
	 * @param {function} 返回结果的回调函数
	 */
	getPostDetail:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo.postId = restInfo.postId || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('id', restInfo.postId);
		request.get('group_post_detail', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取帖子回复
	 */
	getPostComment:function(restInfo,callback){
		restInfo.post_id = restInfo.post_id ||'';
		restInfo.page = restInfo.page ||'';
		var request = new httpRequest();
		request.addData('post_id', restInfo.post_id);
		request.addData('page', restInfo.page);
		request.get('group_post_reply', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取帖子楼中楼回复
	 */
	getPostLzlComment:function(restInfo,callback){
		restInfo.post_id = restInfo.post_id ||'';
		restInfo.to_f_reply_id = restInfo.to_f_reply_id ||'';
		restInfo.page = restInfo.page ||'';
		var request = new httpRequest();
		request.addData('post_id', restInfo.post_id);
		request.addData('to_f_reply_id', restInfo.to_f_reply_id);
		request.addData('page', restInfo.page);
		request.get('group_post_lzl', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 对帖子进行回复
	 */
	replyToPost:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo = restInfo || '';
		var request = new httpRequest();
		restInfo.post_id = restInfo.post_id || '';
		restInfo.content = restInfo.content || '';
		request.addData('post_id', restInfo.post_id);
		request.addData('content', restInfo.content);
		request.addData('open_id', open_id);
		request.post('group_post_reply', function(res) {
			callback(res);
		});
	},
	
	
		
	/**
	 * 进行楼中楼回复
	 */
	replyToFloor:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo = restInfo || '';
		var request = new httpRequest();
		restInfo.to_f_reply_id = restInfo.to_f_reply_id || '';
		restInfo.content = restInfo.content || '';
		request.addData('to_f_reply_id', restInfo.to_f_reply_id);
		request.addData('content', restInfo.content);
		request.addData('open_id', open_id);
		request.post('group_post_lzl', function(res) {
			callback(res);
		});
	},
	
	/*点赞*/
	bindEvent: function() {
			group.bindSupport();
		},
		bindSupport: function() {
			$group_support.bindSupport();
		},
		
	/**
	 * 加入群组
	 */
	joinGroup:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.group_id = info.group_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('group_id',info.group_id);
		request.post('group_user',function(res){
			callback(res);
		});
	},
	
	/**
	 * 退出群组
	 */
	quitGroup:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || '';
		info = info || '';
		info.group_id = info.group_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('group_id',info.group_id);
		request.delete('group_user',function(res){
			callback(res);
		});
	},
	
	/**
	 * 群组发帖
	 */
	sendGroupPost:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.title = info.title || '';
		info.content = info.content || '';
		info.cate_id = info.cate_id || '';
		info.attach_id = info.attach_id || '';
		info.group_id = info.group_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('title',info.title);
		request.addData('cate_id',info.cate_id);
		request.addData('content',info.content);
		request.addData('attach_id',info.attach_id);
		request.addData('group_id',info.group_id);
		request.post('group_post', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 群组成员
	 */
	getGroupMember:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.page = info.page || '';
		info.id = info.id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('id',info.id);
		request.addData('page',info.page);
		request.get('group_member', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 帖子收藏
	 */
	postMyCollection:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.post_id = info.post_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('post_id',info.post_id);
		request.post('group_post_bookmark',function(res){
			callback(res);
		});
	},
	
	/**
	 * 取消帖子收藏
	 */
	delMyCollection:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.post_id = info.post_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('post_id',info.post_id);
		request.delete('group_post_bookmark',function(res){
			callback(res);
		});
	},
	
	/**
	 * 我的收藏
	 */
	getMyCollection:function(info,callback){
		callback = callback || mui.noop;
		var open_id = app.getState().open_id || "";
		info = info || '';
		info.page = info.page || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('page',info.page);
		request.get('group_post_bookmark',function(res){
			callback(res);
		});
	},
}
