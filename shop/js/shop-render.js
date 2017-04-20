var parse_shop_html = function(type,info){
	template.config('escape', true);
	var doIt = template.compile(type);
	var html = doIt(info);
	return html;
}

var render = '<img onload="load(this)" src="../../images/default_load_img.gif" data-src="{{goods_icon}}" class="cell-img"/>'+
						'<div class="event-state" >库存：<span id="repository_{{id}}">{{goods_num}}</span></div>'+
						'{{if is_new == 1}}'+
						'<img src="../../images/goods_new.png" class="goods-new-hot" width="70px"/>'+
						'{{/if}}'+ 
						'{{if is_hot == 1}}'+
						'<img src="../../images/goods_hot.png" class="goods-new-hot" width="70px"/>'+
						'{{/if}}'+ 
						'<p class="mui-ellipsis-2">{{goods_name}}</p>'+
						'<div class="mui-text-center" style="padding-left:10px;"><img src="../../images/money.png" class="goods-money" />{{money_need}}点</div>'+
						'<div id="{{id}}" class="mui-text-center changeBtn" style="padding-left:10px">'+
						'<img src="../../images/change.png" class="change"/>兑换</div>';

var render_my = '<img onload="load(this)" src="../../images/default_load_img.gif" data-src="{{goods_detail.goods_icon}}" class="cell-img" />'+
						'<div class="event-state">库存：{{goods_detail.goods_num}}</div>'+
						'{{if is_new == 1}}'+
						'<img src="../../images/goods_new.png" class="goods-new-hot" width="70px"/>'+
						'{{/if}}'+ 
						'{{if is_hot == 1}}'+
						'<img src="../../images/goods_hot.png" class="goods-new-hot" width="70px"/>'+
						'{{/if}}'+ 
						'<p>{{goods_introduct}}</p>'+
						'<div style="text-align:center;padding-bottom: 15px;"><img src="../../images/money.png" class="goods-money" />{{goods_detail.money_need}}点</div>'+
						'<span id="changeBtn" class="mui-pull-right" style="padding-right:10px">购买时间:{{createtime}}</span>';

var detail_render = '<img onload="load(this)" src="../../images/default_load_img.gif" data-src="{{goods_icon}}" style="height: 350px;width: 100%;" data-preview-src=""/>'+
						'<div class="event-detail-type">{{goods_name}}</div>'+
						'<p></p>'+
						'<span>所需积分：{{money_need}}</span> <span >库存：<span id="repository_{{id}}">{{goods_num}}</span></span>'+
						'<p>简介：{{goods_introduct}}</p>'+
						'<span>发布时间：{{createtime}}</span> <span>更新时间：{{changetime}}</span>'+
						'{{if goods_num>0}}'+
						'<div class="pay shop-join-state"  style="background: #23abf0;">兑换'+ 
                    	'</div>'+
                    	'{{else}}'+
                    	'<div class="shop-join-state"  style="background: #050505;">缺货'+ 
                    	'</div>'+
                    	'{{/if}}'+
						'<p class="mui-ellipsis-2">商品详情:{{#goods_detail}}</p>';

var title_render = '<div class="mui-popover-arrow"></div>'+
			'<ul class="mui-table-view">'+
				'{{each NewsSecond as value i}}'+
				'<li class="mui-table-view-cell"><a class="mui-ellipsis" id="{{value.id}}">{{value.title}}</a>'+
				'{{/each}}'+
			'</ul>';
			
var comment =   '<img class="avatar-image mui-pull-left" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">'+
			    '<div class="mui-media-body">'+
					'<a class="u-name"><span>{{user.nickname}}</span></a>'+
					'<div class="item-minor txt-xxs txt-color-gr">'+
						'<span class="time">{{create_time}}</span>'+
					'</div>'+
					'<p class="news-comment" style="min-height: 13px;">{{content}}</p>'+
					'<div class="mui-text-right">'+
						'<button id="reply_btn" class="comment-li-btn mui-icon mui-icon-chatbubble"></button>'+
						'<button id="delete" class="comment-li-btn mui-icon mui-icon-trash"></button>'+
					'</div>'+
				'</div>';
				
var title_render = '<div class="mui-popover-arrow"></div>'+
			'<ul class="mui-table-view">'+
				'{{each child as value i}}'+
				'<li class="mui-table-view-cell"><a id="{{value.id}}" class="mui-ellipsis">{{value.title}}</a> {{/each}}'+
			'</ul>';
