/**
 * Created by 駿濤 on 15-8-10.
 */


//载入配置文件--由于文件路径不统一。所以暂时先两个一起载入。以后能获取根目录时修改  todo
document.write("<script language='javascript' src='../../config.js'></script>");
document.write("<script language='javascript' src='../../js/app.js'></script>");

var httpRequest = function() {
	var $this = this;
	$this.data = {};
	$this.host = APP_BASE.domain + '/api/';
	$this.addData = function(key, value) {
		if(!value)return;
		$this.data[key] = value;
	};
	$this.request = function(url, method, callback, asynch) {
		asynch = asynch == null ? true : asynch;
		var data = new FormData();
		var appVersion = app.getVersion();
		data.append('version', appVersion);
		data.append('method', method);
		data.append('access_token', APP_BASE.access_token);
		data.append('open_id', app.getState().open_id || '');
		for (key in $this.data) {
			data.append(key, $this.data[key]);
		}

		var XML = new XMLHttpRequest();
		var XMLtimeout = setTimeout(function(){
			toast.info('网络连接超时，请检查网络');
			if(XML)XML.abort();
		},80000);
		XML.onreadystatechange = function() {
			if (XML.readyState == 4) {
				var result;
				if(XMLtimeout)clearTimeout(XMLtimeout);		//模拟的超时处理机制
				try{
					result = JSON.parse(XML.responseText);
				}catch(e){
//					var errorInfo = XML.responseText.match(/<p class="font">[^<]+<\/p>/g);
					console.log(XML.responseText);
					toast.hideLoading();
					if(e instanceof SyntaxError){
						console.log('错误的数据接口：' + url);
					}
					result = {info:'接口错误',code:400};
				}
				callback(result);
			}
		};
		XML.open('POST', $this.host + url, asynch);
		XML.send(data);
	};

	$this.get = function(url, callback, asynch) {
		$this.request(url, 'GET', callback, asynch)
	};

	$this.post = function(url, callback, asynch) {
		$this.request(url, 'POST', callback, asynch)
	};

	$this.put = function(url, callback, asynch) {
		$this.request(url, 'PUT', callback, asynch)
	};

	$this.delete = function(url, callback, asynch) {
		$this.request(url, 'DELETE', callback, asynch)
	}
};


var toast = {
	info: function(msg) {
		mui.toast(msg);
	},
	showLoading: function(msg) {
		plus.nativeUI.showWaiting(msg);
	},
	hideLoading: function() {
		plus.nativeUI.closeWaiting();
	}
};


var is_login = function() {
	var settings = app.getSettings();
	var state = app.getState();
	if (settings.autoLogin && state.open_id) {
		return state.uid;
	} else {
		return 0;
	}

};


var get_from = function() {
	return plus.device.model;
};

var get_parent_node = function($this, find) {
	var first = find.substring(0, 1);
	if (first == '.') {
		var class_name = find.substr(1);

		var check = $this.parentNode.classList.contains(class_name);
	}
	if (first == '#') {
		var id_name = find.substr(1);
		var check = $this.parentNode.getAttribute('id') == id_name;
	}

	if (first != '.' && first != '#') {
		var check = $this.parentNode.nodeName == find.toUpperCase();
	}

	if (check) {
		return $this.parentNode;
	} else {
		return get_parent_node($this.parentNode, find);
	}

};


String.prototype.parseContent = function() {

	return this.parseExpression();

};

String.prototype.parseExpression = function() {
	var string = this;
	//var content = string.replace(/\[(.+?)\]/g, '<img class="expression_img" data-src="../../images/expression/miniblog/$1.gif" src="../../images/expression/miniblog/$1.gif"/>'); // todo 暂时使用相对路径

	var content = string.replace(/\[(.+?)\]/g, function(find) {
		find = find.replace('[', '').replace(']', '');
		if (find.indexOf(':') == -1) {
			return ' <img class="expression_img" data-src="../../images/expression/miniblog/' + find + '.gif" src="../../images/expression/miniblog/' + find + '.gif"/>';
		} else {
			return '[' + find + ']';
		}
	});
	var url_regex = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
	if(url_regex.test(content)){
		var tempstr = content.match(url_regex)[0];
		content = content.replace(url_regex,'<diyurl style="color: #008CEE;">'+ tempstr +'</diyurl>');
	}
	return content;

};

var linkUrl = function(viewTag){
	/*打开外部链接*/
	mui(viewTag).on('tap','diyurl',function(event){
		event.stopPropagation();
		var tagUrl = this.innerText;
		if(tagUrl.indexOf('http') < 0){
			tagUrl = 'https://' + tagUrl;
		}
		plus.runtime.openURL(tagUrl,function(err){});
	},false);
	
	/*打开用户中心*/
	mui(viewTag).on('tap','.user-at',function(event){
		event.stopPropagation();
		var uid = this.getAttribute('data-user-id');
		if(uid && uid > 0){
			webtools.createRptWeb('../../ucenter/view/usercenter',function(rptWeb){
				mui.fire(rptWeb, 'usercenterChange', {
					data: uid
				});
				rptWeb.show('pop-in', 300);
			});
		}else{
			mui.toast('不存在或者异常的用户');
		}
	},false)
}

/**
 * 计算输入框剩余可输字数。
 */
var setShowLength = function(obj, maxlength, id) {
	var rem = maxlength - obj.value.length;
	var wid = id;
	if (rem < 0) {
		rem = 0;
	}
	document.getElementById(wid).innerHTML = rem;
};