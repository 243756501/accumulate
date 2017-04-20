/**
 * 举报内容
 */
var report = function(){
	$this = this;
	$this.option = {};
	$this.create = function(opt) {
		$this.option = opt;
	};
	$this.bindResport = function(){
		var info = {
			type: $this.option.type,
			url:  $this.option.url,
			data: {"weibo-id":$this.option.id,"comment_id":$this.option.comment_id},
			content: reportContent.value || ''
		};
		for(var i = 0; i<reportName.length;i++){
			if(reportName[i].checked){
//				console.log(reportName[i].value);
				info.reason = reportName[i].value;
				if (info.content.replace(/(^\s*)|(\s*$)/g, "")==""){
					toast.info('请填写举报详情');
					return;
				}
				app.report(info,function(res){
//					console.log(JSON.stringify(res));
					if (res.code == 200){
						mui.toast("举报成功,待管理员处理...");
						setTimeout(function(){
							mui.back();
						},1000);
					}else{
						mui.toast("操作失败！");
					}
				});
				return;
			}
		}
	}
}
