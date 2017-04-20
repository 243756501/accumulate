## 简单概述
OpenSNS H5客户端

## 核心功能
1. 启动App后校验登录状态，若已登录，直接跳转应用首页；否则，显示登录页面；
2. 支持动态切换 显示或隐藏模板；
3. 现有微博、论坛、资讯、找人、活动、问答、积分商城、微店等木块；


## 开发注意：
	数据封装统一使用id,data-*,detail_info--三种方式;
	1.id,data-*,可以混用.
	  eg:div.id=“weibo_100”;div.setAttribute('data-id',"100");
	
	2.detail_info主要用于封装json格式的数据对象,方便取出来直接就是json格式的object.
	  eg:div.detail_info = weiboInfo;
	3.需要用以注册事件的class名命名方式：event-事件名;