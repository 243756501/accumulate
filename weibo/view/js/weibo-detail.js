mui.init({
  gestureConfig:{
   longtap: true, //默认为false
  }
});
mui('.mui-scroll-wrapper').scroll();
mui.previewImage();
var loadView = document.getElementById('loading_page');
var mainView = document.getElementById('pullrefresh');
var weibo_detail = document.getElementById('weibo_detail');
var comment_count = document.getElementById('comment_count');
var support_count = document.getElementById('support_count');
var commentDiv = document.getElementById('commentDiv');
var commentList = document.getElementById('commentList');

var shareApi,weiboInfo = null;		//微博详情对象
var weiboId = 0;
var requstInfo = null;		//获取微博评论的请求信息
var fistCount = 0;
var secondCount = 0;
var block = true;
var loadBar = null;
var supportListInfo = null;		//获取微博点赞的请求信息
var fistSupportCount = 0;
var secondSupportCount = 0;
var supportLoadBar = null;
var xiamiMusicObj = new XiamiMusicObj('.mui-scroll');	//实例化虾米音乐播放对象
var $weibo_support;

/*监听微博的改变事件*/
window.addEventListener('weiboChange',function(event){
	
	tmpId = event.detail.data;
	if(!weiboId || tmpId != weiboId){
		mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
		weiboId = tmpId;
		initWeibo();
	}else{
		changePage(loadView,mainView,false);
	}
})
mui('#mui-scroll').on('tap','.weibo-content-voice-btn',function(e){
	event.stopPropagation();
	voicePlayer(this, "_downloads/audio/upload/1479447529451.amr");
})
/*初始化微博详情数据*/
var initWeibo = function(){
	
	document.getElementsByClassName('support-btn')[0].setAttribute('row-id', weiboId);
	
	//开始获取单挑微博详细数据
	weibo.getSimpleWeibo(weiboId,function(res){
		if(res.code == 200 && res.data){
			weiboInfo = res.data;
			weiboInfo.is_weibo_main = false;
			weiboInfo.hideOperation = 1;
			//设置分享信息
			shareApi.setContent(weiboInfo.share_url,weiboInfo.content,weiboInfo.content,weiboInfo.type=='image'&&weiboInfo.attach.image.thumb);
			weiboInfo.create_time = apptools.fmtUnixTime(weiboInfo.create_time, true);
			var detail = parse_weibo_html(weiboInfo);
			var support_icon = document.getElementById('support_icon');
			support_icon.setAttribute('is_bind_event', weiboInfo.is_support);
			support_icon.style.color = weiboInfo.is_support?'red':'#CCC';
		
			weibo_detail.innerHTML = detail;
			comment_count.innerText = weiboInfo.comment_count;
			support_count.innerText = weiboInfo.support_count;
	    changePage(loadView,mainView,false);
		}else{
			toast.info('微博不存在或已删除');
		}
	})
	
	//微博评论
	fistCount = 0;
	secondCount = 0;
	block = true;
	requstInfo = {weiboId: weiboId,page: 1};
	initComment();
	
	//微博点赞
	fistSupportCount = 0;
	secondSupportCount = 0;
	supportListInfo = {appname: 'Weibo',table: 'weibo',row: weiboId,page: 1};
	initSupport();
}

/*初始化评论数据*/
var initComment = function(){
	commentList.innerHTML = '';
	weibo.getWeiboCommentList(requstInfo, function(res) {
	    if (res.code == 200) {
	    	for (index in res.data) {
	    		var commentInfo = res.data[index];
	    		var li = commentLi(commentInfo);
	    		commentList.appendChild(li);
	    	}
			if (commentList.children.length == 0) {
			    requstInfo.page--;
			    loadBar.innerText = '暂无评论';
		    } else if (res.data.length < 10) {
		        secondCount = res.data.length;
		        requstInfo.page--;
		        loadBar.innerText = '暂无更多评论';
		    } else {
		        	loadBar.innerText = '点击加载更多';
	        }
	   		commentDiv.appendChild(loadBar);
	    } else {
	        mui.toast(res.info);
	    }
	});
}

/*初始化点赞数据*/
var initSupport = function(){
	supportList.innerHTML = '';
	weibo.getSupportList(supportListInfo, function(res) {
		if (res.code == 200) {
			for (index in res.data) {
				var supportListsInfo = res.data[index];
				var li = supportLi(supportListsInfo);
				supportList.appendChild(li);
			}
			if (supportList.children.length == 0) {
				supportLoadBar.innerText = '暂无点赞';
			} else if (res.data.length < 10) {
				secondSupportCount = res.data.length;
				supportListInfo.page--;

			} else {
				supportLoadBar.innerText = '点击加载更多';
			}
			supportView.appendChild(supportLoadBar);
		} else {
			mui.toast(res.info);
		}
	})
}

