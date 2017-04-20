var issue = {

	/**
	 * 获取专辑分类
	 * @param {Object} info
	 * @param {Object} callback
	 */
	getTypeData: function(callback) {
		var request = new httpRequest();
		request.get('issue_type', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取专辑列表
	 */
	getIssueList: function(restInfo,callback) {
		restInfo.page = restInfo.page || '';
		restInfo.issue_type = restInfo.issue_type || 0;
		var request = new httpRequest();
		request.addData('page',restInfo.page);
		request.get('issue_list/'+restInfo.issue_type, function(res) {
			callback(res);
		});
	},
	/**
	 * 获取专辑详情
	 */
	getIssueDetail: function(issueId,callback) {
		issueId = issueId || '';
		var request = new httpRequest();
		request.get('issue/' + issueId, function(res) {
			callback(res);
		});
	},
	
		/**
	 * 发布专辑接口
	 */
	sendIssue:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		restInfo = restInfo || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('cover_id', restInfo.cover_url);
		request.addData('title', restInfo.title);
		request.addData('content', restInfo.description);
		request.addData('issue_id', restInfo.id);
		request.addData('url', restInfo.issue_url);
		request.post('issue', function(res) {
			callback(res);
		});
	},
	
		/**
	 *获取专辑评论列表
	 */
	getIssueCommentData:function(restInfo,callback){
		restInfo = restInfo || '';
		restInfo.issueId = restInfo.issueId || '';
		restInfo.page = restInfo.page || '';
		var request = new httpRequest();
		request.addData('method',"GET");
		request.addData('page',restInfo.page);
		request.get('issue_comment/'+ restInfo.issueId,function(res){
			callback(res);
		});
	},
		/**
	 * 回复专辑
	 */
	sendIssueComment: function(sendComment,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		sendComment = sendComment || '';
		sendComment.content = sendComment.content || '';
		sendComment.row_id = sendComment.row_id || '';
		sendComment.open_id = sendComment.open_id || '';
		var request = new httpRequest();
		request.addData('content',sendComment.content);
		request.addData('open_id',state.open_id);
		request.post('issue_comment/' + sendComment.row_id,function(res){
			callback(res);
		})
	},
	deleteComment: function(deleteComment,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		deleteComment= deleteComment || '';
		deleteComment.row_id = deleteComment.row_id || '';
		deleteComment.id = deleteComment.id || '';
		var request = new httpRequest();
		request.addData('open_id',state.open_id);
		request.addData('row_id',deleteComment.row_id);
		request.put('issue_comment/' + deleteComment.id,function(res){
			callback(res);
		})
	},
	
	bindEvent: function() {
		issue.bindSupport();
	},
	bindSupport: function() {
		$issue_support.bindSupport();
	},

}
