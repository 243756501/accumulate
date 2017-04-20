/**
 * Created by Administrator on 15-10-27.
 */

mui.init({
	beforeback: function(){
		var preview = document.getElementById("__MUI_PREVIEWIMAGE");
		if(preview.style.display != 'block'){
			changePage(true);
		}
		return true;
	},
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            contentdown: "下拉刷新微博", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在获取新微博", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: pulldown_refresh
        },
        up: {
            contentrefresh: '正在加载...',
            callback: pullup_refresh
        }
    }
});

var topicInfoView = document.getElementById('topic_info_view');
var weiboList = document.getElementById('weiboList');

var topic_id = 0;	//话题ID
var restInfo = {topic_id: topic_id,page: 1};
var $weibo_support;
var weiboDetailWeb = null;

window.addEventListener('topicChange',function(event){
	if(topic_id != event.detail.topicId){
	    topic_id = event.detail.topicId;
		window.scrollTo(0,0);
		getDetailInfo(topic_id);
	    //配置微博的ajax请求参数
		restInfo.topic_id = topic_id;
		pulldown_refresh();
	}else{
		changePage(false);
	}
})

var getDetailInfo = function(id){
    weibo.getTopicInfo(id,function(res){
        var topicInfo = res.data;
        topicInfoView.innerHTML = template('topic_tmplt',topicInfo);
    });
}

mui.plusReady(function () {
	var selfWeb = plus.webview.currentWebview();
	$weibo_support = creat_weibo_support('weibo_support');
    mui.previewImage();
    linkUrl('.mui-scroll');		//打开外链网址
});

/*loading的加载和显示*/
var changePage = function(loading){
	document.getElementById('loading_page').style.display = loading?'block':'none';
	document.getElementById('pullrefresh').style.display = loading?'none':'block';
}

/**
 * 下拉刷新具体业务实现
 */
function pulldown_refresh() {
    setTimeout(function(){
        if(restInfo.topic_id == 0){		//防止空拉
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            return;
        }
        restInfo.page = 1;
        weibo.getWeiboInTopic(restInfo, function (res) {
            if (res.code == 200) {
                weiboList.innerHTML = '';
                for (var index in res.data) {
                    var li = get_weibo_li(res.data[index]);
                    weiboList.appendChild(li);
                }
                $weibo_support.bindSupport();
            } else {
                mui.toast(res.info);
            }
            changePage(false);
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            //重置底部加载状态
            mui('#pullrefresh').pullRefresh().refresh(true);
        });
    },1000);
}
/**
 * 上拉加载具体业务实现
 */

function pullup_refresh() {
    setTimeout(function(){
        if(!restInfo.topic_id){
            restInfo.topic_id = topic_id;
        }
        restInfo.page++;
        weibo.getWeiboInTopic(restInfo, function (res) {
            var length = typeof(res.data) == 'undefined'? 0 : res.data.length;
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(length == 10 ? false : true); //参数为true代表没有更多数据了。
            if (res.code == 200) {
                for (var i = 0; i < length; i++) {
                    var li = get_weibo_li(res.data[i]);
                    weiboList.appendChild(li);
                }
                $weibo_support.bindSupport();
            } else {
                mui.toast(res.info);
            }
        });
    },1000);
}

weibo.ext_weibo_listener('#pullrefresh');