
/*分类信息列表项渲染函数*/
var parse_cat_item = function(catInfo){
	template.config('escape', false);
	var rander;
	if(eval('typeof(item_' + catInfo.entity_id + ')') != 'undefined'){
		rander = template.compile(eval('item_' + catInfo.entity_id));
	}else{
		rander = template.compile(item);
	}
	var html = rander(catInfo);
	return html;
}

/*招聘信息item*/
var item_1 = '<div class="mui-ellipsis">{{title}}</div><p class="mui-ellipsis">{{#detail_data.des.value.replace(/<[^>]+?>/g,"")}}</p>'+
			'<div class="item-house-price"><div>{{detail_data.reward.value}}</div><p>{{detail_data.place.value}}</p>'+
			'</div><p>{{create_time}}</p><p>{{detail_data.company.value}}</p>';

/*住房信息item*/
var item_2 = '<img class="cat-list-img" onload="load(this)" src="../../images/img_error.png" data-src="{{if detail_data.zhaopian1}}{{detail_data.zhaopian1.img_list.url}}{{else}}../../images/app-logo.png{{/if}}">'+
			'<div class="mui-media-body"><div class="mui-ellipsis">{{title}}</div><p>{{detail_data.daxiao.value}}平米</p>'+
			'<div class="item-house-price">{{detail_data.zujin.value}}</div>'+
			'<div>{{detail_data.shi.value}}室{{detail_data.ting.value}}厅</div><p>{{create_time}}</p></div>';

/*简历信息*/
var item_5 = '<div class="mui-ellipsis">{{title}}</div><div class="resume-list-view"><img class="cat-list-img-head" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">'+
			'<div class="mui-media-body"><div class="resume-list-text-one"><p class="mui-ellipsis">{{detail_data.des.value.replace(/<[^>]+?>/g,"")}}</p>'+
			'<p>{{create_time}}</p></div><div class="resume-list-text-two"><i class="mui-icon icon-eye"></i><p>{{read}}次</p></div></div></div>';

/*通用模板*/
var item = '<div class="mui-ellipsis">{{title}}</div><p>{{entity_name}}</p><p>{{create_time}}</p>';
