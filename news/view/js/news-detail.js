mui.init({
	beforeback:function(){
		changePage(show_comment,show_foot,false);
	}
});
mui.previewImage();
mui('.mui-scroll-wrapper').scroll();
var loading = document.getElementById("loading_page");
var loaded = document.getElementById("news_mainpage");
var newsContainer = document.getElementById("news_detail_content");
var view_num = document.getElementById('view_num');
var chat_icon = document.getElementById('chat_icon');
var commentContainer = document.getElementById("news_commnet_ul");
var replyText = document.getElementById('reply_text');
var show_comment = document.getElementById('show_comment');
var show_foot = document.getElementById('show_foot');
var show_hide = document.getElementById('show_hide');
var newsComment = document.getElementById('news_comment');
var idConfirm, requstInfo = null;
var fistCount, secondCount, newsId = 0;
var block = true;
//加载按钮
var loadBar = loadBtn();
//var masking;
var add_newsdata = function(data, callback) {
	app.shareHref(data.share_url,data.title,data.description);
	var tmpContent = imgTools.getDtlContent(data.content);
	var html = template('news_detail_script', data);
	newsContainer.innerHTML = html;
	view_num.innerHTML = data.view;
	chat_icon.innerHTML = data.comment;
	document.getElementById("news_content").innerHTML = tmpContent;
	callback(true);
}
var add_commentdata = function(data) {
		var li = document.createElement('li');
		li.className = "nd-bottom-li mui-table-view-cell mui-clearfix";
		li.commentInfo = data;
		li.innerHTML = template('news_comment_script', data);
		return li;
}
var scroll = mui('.mui-scroll-wrapper').scroll();
document.querySelector('.mui-scroll-wrapper' ).addEventListener('scroll', function (e) {
      changePage(show_comment,show_foot,false);
})
	//监听有主页来的单条资讯Id
window.addEventListener('newsChange', function(e) {
		newsId = e.detail.data;
		requstInfo = {
			newsId: newsId,
			page: 1
		};
		if(idConfirm !== newsId) {
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0);
			news.getNewsDetail(newsId, function(res) {
				if(res.code == 200) {
					add_newsdata(res.data, function(e) {
						if(e) {
							changePage(loaded,loading,true);
						}
					})
				} else {
					mui.toast('资讯详情获取失败...');
				}
			})
			news.getNewsCommentData(requstInfo, function(res) {
				commentContainer.innerHTML="";
				if(res.data) {
					for(var i in res.data) {
						var li = add_commentdata(res.data[i]);
						commentContainer.appendChild(li);
					}
					if (newsComment.children.length == 0) {
							requstInfo.page--;
							loadBar.innerText = '暂无评论';
					} else if (res.data.length < 10) {
							secondCount = res.data.length;
							requstInfo.page--;
							loadBar.innerText = '暂无更多评论';
						} else {
							loadBar.innerText = '点击加载更多';
						}
						commentContainer.appendChild(loadBar);
				}
				else
				{
					loadBar.innerText = '暂无评论';
					commentContainer.appendChild(loadBar);
				}
			})
			idConfirm = newsId;
		}
		else
		{
			changePage(loaded,loading,true);
		}
	})
	/*回复评论*/
mui('#news_commnet_ul').on('tap', '#reply_btn', function(event) {
	var li = this.parentNode.parentNode.parentNode;
	var userName = li.commentInfo.user.nickname;
	replyText.focus();
	replyText.value = '回复 @' + userName + '：'
//	createMsk();
	changePage(show_comment,show_foot,true);
//	masking.style.display = 'block';
});
//评论
document.getElementById('send_btn').addEventListener('tap', function() {
	if(is_login()) {
		if(replyText.value == '') {
			toast.info("评论不能为空。");
			return;
		}
		toast.showLoading('评论中');
		var sendComment = {
			content: replyText.value,
			row_id: newsId,
		};
		news.sendNewsComment(sendComment, function(res) {
			document.activeElement.blur();
			if(typeof(res) == 'object') {
				if(res.code == 200) {
//					masking.style.display = 'none';
					changePage(show_foot,show_comment,true);
					replyText.value = '';
					toast.info('发布成功');
					var li=add_commentdata(res.data[0]);
					commentContainer.insertBefore(li,commentContainer.childNodes[0]);
				} else {
					toast.info(res.info);
				}
			} else {
				toast.info(res.info);
			}
			toast.hideLoading();
		})
	} else {
		toast.info("未登录");
	}
}, false);

show_hide.addEventListener('tap', function() {
	if(is_login()) {
		changePage(show_comment,show_foot,true);
//		createMsk();
		replyText.value = '';
	} else {
		toast.info("请登录后操作")
	}
});

loadBar.addEventListener('tap', function(event) {
	if(block) {
		block = false;
		requstInfo.page++;
		news.getNewsCommentData(requstInfo, function(res) {
			if(res.code == 200) {
				fistCount = typeof(res.data) == 'undefined' ? 0 : res.data.length
				for(var i = secondCount; i < fistCount; i++) {
					var li = add_commentdata(res.data[i]);
					commentContainer.insertBefore(li,loadBar);
				}
				if(fistCount < 10) {
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
mui.plusReady(function() {
	share = new share();
	thisWeb = plus.webview.currentWebview();
	thisWeb.addEventListener('hide', function(e) {
		changePage(loading, loaded, true);
//		if(masking) mui.trigger(masking, 'tap');
	})
});