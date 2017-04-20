var dragging = function(target) {
	var cont = $(target);
	var contW = cont.width();
	var contH = cont.height();
	var startX, startY, sX, sY, moveX, moveY;
	var winW = $(window).width()-100;
	var winH = $(window).height()-100;
	cont.on({ //绑定事件
		touchstart: function(e) {
			startX = e.originalEvent.targetTouches[0].pageX;
			startY = e.originalEvent.targetTouches[0].pageY;
			sX = $(this).offset().left;
			sY = $(this).offset().top;
			leftX = startX - sX;
			rightX = winW - contW + leftX;
			topY = startY - sY;
			bottomY = winH - contH + topY;
		},
		touchmove: function(e) {
			e.preventDefault();
			moveX = e.originalEvent.targetTouches[0].pageX;
			moveY = e.originalEvent.targetTouches[0].pageY;
			if(moveX < leftX) {
				moveX = leftX;
			}
			if(moveX > rightX) {
				moveX = rightX;
			}
			if(moveY < topY) {
				moveY = topY;
			}
			if(moveY > bottomY) {
				moveY = bottomY;
			}
			$(this).css({
				"left": moveX + sX - startX,
				"top": moveY + sY - startY,
			})
		}
	})
}