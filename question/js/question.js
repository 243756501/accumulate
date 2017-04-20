var question = {
	
	/**
	 * 获取问答导航分类
	 */
	getQuestionType:function(callback){
		var request = new httpRequest();
		request.get('question_type', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取问题列表
	 */
	getQuestionList:function(restInfo,callback){
		restInfo.type = restInfo.type || "";
		restInfo.page = restInfo.page || "";
		var request = new httpRequest();
		request.addData('type', restInfo.type);
		request.addData('id', restInfo.id);
		request.addData('page', restInfo.page);
		request.get('question_list', function(res) {
			callback(res);
		});
	},
		
		
	/**
	 * 获取回答列表
	 */
	getAnswerList:function(restInfo,callback){
		restInfo.questionId = restInfo.questionId || "";
		restInfo.page = restInfo.page || "";
		var request = new httpRequest();
		request.addData('id', restInfo.questionId);
		request.addData('page', restInfo.page);
		request.get('answer_list', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取问题详情
	 */
	getQuestionDetail:function(questionId,callback){
		questionId = questionId || "";
		var request = new httpRequest();
		request.addData('id',questionId);
		request.get('question_detail', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 获取回答详情
	 */
	getAnswerDetail:function(answerId,callback){
		answerId = answerId || "";
		var request = new httpRequest();
		request.addData('id',answerId);
		request.get('answer_detail', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 回答的评价
	 */
	answerEvaluate:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo = restInfo || "";
		restInfo.answerId = restInfo.answerId || "";
		restInfo.eventType = restInfo.eventType || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('id', restInfo.answerId);
		request.addData('type', restInfo.eventType);
		request.post('evaluate', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 提问/修改问答接口
	 */
	askQuestion:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		restInfo = restInfo || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('category', restInfo.typeId);
		request.addData('title', restInfo.title);
		request.addData('description', restInfo.description);
		request.addData('leixing', restInfo.leixing);
		request.addData('score_num', restInfo.score_num);
		request.post('question', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 * 回答问题
	 */
	answerQuestion:function(restInfo,callback){
		var open_id = app.getState().open_id || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('question_id', restInfo.id);
		request.addData('answer_id', restInfo.answer_id);
		request.addData('content', restInfo.content);
		request.post('answer', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 查询某人的问答
	 */
	getSbQuestion:function(sbInfo,callback){
		sbInfo.uid = sbInfo.uid || '';
		sbInfo.page = sbInfo.page || '';
		var request = new httpRequest();
		request.addData('uid',sbInfo.uid);
		request.addData('page',sbInfo.page);
		request.get('question_user',function(res){
			callback(res);
		})
	},
	
	/*打开提问页面*/
	goSendWeb:function(btn){
	  	btn.addEventListener('tap',function(e){
			if(is_login()){
		  		webtools.openSingleWeb('question-send');
			}else{
				toast.info('请登陆后操作');
			}
		});
	},
	
	goDtWeb: function(data){
		webtools.openDtlWeb('question',data);
	}
};