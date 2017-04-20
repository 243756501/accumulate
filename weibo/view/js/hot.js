mui.init({
	beforeback: function(){
		plus.webview.currentWebview().hide('slide-out-right');
		return false;
	}
})
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
var day_hot_list = document.getElementById('day_hot_list');
var week_hot_list = document.getElementById('week_hot_list');
var flushBtn = document.getElementById('flushBtn');
var botmTips = null;
var dayTopicPage = 1;
var weekTopicPage =1;
var topicHeadWeb = null;	//预载的话题页面
var block = true;

document.querySelector('#sliderView').addEventListener('slide', function(event) {
    if (event.detail.slideNumber === 0) {
        restInfo.type = 1;
    }else{
        restInfo.type = 2;
    }
});
var restInfo = {type: 1, page: 1,};

/*loading的加载和显示*/
var changePage = function(loading){
	document.getElementById('loading_page').style.display = loading?'block':'none';
	document.getElementById('pullrefresh').style.display = loading?'none':'block';
}

//初始化24小时热门列表
var initDayList = function(){
    block = false;
    weibo.getHotTopic(restInfo, function(res) {
        if (res.code == 200) {
            var li = getTopicLi(res, restInfo.page);
            day_hot_list.innerHTML = '';
            day_hot_list.appendChild(li);
        }
        changePage(false);
		initWeekList();
        block = true;
    });
}

//初始化7日热门列表
var initWeekList = function(){
	block = false;
    restInfo.type = 2;
    weibo.getHotTopic(restInfo, function(res) {
        if (res.code == 200) {
            var li = getTopicLi(res, restInfo.page);
            week_hot_list.innerHTML = '';
            week_hot_list.appendChild(li);
            changePage(false);
        }
        block = true;
    });
}

//得到一个列表Li
function getTopicLi(res, page) {
    var li = document.createElement('templi');
    res.page = page;
    var html = template('hot_topic_li', res);
    li.innerHTML = html;
    return li;
}

//刷新列表按钮
flushBtn.addEventListener('tap',function(){
	changePage(true);
    restInfo.page = 1;
    if(restInfo.type == 1){
        dayTopicPage = 1;
        initDayList();
        mui('#dayScrollWp').scroll().scrollTo(0,0);
        botmTips[0].style.display = 'block';
    }else{
        weekTopicPage = 1;
        initWeekList();
        mui('#weekScrollWp').scroll().scrollTo(0,0);
        botmTips[1].style.display = 'block';
    }
});

mui.plusReady(function() {
	
	initDayList();
	
    mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
        mui(pullRefreshEl).pullToRefresh({
            up: {
                callback: function() {
                    if(block){
                        block = false;
                        var self = this;
                        setTimeout(function() {
                            if (index == 0) {
                                restInfo.type = 1;
                                dayTopicPage++;
                                restInfo.page = dayTopicPage;
                                weibo.getHotTopic(restInfo, function(res) {
                                    if (res.code == 200) {
                                        var li = getTopicLi(res, restInfo.page);
                                        day_hot_list.appendChild(li);
                                        if (res.data.length == 0) {
                                            dayTopicPage--;
                                        }
                                        if(res.data.length < 10){
                                        	botmTips[0].style.display = 'none';
                                        }
                                    }
                                    block = true;
                                });
                            } else {
                                block = false;
                                restInfo.type = 2;
                                weekTopicPage++;
                                restInfo.page = weekTopicPage;
                                weibo.getHotTopic(restInfo, function(res) {
                                    if (res.code == 200) {
                                        var li = getTopicLi(res, restInfo.page);
                                        week_hot_list.appendChild(li);
                                        if (res.data.length == 0) {
                                            weekTopicPage--;
                                        }
                                        if(res.data.length < 10){
                                        	botmTips[1].style.display = 'none';
                                        }
                                    }
                                    block = true;
                                });
                            }
                            self.endPullUpToRefresh();
                        }, 1500);
                    }else{
                    	return;
                    }
                }
            }
        });
    });
    botmTips = mui('.mui-pull-bottom-tips');
    topicHeadWeb = mui.preload(
	    {
	      url:'weibo-topic-header.html',
	      id:'weibo-topic-header'
		}
    )
    
    //给每个li分发点击事件
    mui('.mui-slider-group').on('tap','li',function(e){
		if(!topicHeadWeb){
	        topicHeadWeb = plus.webview.getWebviewById('weibo-topic-header');
		}
		var topicWeb = plus.webview.getWebviewById('weibo-topic-body');
    	mui.fire(topicWeb,'topicChange',{topicId:this.id});
        topicHeadWeb.show('slide-in-right');
    });
});