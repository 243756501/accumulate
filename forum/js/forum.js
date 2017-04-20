var forum = {

	/**
	 * 获取全部帖子列表
	 */
	getPostAll: function(restInfo, callback) {
		restInfo.id = restInfo.id || '';
		restInfo.page = restInfo.page || '';
		var request = new httpRequest();
		request.addData('forum_id', restInfo.id);
		request.addData('page', restInfo.page);
		request.get('forum_post', function(res) {
			callback(res);
		});
	},


	/**
	 * 获取帖子详情
	 */
	getPostDetail: function(post_id, callback) {
		var open_id = app.getState().open_id || "";
		post_id = post_id || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.get('forum_post_detail/' + post_id, function(res) {
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
		request.addData('page', restInfo.page);
		request.get('forum_comment/' + restInfo.post_id, function(res) {
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
		request.addData('to_f_reply_id', restInfo.to_f_reply_id);
		request.addData('page', restInfo.page);
		request.get('forum_lzl_comment/' + restInfo.post_id, function(res) {
			callback(res);
		});
	},


	/**
	 * 获取置顶帖列表
	 */
	getPostTop: function(forum_id, callback) {
		var request = new httpRequest();
		forum_id = forum_id || '';
		request.addData('id', forum_id);
		request.get('forum_top', function(res) {
			callback(res);
		});
	},


	/**
	 * 获取论坛板块列表
	 */
	getForumModule: function(callback) {
		var request = new httpRequest();
		request.get('forum_type', function(res) {
			callback(res);
		});
	},

	/**
	 * 发布帖子
	 * @param {Object} sendInfo
	 * @param {function} callback
	 */
	sendpost: function(sendInfo, callback) {
		console.log(JSON.stringify(sendInfo));
		var open_id = app.getState().open_id || "";
		sendInfo = sendInfo || '';
		sendInfo.title = sendInfo.title || '';
		sendInfo.content = sendInfo.content || '';
		sendInfo.forum_id = sendInfo.forum_id || '';
		sendInfo.sendWeibo = sendInfo.sendWeibo || '';
		var request = new httpRequest();
		request.addData('forum_id', sendInfo.forum_id);
		request.addData('content', sendInfo.content);
		request.addData('title', sendInfo.title);
		request.addData('open_id', open_id);
		request.post('forum_post', function(res) {
			callback(res);
		});
	},
	/**
	 * 获取论坛列表
	 */
	getForumList: function(restInfo, callback) {
		var open_id = app.getState().open_id || "";
		restInfo = restInfo || '';
		var request = new httpRequest();
		restInfo.typeId = restInfo.typeId || '';
		restInfo.page = restInfo.page || '';
		restInfo.forum_id = restInfo.forum_id || '';
		request.addData('type_id', restInfo.typeId);
		request.addData('forum_id', restInfo.forum_id);
//		request.addData('page', restInfo.page);
		request.addData('open_id', open_id);
		request.get('forum', function(res) {
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
		request.post('forum_comment', function(res) {
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
		request.post('forum_lzl', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 论坛关注操作
	 */
	forumFollow:function(forumId,callback){
		var open_id = app.getState().open_id || "";
		var request = new httpRequest();
		forumId = forumId || '';
		request.addData('id', forumId);
		request.addData('open_id', open_id);
		request.put('forum_follow', function(res) {
			callback(res);
		});
	},

	bindEvent: function() {
			forum.bindSupport();
		},
		bindSupport: function() {
			$forum_support.bindSupport();
		},

};

/*loading的加载和显示*/
var thisChangePage = function(loading) {
	document.getElementById('loading_page').style.display = loading?'block':'none';
	document.getElementById('pullrefresh').style.display = loading?'none':'block';
}
