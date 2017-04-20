var news = {
	
	/**
	 * 获取资讯分类
	 */
	getNewsClass: function(newsClassId,callback){
		callback = callback || mui.noop;
		newsClassId = newsClassId || '';
		var request = new httpRequest();
		request.addData('method',"GET");
		request.addData('id',newsClassId);
		request.get('news_category',function(res){
			callback(res);

		});
	},
	
	
	/**
	 *获取某一分类下的资讯列表
	 */
	getNewsList: function(restInfo,callback){
		callback = callback || mui.noop;
		restInfo = restInfo || '';
		restInfo.id = restInfo.newsType || '';
		restInfo.page = restInfo.page || '';
		var request = new httpRequest();
		request.addData('method',"GET");
		request.addData('id',restInfo.newsType);
		request.addData('page',restInfo.page);
		request.get('news',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取某人的资讯列表
	 */
	getPersonNews: function(personInfo,callback){
		callback = callback || mui.noop;
		personInfo = personInfo || '';
		personInfo.uid = personInfo.uid || '';
		personInfo.page = personInfo.page || '';
		personInfo.open_id = personInfo.open_id || '';
		var request = new httpRequest();
		request.addData('open_id',personInfo.open_id);
		request.addData('uid',personInfo.uid);
		request.addData('page',personInfo.page);
		request.get('my_news',function(res){
			callback(res);
		});
	},
		
	/**
	 * 获得热门资讯列表
	 */
	getHotNewsList:function(newsClassId,callback){
		callback = callback || mui.noop;
		newsClassId = newsClassId || '';
		var request = new httpRequest();
		request.addData('method',"GET");
		request.get('news_hot/' + newsClassId,function(res){
			callback(res);

		});
	},
	
	
	/**
	 * 获得推荐资讯列表
	 */
	getRecommendNewsList:function(positionId,callback){
		callback = callback || mui.noop;
		positionId = positionId || "";
		var request = new httpRequest();
		request.addData('method',"GET");
		request.addData('position',positionId);
		request.get('news_recommend',function(res){
			callback(res);

		});
	},
	
	/**
	 * 获取资讯详情
	 */
	getNewsDetail:function(newsId,callback){
		var openId = app.getState().open_id||'';
		newsId = newsId || '';
		var request = new httpRequest();
		request.addData('open_id',openId);
		request.addData('method',"GET");
		request.get('news_detail/'+ newsId,function(res){
			callback(res);
		});
	},
	
	
	/**
	 *获取资讯评论列表
	 */
	getNewsCommentData:function(restInfo,callback){
		callback = callback || mui.noop;
		restInfo = restInfo || '';
		restInfo.newsId = restInfo.newsId || '';
		restInfo.page = restInfo.page || '';
		var request = new httpRequest();
		request.addData('method',"GET");
		request.addData('page',restInfo.page);
		request.get('news_comment/'+ restInfo.newsId,function(res){
			callback(res);
		});
	},
	
	
	/**
	 * 投稿资讯
	 */
	sendNews : function(sendInfo,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		sendInfo = sendInfo || '';
		sendInfo.title = sendInfo.title || '';
		sendInfo.contents = sendInfo.content || '';
		sendInfo.category = sendInfo.category || '';
		sendInfo.cover = sendInfo.cover || '';
		sendInfo.dead_line = sendInfo.dead_line || '';
		sendInfo.source = sendInfo.source || '';
		sendInfo.open_id = sendInfo.open_id || '';
		var request = new httpRequest();
		request.addData('title',sendInfo.title);
		request.addData('content',sendInfo.contents);
		request.addData('category',sendInfo.category);
		request.addData('description',sendInfo.description);
		request.addData('cover',sendInfo.cover);
		request.addData('dead_line',sendInfo.dead_line);
		request.addData('source',sendInfo.source);
		request.addData('open_id',state.open_id);
		request.post('news',function(res){
			callback(res);
		})
	},
	
	/**
	 * 回复资讯
	 */
	sendNewsComment: function(sendComment,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		sendComment = sendComment || '';
		sendComment.content = sendComment.content || '';
		sendComment.row_id = sendComment.row_id || '';
		var request = new httpRequest();
		request.addData('content',sendComment.content);
		request.addData('open_id',state.open_id);
		request.post('news_comment/' + sendComment.row_id,function(res){
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
		request.delete('news_comment/' + deleteComment.id,function(res){
			callback(res);
		})
	},
	
};

var show_category = function (data) {
    var userPicker = new mui.PopPicker();
    var $roleButton = document.getElementById('showUserType');
    var $role_id = document.getElementById('role_id');
    //默认角色赋值
    $roleButton.innerHTML = data[0].title;
    $role_id.value = data[0].id;
    var pickerData = [];
    //记录数组的下标
    var mNum=0;
    for (var item in data) {
        pickerData[mNum] = {value: data[item].id, text: data[item].title};
        mNum++;
        if (data[item].NewsSecond != null){
        	for(var i in data[item].NewsSecond){
        		pickerData[mNum] = {value: data[item].NewsSecond[i].id,text: data[item].NewsSecond[i].title};
        		mNum++;
        	}
        }
    }
    userPicker.setData(pickerData);
//  var userResult = document.getElementById('userResult');
    $roleButton.addEventListener('tap', function (event) {
        userPicker.show(function (items) {
            $role_id.value = items[0].value;
            $roleButton.innerHTML = items[0].text;
            //返回 false 可以阻止选择框的关闭
            //return false;
        	});
    	}, false);
};