/*H5+装备望彼*/
mui.plusReady(function() {
	
  $weibo_support = creat_weibo_support('support-btn');
	$weibo_support.bindSupport();
	shareApi = new share('share_btn')
	
	var selfWeb = plus.webview.currentWebview();
	selfWeb.addEventListener('hide',function(e){
		changePage(loadView,mainView,true);
		pauseMusic();
	})
	
	//如果有传递数据则初始化（针对其他模块打开时的解决方案）
	weiboId = self.data;
	if(weiboId){
		initWeibo();
	}

	//加载更多按钮
	loadBar = document.createElement('div');
	loadBar.className = 'loadBar mui-table-view-cell';
	loadBar.addEventListener('tap', function() {
		if(block){
		    requstInfo.page++;
		    weibo.getWeiboCommentList(requstInfo, function(res) {
		    if (res.code == 200) {
			    fistCount = typeof(res.data) == 'undefined' ? 0 : res.data.length;
			    for (var i = secondCount; i < fistCount; i++) {
			    var commentInfo = res.data[i];
			    var li = commentLi(commentInfo);
			    commentList.appendChild(li);
			    }
			if (fistCount < 10) {
			    secondCount = fistCount;
			    requstInfo.page--;
			    loadBar.innerText = '暂无更多评论';
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

	//点赞列表加载更多按钮
	supportLoadBar = document.createElement('div');
	supportLoadBar.className = 'loadBar mui-table-view-cell';
	supportLoadBar.addEventListener('tap', function() {
		supportListInfo.page++;
		weibo.getSupportList(supportListInfo, function(res) {
			if (res.code == 200) {
				fistSupportCount = typeof(res.data) == 'undefined' ? 0 : res.data.length;
				for (var i = secondSupportCount; i < fistSupportCount; i++) {
					var supportListsInfo = res.data[i];
					var li = supportLi(supportListsInfo);
					supportList.appendChild(li);
				}
				if (fistSupportCount < 10) {
					secondSupportCount = fistSupportCount;
					supportListInfo.page--;
					supportLoadBar.innerText = '暂无更多';
				} else {
					secondSupportCount = 0;
					supportLoadBar.innerText = '点击加载更多';
				}
			} else {
				mui.toast(res.info);
			}
		});
	});
});

var commentView = document.getElementById("commentDiv");
var supportView = document.getElementById("support");
var commentbutton = document.getElementById("commentbutton");
var supportbutton = document.getElementById("supportbutton");
 //判断评论模块是否显示
var cs = 'commentbutton';

mui('.detail-footer').on('tap','.my-btn',function(){
	if(cs != this.id){
		cs = this.id;
		changePage(commentView,supportView,cs=="commentbutton");
		commentbutton.classList.toggle('my-active');
		supportbutton.classList.toggle('my-active');
	}
})

//获得一个评论li
function commentLi(commentInfo) {
    var li = document.createElement('li');
    li.className = 'comment-item mui-table-view-cell';
    li.detail_info = commentInfo;
    template.config('escape', false);
    var weibo_comment_render = template.compile(weibo_comment);
    var html = weibo_comment_render(commentInfo);
    li.innerHTML = html;
    return li;
}

//获得一个点赞列表li
var supportLi = function(supportListsInfo) {
    var li = document.createElement('li');
    li.className = 'support-people';
    li.detail_info = supportListsInfo;
    template.config('escape', false);
    var weibo_support_render = template.compile(weibo_support_list);
    var html = weibo_support_render(supportListsInfo);
    li.innerHTML = html;
    return li;
}

//评论后把评论装载进评论列表
var add_comment_to_list = function(json) {
	var li = commentLi(json);
	commentList.insertBefore(li, commentList.childNodes[0]);
	comment_count.innerText ++;
	requstInfo.page++;
};
    
linkUrl('#mui-scroll');		//打开外链网址

//打开微博转发页面
document.getElementById("repost").addEventListener('tap', function() {
	if(app.loginHandle()){
		webtools.openSingleWeb('weibo-repost',weiboInfo);
	}
});

//跳转评论回复页面
var jump_to_weibo_comment = function(info) {
	if(app.loginHandle()){
		var data = {
			to_user:{
				uid:event.target.getAttribute('to-id'),
				nickname:event.target.getAttribute('to-user')
			},
	  	weibo_comment: weiboInfo
		};
		if(info){
			data.to_user.uid = info.user.uid;
			data.to_user.nickname = info.user.nickname;
		}
		webtools.openSingleWeb('weibo-comment',data);
	}
};
//回复评论人
mui('#commentList').on('tap', 'i', function(event) {
	var tmpInfo = get_parent_node(this,'li').detail_info;
	jump_to_weibo_comment(tmpInfo)
	return false;
});
//回复博主
document.getElementById("sendcomment").addEventListener('tap', function(event) {
		jump_to_weibo_comment();
});

weibo.ext_weibo_link();
//获取点击人的uid
app.userListener('.user-flag');
mui('#commentList').on('longtap', '.comment-item', function(e) {
	var info = this.detail_info;
	plus.nativeUI.actionSheet( {cancel:"取消",buttons:[{title:"举报"}]}, function(e){
		switch (e.index){
			case 1:
			app.openReportWeb('weibo_comment',info);
			break;
		}
	});
},false);

//语音播放
mui('#weibo_detail').on('tap', '.weibo-content-voice-btn', function(event) {
	event.stopPropagation();
		voice_load(this);
})