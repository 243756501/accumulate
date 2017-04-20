mui.init();

var crowdListview=document.getElementById("crowd_listview");
var commInfo={
	page:'1',
	flag:'follow'
}
var selfWeb, parentWeb= null;
mui.plusReady(function(){
	selfWeb = plus.webview.currentWebview();
	parentWeb = selfWeb.opener();
});

weibo.getCommunity(commInfo,function(res){
	if(!res.data){
		mui.toast('获取圈子列表失败~')
		return;
	}
	add_datalist_li(res.data);
})

function add_datalist_li(data)
{
	for(var index in data){
		var crowdInfo = data[index];
		var li = document.createElement('li');
		li.className = "mui-table-view-cell mui-radio mui-clearfix";
		li.id = crowdInfo.id;
		li.detail_info = crowdInfo;
	    li.innerHTML = template('crowd_choose_tpl',crowdInfo);
	    crowdListview.appendChild(li);
	}	
}
//列表点击
mui('#crowd_listview').on('tap','li',function(){
	var crowdInfo = this.detail_info;
	parentWeb.evalJS('getCrowdWeb('+ JSON.stringify(crowdInfo) +')');
	mui.back();
})
