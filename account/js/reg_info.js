mui.init();

var selfWeb,exObjs,doneFlag = null;

var openNext = function(){
	if(exObjs.length){
		webtools.openSingleWeb(exObjs[0],exObjs);
	}
}
mui.plusReady(function () {
    selfWeb = plus.webview.currentWebview();
    exObjs = selfWeb.data;
    exObjs.shift();
    
    var old_back = mui.back;
    mui.back = function(){
    	if(exObjs.length){
			mui.confirm('必要的资料填写未完成，账号处于未激活状态！','重要提示',['取消','确认'],function(e){
				if(e.index ==1){
					old_back();
				}
			});
		}else{
			old_back();
		}
    }
})