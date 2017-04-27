var WEBTRANSTIME = 300; //页面转场动画持续时间(单位ms
var webtools = {
	/**
	 * 通用打开各模块的详情页面
	 * @param {String} modName 模块名称
	 * @param {Object} extData 目标ID
	 * @param {String} eventName 事件名
	 */
	openDtlWeb: function(modName, extData, eventName) {
		var webUrl = '../../' + modName + '/view/' + modName + '-detail';
		eventName = eventName || modName + 'Change';
		webtools.createRptWeb(webUrl, function(rptWeb) {
			mui.fire(rptWeb, eventName, {
				data: extData
			});
			rptWeb.show('pop-in', WEBTRANSTIME);
		});
	},

	/**
	 * 通用打开预载页面
	 * @param {String} webUrl 目标页面路径(不含.html)
	 */
	createRptWeb: function(webUrl, callback) {
		callback = callback || mui.noop;
		var webId = webUrl;
		if(~webId.indexOf('/')) {
			webId = webId.substr(webId.lastIndexOf('/') + 1);
		}
		var dtlWeb = plus.webview.getWebviewById(webId);
		if(!dtlWeb) {
			dtlWeb = mui.preload({
				url: webUrl + '.html',
				id: webId,
			});
			setTimeout(function() {
				callback(dtlWeb);
			}, 300)
		} else {
			callback(dtlWeb);
		}
	},

	/**
	 * 通用打开一次性使用页面
	 * @param {String} webUrl 目标页面路径(不含.html)
	 * @param {Object} extData 传递数据
	 * @param {String} anima 页面切换动画
	 * @param {int} drtTime 动画持续时间
	 */
	openSingleWeb: function(webUrl, extData, anima, drtTime) {
		anima = anima || "pop-in";
		drtTime = drtTime || WEBTRANSTIME;
		var webId = webUrl;
		if(~webId.indexOf('/')) {
			webId = webId.substr(webId.lastIndexOf('/') + 1);
		}
		mui.openWindow({
			url: webUrl + '.html',
			id: webId,
			extras: {
				data: extData
			},
			styles: {
				scrollIndicator: 'none'
			},
			show: {
				aniShow: anima,
				duration: drtTime
			},
			createNew: false,
			waiting: {
				autoShow: false
			}
		})
	},

	/**
	 * @param {String} webId
	 */
	closeWeb: function(webId) {
		var webView = plus.webview.getWebviewById(webId);
		if(webView) {
			webView.close('none');
		}
	},

	/*查看已创建的webview,主要用于测试使用*/
	showAllWeb: function() {
		var arr = plus.webview.all();
		console.log(arr.length);
		for(i in arr) {
			console.log(arr[i].id);
		}
	},
	/*测试函数的运行时间*/
	testTime: function(callback, time) {
		time = time || 1;
		var start = new Date().getTime(); //起始时间
		for(var i = 0; i < time; i++) {
			callback(); //执行待测函数
		}
		var end = new Date().getTime(); //结束时间
		console.log('总耗时：' + (end - start) + "ms|<><>|平均耗时：" + (end - start) / time + 'ms');
		return end - start; //返回函数执行需要时间
	}
};

