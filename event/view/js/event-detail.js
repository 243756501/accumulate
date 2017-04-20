mui.init();
mui('#scroll_wrapper').scroll();
mui.previewImage();

var shares=null,bhref=false,selfWeb;
var share,masking = null;
var Intent=null,File=null,Uri=null,main=null;
var eventInfo = {},commentInfo;
var eventsId = '';
var loadBar = '';
var loadView = document.getElementById('loading_page');
var mainView = document.getElementById('main_view');
var detailDiv = document.getElementById('event_detail');
var commentList = document.getElementById('comment_list');
var eventComment = document.getElementById('event_comment');
var replyText = document.getElementById('reply_text');
var	chat_icon = document.getElementById('chat_icon');
var	view_num = document.getElementById('view_num');
var	show_hide = document.getElementById('show_hide');
var	show_foot = document.getElementById('show_foot');
var replyText = document.getElementById('reply_text');
var	show_comment = document.getElementById('show_comment');
show_hide.addEventListener('tap',function(){
	show_comment.style.display = 'block';
	show_foot.style.display = 'none';
	createMsk();
	replyText.value = '';
});

var get_coment_li = function(mInfo) {
	var li = document.createElement('li');
	li.className = 'mui-media event mui-clearfix';
	li.mInfo = mInfo;
	li.innerHTML = parse_event_html(comment, mInfo);
	return li;
}

var init = function(info){
	if(info){
		eventInfo = info;
		eventsId = eventInfo.id;
		eventInfo.explain = imgTools.getDtlContent(eventInfo.explain);
		detailDiv.innerHTML = parse_event_html(detail_render, eventInfo);
		chat_icon.innerHTML = eventInfo.reply_count;
		view_num.innerHTML = eventInfo.view_count;
		changePage(loadView,mainView,false);
		commentInfo = {
			row_id: eventInfo.id,
			page: 1
		};
		commentList.innerHTML = '';
		//获取评论列表
		getEventComments(commentInfo);
		app.shareHref(eventInfo.share_url,eventInfo.title,eventInfo.explain);
	}
}


var getEventComments = function(commentInfo) {
	events.getComment(commentInfo, function(res) {
		if (res.code == 200) {
			for (index in res.data.list) {
				var mInfo = res.data.list[index];
				commentList.appendChild(get_coment_li(mInfo));
			}
			if (commentList.children.length == 0) {
				commentInfo.page--;
				loadBar.innerText = '暂无评论';
			} else if (res.data.length < 10) {
				secondCount = res.data.length;
				commentInfo.page--;
				loadBar.innerText = '暂无更多评论';
			} else {
				loadBar.innerText = '点击加载更多';
			}
			eventComment.appendChild(loadBar);
		} else {
			toast.info(res.info);
		}
	});
}

window.addEventListener('eventChange',function(e){
	var tmpInfo = e.detail.data;
	if(tmpInfo.id != eventInfo.id){
		init(tmpInfo);
	}else{
		changePage(loadView,mainView,false);
	}
})

mui.plusReady(function() {
	share = new share();
	if(plus.os.name=="Android"){
		Intent = plus.android.importClass("android.content.Intent");
		File = plus.android.importClass("java.io.File");
		Uri = plus.android.importClass("android.net.Uri");
		main = plus.android.runtimeMainActivity();
	}
	
	selfWeb = plus.webview.currentWebview();
	init(selfWeb.data);
	selfWeb.addEventListener('hide',function(e){
		changePage(loadView,mainView,true);
	})
});
//加载按钮
loadBar = loadBtn();
var fistCount = 0;
var secondCount = 0;
var block = true;
loadBar.addEventListener('tap', function(event) {
	if (block) {
		block = false;
		commentInfo.page++;
		events.getComment(commentInfo, function(res) {
			if (res.code == 200) {
				fistCount = res.data.list == null ? 0 : res.data.list.length;
				for (var i = secondCount; i < fistCount; i++) {
					var mInfo = res.data.list[i];
					commentList.appendChild(get_coment_li(mInfo));
				}
				if (fistCount < 10) {
					secondCount = fistCount;
					commentInfo.page--;
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

window.addEventListener('eventDetail', function(event) {
	setTimeout(function() {
		var $this = document.getElementById('join1');
		$this.setAttribute('class', 'unjoin event-join-state-1');
		$this.style.background = '#848484';
		$this.innerHTML = '取消报名';
	}, 1000);
})



/**
 * 报名参加
 */
mui('#event_detail').on('tap', '.join', function(e) {
	mui.openWindow({
		url: 'join-event.html',
		id: 'join-event',
		extras: {
			eventId: this.getAttribute('event_id')
		}
	})

	return false;
});

mui('#event_detail').on('tap', '.unjoin', function(e) {
	toast.showLoading();
	var $this = this;
	var event_id = $this.getAttribute('event_id');
	console.log('取消报名');

	var btnArray = ['残忍退出', '留下'];
	mui.confirm('您正在退出活动，确认？', '退出', btnArray, function(e) {
		if (e.index == 0) {
			events.quitEvent(event_id, function(res) {
				toast.hideLoading();
				if (res.code == 200) {
					var eventBody = plus.webview.getWebviewById('event-body');
					mui.fire(eventBody, 'eventBody', {});
					$this.setAttribute('class', 'join event-join-state-1');
					$this.style.background = "#23abf0";
					$this.innerHTML = '我要报名';
				} else {
					toast.info(res.info);
				}
			});
		} else {
			toast.hideLoading();
			console.log('没有');
		}
	})
	return false;
});

//评论
document.getElementById('send_btn').addEventListener('tap', function() {
	if (replyText.value == '') {
		toast.info("评论不能为空。");
		return;
	}
	toast.showLoading('评论中');
	var sendComment = {
		content: replyText.value,
		row_id: eventsId,
	};

	var comInfo = {
		row_id: eventsId,
		page: 1
	}
	events.sendComment(sendComment, function(res) {
		if (typeof(res) == 'object') {
			if (res.code == 200) {
				show_comment.style.display = 'none';
				show_foot.style.display = 'block';
				masking.style.display = 'none';
				replyText.value = '';
				commentList.innerHTML = '';
				getEventComments({
					row_id: eventsId,
					page: 1
				});
				toast.info('发布成功');
			} else {
				toast.info(res.info);
			}
		} else {
			toast.info(res.info);
		}
		toast.hideLoading();
	})
}, false);

/*删除评论*/
mui('#comment_list').on('tap', '#delete', function(event) {
	var li = get_parent_node(this, '.event');
	toast.showLoading('删除中')
	var id = li.mInfo.id;
	var deleteComment = {
		id: id,
		row_id: eventsId,
	};
	events.deleteComment(deleteComment, function(res) {
		toast.hideLoading();
		if (res.code == 200) {
			toast.info('删除回复成功');
			li.parentNode.removeChild(li)
		} else {
			mui.toast(res.info);
		}
	});
});

/*回复评论*/
mui('#comment_list').on('tap', '#reply_btn', function(event) {
	var li = get_parent_node(this, '.event');
	var userName = li.mInfo.user.nickname;
	replyText.focus();
	replyText.value = '回复 @' + userName + '：'
	createMsk();
	show_comment.style.display = 'block';
	show_foot.style.display = 'none';
	masking.style.display = 'block';
});
//点击头像进入个人主页。
app.userListener();