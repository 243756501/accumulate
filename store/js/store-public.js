
var goods_li_click = function(groupView){
	mui(groupView).on('tap','.goods-item',function(e){
		e.stopPropagation();
		var goodsId = this.id;
		if(!godsDetlWeb){
			godsDetlWeb = plus.webview.getWebviewById('store-goods-detail');
		}
		mui.fire(godsDetlWeb,'storeGoodsChange',{goodsId:goodsId});
		godsDetlWeb.show('slide-in-right',300);
	})
};


/*商品item*/
var get_goods_li = function(goodsInfo){
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell goods-item';
	li.id = goodsInfo.id;
	li.innerHTML = goods_list_render(goodsInfo);
	return li;
}