//APP工具类
var apptools = {
	/*
	 * 表格清空工具
	 * @param{obj}
	 */
	clearTable: function(targetId) {
		var table = document.getElementById(targetId),
			trs = table.getElementsByTagName("tr");
		for(var i = trs.length - 1; i > 0; i--) {
			table.deleteRow(i);
		}
	},

	/**
	 * 过滤html文本
	 * @param {String} str
	 */
	htmlStr: function(str) {
		return str.replace(/<[^>]*>/g, '');
	},
	/**
	 * 过滤@原本的输入形式为@xxxx
	 * @param {String} str
	 */
	atCompile: function(str) {
		var compileStr = str.replace(/( @[^ ]* )/g, function(word) {
			return '[at:' + atArray[word] + ']';
		});
		return compileStr;
	},
	/**
	 * 过滤发送文本中的\n为<br>
	 * @param {String} str
	 */
	newlineCompile: function(str) {
		var compileStr = str.replace(/\n/g, '<br>');
		return compileStr;
	},
	/**
	 * 获得合格的网络地址
	 * @param {String} str
	 */
	netUrl: function(str) {
		if(!~str.indexOf('http://') && !~str.indexOf('https://')) {
			return 'http://' + str;
		}
		return str;
	},

	/**
	 * 键盘确认键监听器
	 * @param {Function} callback
	 */
	lisEnter: function(callback) {
		window.addEventListener('keypress', function(e) {
			if(e.keyCode == 13) {
				callback();
			}
		})
	},

	/**从html文本里面提取img标签的图片url
	 * @param {String} richText 含有img标签的html文本
	 * @param {Boolean} flag	是否提取所有图片
	 */
	getCover: function(richText, flag) {
		var urls = [];
		if(richText) {
			var regex = /<img[^>]*src=['"]([^'"]+)[^>]*>/;
			regex = flag ? eval(regex + 'gi') : eval(regex + 'i');
			richText.replace(regex, function(match, imgUrl) {
				if(!~imgUrl.indexOf('http')) {
					imgUrl = APP_BASE.domain + imgUrl;
				}
				urls.push(imgUrl);
			});
		}
		return urls;
	},

	/*
	 * 避免软键盘弹出屏幕变小导致底部栏上推
	 * @param{object} nav对象的id
	 */
	fixNavposition: function(nav) {
		//设置bottom绝对位置
		document.getElementById(nav).style.top = (plus.display.resolutionHeight - 50) + "px";
	},

	/**
	 * 将秒数格式化时间
	 * @param {string|number} seconds 整数类型的秒数
	 * @return {string} time 格式化之后的时间
	 */
	timeToStr: function(seconds) {
		var min = Math.floor(seconds / 60),
			second = seconds % 60,
			hour, newMin, time;

		if(min > 60) {
			hour = Math.floor(min / 60);
			newMin = min % 60;
		}
		if(second < 10) {
			second = '0' + second;
		}
		if(newMin < 10) {
			min = '0' + newMin;
		}

		return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
	},

	/**
	 * 显示/隐藏标签
	 * @param {Object} dom DomId或者Dom
	 */
	toggleDom: function(dom, toggle) {
		if(typeof(dom) == 'string') {
			dom = document.getElementById(dom);
		}
		dom.style.display = toggle ? 'initial' : 'none';
	},

	/**
	 * 隐藏标签
	 * @param {Object} dom DomId或者Dom
	 */
	hideDom: function(dom) {
		apptools.toggleDom(dom, 0);
	},

	/**
	 * 显示标签
	 * @param {Object} dom DomId或者Dom
	 */
	showDom: function(dom) {
		apptools.toggleDom(dom, 1);
	},

	/*删除指定文件*/
	delFile: function(locaPath, callback) {
		callback = callback || mui.noop;
		plus.io.resolveLocalFileSystemURL(locaPath, function(entry) {
			entry.remove(function(entry) {
				callback(1);
			}, function(e) {
				callback(0);
			});
		});
	},

	/*格式化待发送的富文本*/
	fmtRichText: function(content, imgPaths) {
		var str = '';
		for(var name in imgPaths) {
			var imageId = '[#' + name + '#]';
			content = content.replace(imageId, '<br><img src="' + imgPaths[name].path + '"/>');
		}
		str = content.replace(/[#imgage[0-9]+#]/g, '');
		return str;
	},

	/*去除数组里重复的元素*/
	uniqueArr: function(array) {
		var r = [];
		for(var i = 0, l = array.length; i < l; i++) {
			for(var j = i + 1; j < l; j++)
				if(array[i] === array[j]) j = ++i;
			r.push(array[i]);
		}
		return r;
	},

	/*把版本号转为3位有效数字*/
	fmtVersion: function(str) {
		var arr = [];
		var version = 0;
		if(str) {
			arr = str.split('.');
			version = parseInt((arr[0] || '0') + (arr[1] || '0') + (arr[2] || '0'));
		}
		return version;
	},

	/*选中控件字体颜色改变*/
	setOkcolor: function(dom) {
		dom.style.color = '#5AE05A';
	},
	/*
	 * 时间戳转日期
	 * @param{Object} sTime
	 */
	getLocalTime: function(nS) {
		return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
	},
	/**
	 * 时间戳友好解析
	 * @param {Object} sTime
	 */
	friendlyDate: function(sTime) {
		if(!sTime) return '';
		if(sTime.toString().length > 10) sTime = sTime / 1000;

		var myDate = new Date(sTime * 1000);
		var myHours = myDate.getHours();
		var myMin = myDate.getMinutes();
		myHours = myHours < 10 ? '0' + myHours : myHours;
		myMin = myMin < 10 ? '0' + myMin : myMin;
		var timeStr = myHours + ':' + myMin;
		var dayStr = myDate.getMonth() + 1 + '-' + myDate.getDate();

		//sTime=源时间，cTime=当前时间，dTime=时间差
		var cTime = new Date()
		var dTime = Date.parse(cTime) / 1000 - sTime;
		var dDay = cTime.getDate() - myDate.getDate();
		var dMonth = cTime.getMonth() - myDate.getMonth();
		var dYear = cTime.getFullYear() - myDate.getFullYear();
		if(dTime < 60) {
			dTime = dTime > 0 ? dTime : 0;
			return dTime + '秒前';
		} else if(dTime < 3600) {
			return Math.floor(dTime / 60) + '分钟前';
			//今天的数据.年份相同.日期相同.
		} else if(dYear == 0 && dMonth == 0 && dDay < 1) {
			return '今天 ' + timeStr;
		} else if(dYear == 0 && dMonth == 0 && dDay < 2) {
			return '昨天 ' + timeStr;
		} else if(dYear == 0) {
			return myDate.getMonth() + 1 + '月' + myDate.getDate() + '日 ' + timeStr;
		} else {
			return myDate.getFullYear() + '-' + dayStr;
		}
	},

	/**
	 * 时间戳解析 改
	 * @param {int} unixTime
	 * @param {Object} type
	 */
	fmtUnixTime: function(unixTime, type) {
		return apptools.friendlyDate(unixTime);
	},

	//给页面注册一个失去焦点事件，专用于解决ios系统下input控件不会自动失去焦点
	webBlur: function() {
		window.addEventListener('touchstart', function(e) {
			if(e.target.tagName != "INPUT") {
				document.activeElement.blur();
			}
		})
	},

	/*验证码验证*/
	checkScore: function(need, have) {
		if(have - need < 0) {
			mui.alert('余额不足');
			return false;
		}
		return true;
	},

	/*验证码验证*/
	checkVerify: function(verify) {
		if(!verify.trim()) {
			mui.alert('验证码不能为空');
			return false;
		}
		return true;
	},

	/*密码验证*/
	checkPassword: function(password) {
		var pswRegx = /^\w{6,20}$/;
		if(!pswRegx.test(password)) {
			mui.alert('密码格式错误,需要6-20位非特殊字符');
			return false;
		}
		return true;
	},

	/*验证手机*/
	checkMobile: function(tel) {
		var mblRegx = /^1[3|4|5|7|8]\d{9}$/;
		if(!mblRegx.test(tel)) {
			mui.alert('请输入正确的手机号码');
			return false;
		}
		return true;
	},

	/*邮箱验证*/
	checkEmail: function(email) {
		var emlRegx = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/;
		if(!email || !emlRegx.test(email)) {
			mui.alert('请输入正确的邮箱');
			return false;
		}
		return true;
	},

	/**
	 * 检查用户组权限(判断group1和group2是否有交集)
	 * @param {Array} group1
	 * @param {Array} group2
	 */
	checkPms: function(group1, group2) {
		for(var i in group1) {
			for(var j in group2) {
				if(group1[i] == group2[j]) {
					return true;
				}
			}
		}
		return false;
	},

	//关闭页面
	finish: function(thisWeb) {
		thisWeb.close();
	},

	/**
	 * 判断指定控件是否显示
	 */
	domIsVisible: function(dom) {
		if(dom.style.display == "block" || dom.style.display == "") {
			return true;
		} else if(dom.style.display == "none") {
			return false;
		}
	},

	/**
	 * 生成论坛形式楼层
	 */
	createFloor: function(floor) {
		if(floor == 1) {
			floor = '沙发';
		} else if(floor == 2) {
			floor = '板凳';
		} else if(floor == 3) {
			floor = '地板';
		} else {
			floor = '第' + floor + '楼';
		}
		return floor;
	},

	/*打开软键盘*/
	showKeyboard: function() {
		if(mui.os.ios) {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			//var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
			imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
			//alert("ll");
		}
	},

	/*时间戳格式化*/
	formatDate: function(tempDate) {
		var year = tempDate.getFullYear();
		var month = tempDate.getMonth() + 1;
		var date = tempDate.getDate();
		var hour = tempDate.getHours();
		var minute = tempDate.getMinutes();
		var second = tempDate.getSeconds();
		return month + "-" + date + "   " + hour + ":" + minute;
	},

	/*给页面注册一个双击返回键退出APP的事件*/
	exitApp: function() {
		//处理逻辑：1秒内，连续两次按返回键，则退出应用；

		var first = null;
		mui.back = function() {
			//首次按键，提示‘再按一次退出应用’
			if(!first) {
				if(mui.os.ios) {
					document.activeElement.blur();
				}
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if(new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		};
	},

	/*向数组的首位添加一个非重复的元素*/
	addEle: function(arr, ele) {
		if(ele != '' && arr.indexOf(ele) < 0) {
			arr.unshift(ele);
		}
		return arr;
	},

	//创建一个本地通知消息
	creatMsg: function(msg) {
		var pushSwich = myStorage.getItem('push_in_notice');
		var options = {
			title: msg.title,
			cover: false
		};

		if(!pushSwich || pushSwich == 1) {
			plus.push.createMessage(msg.content, JSON.stringify(msg.data), options);
		}
	},

	/**
	 * 复写MUI一级选择器的隐藏方法，用于自定义样式的选择器触发样式
	 * 筑易触发器结构样式
	 */
	pickerHide: function(picker, dom) {
		picker.hide = function() {
			dom.parentNode.classList.remove('mui-active');
			var self = this;
			if(self.disposed) return;
			self.panel.classList.remove(mui.className('active'));
			self.mask.close();
			document.body.classList.remove(mui.className('poppicker-active-for-page'));
			//处理物理返回键
			mui.back = self.__back;
		}
	}
};

/*按钮计时器对象*/
var DecTime = function(obj, time) {
	$this = this;
	this.Obj = obj;
	this.initText = obj.innerHTML;
	this.time = time;
	this.setTime = function(time) {
		$this.time = time;
	};
	this.dec_time = function() {
		if($this.time > 0) {
			$this.Obj.disabled = true;
			$this.Obj.innerHTML = "重新获取" + $this.time-- + 'S';
			setTimeout($this.dec_time, 1000)
		} else {
			$this.Obj.innerHTML = $this.initText;
			$this.Obj.disabled = false;
		}
	};
	this.dec_time();
	return $this;
};

/*loading的加载和显示*/
var changePage = function(loadDiv, pageDiv, loading) {

	if(loadDiv) loadDiv.style.display = loading ? 'block' : 'none';
	if(pageDiv) pageDiv.style.display = loading ? 'none' : 'block';
};

/**
 * 回到顶部
 */
var goTop = function(thisWeb) {
	var headChidWebArr = thisWeb.children();
	if(headChidWebArr.length >= 1) { //判断是否存在子页面，如果不存在则直接对本页面进行回顶操作
		for(index in headChidWebArr) {
			if(headChidWebArr[index].isVisible()) { //只对当前显示的页面进行回顶操作      				
				headChidWebArr[index].evalJS('window.scrollTo(0,0)');
			}
		}
	} else {
		thisWeb.evalJS('window.scrollTo(0,0)');
	}
};

/*判断webview是否已经生成*/
var is_create = function(webId) {
	return !!plus.webview.getWebviewById(webId);
};

var createMsk = function() {
	masking = document.createElement('div');
	var sHeight = plus.screen.resolutionHeight;
	var fHeight = parseInt(show_comment.style.height);
	var mHeight = sHeight - fHeight;
	masking.style.height = (mHeight - 20) + 'px'
	masking.className = 'masking';
	document.body.appendChild(masking);
	masking.addEventListener('tap', function() {
		show_comment.style.display = 'none';
		show_foot.style.display = 'block';
		masking.style.display = 'none';
		//关闭软键盘
		document.activeElement.blur();
	})
}

//调用自定义的active样式
var useMyownActiveStyle = function(targetdom, slide) {
	mui(targetdom).each(function(index) {
		//监听状态
		var active = this.className;
		//初始状态
		if(index == 0) {
			if(active == 'mui-control-item mui-active') {
				this.style.cssText = "border-bottom: 2px solid #1aBC9C;color:#000000";
				return;
			}
		}
	})
	document.getElementById(slide).addEventListener('slide', function() {
		setTimeout(function() {
			mui(targetdom).each(function(index) {
				var active = this.className;
				//判断如果是激活的状态
				if(active == 'mui-control-item mui-active') {
					this.style.cssText = "border-bottom: 2px solid #1aBC9C;color:#000000";
				} else {
					this.style.cssText = "border-bottom: 2px solid #FFFFFF;color:color: #808080"
				}
			})
		}, 1)

	})
}