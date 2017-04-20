mui.init();
mui('.mui-scroll-wrapper').scroll();
mui.previewImage();
var mainView = document.getElementById('main_view');
var detailInfoView = document.getElementById('detail_info_view');
var bestDiv = document.getElementById('best_div');
var bestAnswer = document.getElementById('best_answer');
var answerList = document.getElementById('answer_list');
var answerDiv = document.getElementById('answer');
var loadView = document.getElementById('loading_page');
var userRankDiv = document.getElementById('user_rank');
var questionInfo = null;
var questionId,fistCount,secondCount = 0;
var answerRest = null;
var share;
var thisWeb = null;
var block = true;

/*question改变事件*/
window.addEventListener('questionChange',function(event){
	var tmpId = event.detail.data;
	if(!questionId || tmpId != questionId){
		mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
		questionId = tmpId;
 		question.getQuestionDetail(questionId,function(res){
  			if(res.code == 200){
  				questionInfo = res.data;
  				app.shareHref(questionInfo.share_url,questionInfo.title,questionInfo.description);
  				questionInfo.description = imgTools.getDtlContent(questionInfo.description);
  				questionInfo.create_time = apptools.fmtUnixTime(questionInfo.create_time);
  				detailInfoView.innerHTML = render_html(questionInfo,'question_detail');
  				
  				/*添加最佳答案*/
				bestAnswer.innerHTML = '';
  				if(questionInfo.best_answer){
  					bestDiv.style.display = 'block';
  					bestAnswer.appendChild(get_answer_li(questionInfo.best_answer))
  				}else{
  					bestDiv.style.display = 'none';
  				}
  			}else{
  				toast.info(res.info);
  			}
			changePage(loadView,mainView,false);
  		});
  		
		fistCount = 0;
		secondCount = 0;
		block = true;
		answerList.innerHTML = '';
  		answerRest = {questionId:questionId,page:1}
		//获取评论列表
		question.getAnswerList(answerRest, function(res) {
			if (res.data) {
				for(index in res.data){
                    var answerInfo = res.data[index];
					answerList.appendChild(get_answer_li(answerInfo));
				}
				if (res.data.length < 10) {
					secondCount = res.data.length;
					answerRest.page--;
					loadBar.innerText = '暂无更多回答';
				} else {
					loadBar.innerText = '点击加载更多';
				}
			} else {
				answerRest.page--;
				loadBar.innerText = '暂无回答';
			}
			answerDiv.appendChild(loadBar);
		});
	}else{
		changePage(loadView,mainView,false);
	}
})

mui.plusReady(function(){
	share = new share();
	thisWeb = plus.webview.currentWebview();
	thisWeb.addEventListener('hide',function(e){
		changePage(loadView,mainView,true);
	})
});
/*点击回顶*/
document.getElementById('top_title').addEventListener('tap',function(e){
	goTop(thisWeb);
});


/*回答按钮*/
document.getElementById('answer_question').addEventListener('tap',function(e){
	if(app.loginHandle()){
		webtools.openSingleWeb('question-answer',questionId);
	}
})

var get_answer_li = function(answerInfo){
	answerInfo.create_time = apptools.fmtUnixTime(answerInfo.create_time);
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell answer-item';
	li.id = answerInfo.id;
	li.innerHTML = render_html(answerInfo,'question_answer_item');
	return li;
}
//添加答案到列表
var add_answer_to_first = function(info){
	answerList.insertBefore(get_answer_li(info),answerList.children[0])
}

//加载按钮
var loadBar = loadBtn();
loadBar.innerText = '暂无更多回答';
answerDiv.appendChild(loadBar);
loadBar.addEventListener('tap', function(event) {
	if (block) {
		block = false;
		answerRest.page++;
		question.getAnswerList(answerRest, function(res) {
			if (res.data) {
				fistCount = typeof(res.data) == 'undefined' ? 0 : res.data.length
				for (var i = secondCount; i < fistCount; i++) {
					var answerInfo = res.data[i];
					answerList.appendChild(get_answer_li(answerInfo));
				}
				if (fistCount < 10) {
					secondCount = fistCount;
					answerRest.page--;
					loadBar.innerText = '暂无更多回答';
				} else {
					secondCount = 0;
					loadBar.innerText = '点击加载更多';
				}
			} else {
				mui.toast(res.info);
			}
			block = true;
		});
	}
});

/*回答详情*/
mui('#answerDiv').on('tap','.item-right',function(e){
	var answerId = get_parent_node(this,'.mui-table-view-cell').id;
	webtools.openSingleWeb('answer-detail',{info:questionInfo,answerId:answerId});
})
//点击头像进入个人主页
app.userListener();