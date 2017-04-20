(function($) {
				$.init();
				$('.mui-scroll-wrapper').scroll();
				var result = $('#result')[0];
				var btns = $('.btn');
				var pickers = {};
				btns.each(function(i, btn) {
					btn.addEventListener('tap', function() {
						var optionsJson = this.getAttribute('data-options') || '{}';
						var options = JSON.parse(optionsJson);
						var id = this.getAttribute('id');
						console.log(id);
						/*
						 * 首次显示时实例化组件
						 * 示例为了简洁，将 options 放在了按钮的 dom 上
						 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
						 */
						pickers[id] = pickers[id] || new $.DtPicker(options);
						pickers[id].show(function(rs) {
							/*
							 * rs.value 拼合后的 value
							 * rs.text 拼合后的 text
							 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
							 * rs.m 月，用法同年
							 * rs.d 日，用法同年
							 * rs.h 时，用法同年
							 * rs.i 分（minutes 的第二个字母），用法同年
							 */
//							result.innerText = '选择结果: ' + rs.text;
						console.log(rs.text);
						switch(id){
							case 'sTime':
								console.log('STIME');
								document.getElementById('sTime').innerHTML=rs.value;
							break;
							
							case 'eTime':
								console.log('ETIME');
								document.getElementById('eTime').innerHTML=rs.value;
							break;
							
							case 'time':
								console.log('TIME');
								document.getElementById('time').innerHTML=rs.value;
							break;
						}
						});
					}, false);
				});
			})(mui);
			
			
	(function ($, doc) {
        $.plusReady(function () {
        	// 隐藏滚动条
			plus.webview.currentWebview().setStyle({scrollIndicator:'none'}); 
            doc.getElementById('upload').createUploader({limit:1,title:'上传封面',input_name: 'attach_ids', showDiv: 'show_img', multiple: false});
            
            var settings = app.getSettings();
            var state = app.getState();
			
			doc.getElementById('send_btn').addEventListener('tap',function(){
//				console.log(doc.getElementById('role_id').value);
//				console.log(doc.getElementsByName('attach_ids')[0].value);
				var mCover = doc.getElementsByName('attach_ids')[0].value;
				var mTitle = doc.getElementById('title').value;
				var mPlace = doc.getElementById('place').value;
				var mContent = doc.getElementById('content').value;
				var mNumber = doc.getElementById('number').value;
				var sTimes = doc.getElementById('sTime').innerHTML;
				var eTimes = doc.getElementById('eTime').innerHTML;
				var mTime = doc.getElementById('time').innerHTML;
				var mCategory = doc.getElementById('role_id').value;
				if (settings.autoLogin && state.open_id) {
					if (mCover == ''){
						mui.toast("请上传封面");
						return;
					}
			    	if (mTitle == '') {
                    	mui.toast("标题不能为空");
                    	return;
                	}
			    	if (mPlace == ''){
			    		mui.toast("地址不能为空");
			            return;
			    	}
			    	if (sTimes == '选择日期时间...'){
			    		mui.toast("请选择开始时间");
			    		return;
			    	}
			    	if (eTimes == '选择日期时间...'){
			    		mui.toast("请选择结束时间");
			    		return;
			    	}
			    	if (mTime == '选择日期时间...'){
			    		mui.toast("请选择报名截至时间");
			    		return;
			    	}
			    	if (mNumber == ''){
			    		mui.toast("人数不能为空");
			            return;
			    	}
			    	if (mContent == ''){
			    		mui.toast("介绍不能为空");
			    		return;
			    	}else if(mContent.length<20){
			    		mui.toast("介绍不能少于20字");
			    		return;
			    	}
			    	console.log(mTime);
			    	toast.showLoading('投稿中');
			    	var sendInfo = {
			    		cover_id : mCover,
						title : mTitle,
						type_id : mCategory,
						address : mPlace,
						sTime : sTimes,
						eTime : eTimes,
						deadline : mTime,
						limitCount : mNumber,
						explain : mContent					
					}
			    	events.sendEvent(sendInfo,function(res){
			    		toast.hideLoading();
			    		if (typeof(res) == 'object') {
                            if (res.code == 200) {
								mui.toast(res.info);
                                mui.back();
                            } else {
                                mui.toast(res.info);
                            }
                        } else {
                            toast.info(res.info);
                        }
			    	})
				}else{
			 		mui.toast("未登录");
				}
				

			},false);
           
        });
    }(mui, document));