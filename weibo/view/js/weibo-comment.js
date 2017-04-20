/**
 * Created by Administrator on 15-10-27.
 */
mui.init();
mui.plusReady(function(){

    var param = plus.webview.currentWebview();
	var aData = param.data;
    var weibo_id = aData.weibo_comment.id;
    var toUser = aData.to_user;
    var showSmile = document.getElementById('show_smile');
    var smileView = document.getElementById('show_expression');

    if(toUser.nickname != null &&  toUser.nickname != ''){
        document.getElementById('comment').value = "回复 @"+toUser.nickname+": ";
    }

	showSmile.addEventListener('tap',function(e){
		apptools.toggleDom(smileView,smileView.style.display == 'none');
	})
    showSmile.createExpression({target:document.getElementById('comment'),showDiv: smileView});
    if(toUser.uid == null ||  toUser.uid  == ''){
        toUser.uid  = 0;
    }

    var settings = app.getSettings();
    var state = app.getState();
    document.getElementById('send_btn').addEventListener('tap', function() {
        if (settings.autoLogin && state.open_id) {

            if (document.getElementById('comment').value == '') {
                toast.info("评论不能为空。");
                return;
            }
            toast.showLoading('评论中');
            var commentInfo = {
                contents : document.getElementById('comment').value,
                weibo_id : weibo_id,
                open_id : state.open_id,
                to_comment_id : toUser.uid
            };

            weibo.sendComment(commentInfo,function(res){
                if (typeof(res) == 'object') {
                    if (res.code == 200) {
                        //插入最新评论
                        var weiboDetail = plus.webview.getWebviewById('weibo-detail');
                        if(weiboDetail)weiboDetail.evalJS('add_comment_to_list('+JSON.stringify(res.data)+')');
                        toast.info('发布成功');
                        mui.back();
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
});