var crowd = {
	openDtlWeb:function(data){
		webtools.createRptWeb('weibo-crowd-detail',function(web){
			mui.fire(web,'crowdChange',{data:data});
			web.show('pop-in',WEBTRANSTIME);
		})
	},
	
}
