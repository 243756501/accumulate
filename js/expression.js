Element.prototype.createExpression = function (option) {
    var $this = this;
    $this.option = option;
    $this.expressionList = [];
    var is_exist = false;		//记录表情域是否已经生成

    //初始化是设置光标在最后
    set_caret_position($this.option.target,$this.option.target.value.length)

    $this.addEventListener('tap', function () {
        document.activeElement.blur();
    	if(!is_exist){
    		is_exist = true;
            var $sliderDiv = document.createElement('div');
            $sliderDiv.setAttribute('class', 'mui-slider');
            $this.option.showDiv.appendChild($sliderDiv);
            var $group = document.createElement('div');
            $group.setAttribute('class', 'mui-slider-group mui-slider-loop');
            $sliderDiv.appendChild($group);
            var $indicator = document.createElement('div');
            $indicator.setAttribute('class', 'mui-slider-indicator');
            $sliderDiv.appendChild($indicator);

            plus.io.resolveLocalFileSystemURL("_www/images/expression/miniblog", function (entry) {
                var directoryReader = entry.createReader();
                directoryReader.readEntries(function (entries) {
                    var html_group = '';
                    var html_indicator = '';
                    var length = entries.length;
                    var result = [];
                    var firstgroup, group, lastgroup;

                    // 安卓设备将数组反转
                    if (mui.os.android) {
                        entries = entries.reverse()
                    }
                    for (var i = 0; i < length; i += 20) {
                        result.push(entries.slice(i, i + 20));
                    }
                    for (var j = 0; j < result.length; j++) {
                        group = '<div class="mui-slider-item" style="height: 170px;">';
                        if (j == 0) {
                            html_indicator += '<div class="mui-indicator mui-grid-view mui-active"></div>';
                        } else {
                            html_indicator += '<div class="mui-indicator mui-grid-view"></div>';
                        }
                        for (var k = 0; k < result[j].length; k++) {
                            var title = result[j][k].name.replace('.gif', '');
                            $this.expressionList.push('[' + title + ']');
                            group += '<div  style="float:left; padding:10px; width:14%" class="expression_tap" data-title="' + title + '"><img data-src="' + result[j][k].toRemoteURL() + '"  src="' + result[j][k].toRemoteURL() + '" style="width: 24px;height:24px;"></div>';
                        }
//
                group += '<div style="float:right;padding:11px 22px 10px 10px;width:14%" class="del_expression"><img data-src="../../images/resize.png" src="../../images/resize.png" style="margin-top:4px;"></div>';
                        group += '</div>';
                        html_group += group;
                        if (j == 0) {
                            firstgroup = group;
                        }
                        if (j + 1 == result.length) {
                            lastgroup = group;
                        }
                    }
                    $group.innerHTML = lastgroup + html_group + firstgroup;
                    $indicator.innerHTML = html_indicator;
                    var slider = mui(".mui-slider");
                    slider.slider({
                        interval: 0
                    });

                    //ios上重新载入图片
                    if (mui.os.ios) {
                        document.querySelector('.mui-slider').addEventListener('scrollend', function (event) {
                            var index = event.detail.slideNumber;
                            var $imgs = $this.option.showDiv.getElementsByClassName('mui-slider-item')[index + 1].getElementsByTagName('img');
                            for (var i = 0; i < $imgs.length; i++) {
                                $imgs[i].setAttribute('src', $imgs[i].getAttribute('data-src') + '?t=' + Math.random())
                            }
                        })
                    }

                }, function (e) {
                    console.log("Read entries failed: " + e.message);
                });

            }, function (e) {
                console.log("Resolve file URL failed: " + e.message);
            });


            mui('.mui-slider').on('tap', '.expression_tap', function (event) {
                var title = this.getAttribute('data-title');
                var textarea = $this.option.target;
                //textarea.focus();
                var pos = get_cursort_position(textarea);
                var s = textarea.value;
                textarea.value = s.substring(0, pos) + '[' + title + ']' + s.substring(pos)
                set_caret_position(textarea, pos + 2 + title.length);
            });


            mui('.mui-slider').on('tap', '.del_expression', function (event) {
                var textarea = $this.option.target;
                var pos = get_cursort_position(textarea);
                var s = textarea.value;
                var before = s.substring(0, pos);
                var after = s.substring(pos);
                var last = before.substr(before.length - 1, 1);
                if (last != ']') {
                    before = before.substring(0, before.length - 1);
                } else {
                    var lastindex = before.lastIndexOf('[');
                    var smile = before.substring(lastindex);
                    if ($this.expressionList.indexOf(smile) > -1) {
                        before = before.substring(0, lastindex);
                    } else {
                        before = before.substring(0, before.length - 1);
                    }
                }
                textarea.value = before + after;
            });

    	}
    });

    function get_cursort_position(ctrl) {//获取光标位置函数

        var CaretPos = 0;	// IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    function set_caret_position(ctrl, pos) {//设置光标位置函数
        if (ctrl.setSelectionRange) {
            //ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
        ctrl.blur();
    }


    $this.option.target.addEventListener('tap', function () {
        $this.option.showDiv.style.display = 'none';
    })

};


var get_expression_list = function () {
    var rs =  myStorage.getItem('expression_list');
    if(rs == null){
        plus.io.resolveLocalFileSystemURL("_www/images/expression/miniblog", function (entry) {
            var directoryReader = entry.createReader();
            directoryReader.readEntries(function (entries) {
                rs = {};
                // 安卓设备将数组反转
                if (mui.os.android) {
                    entries = entries.reverse()
                }
                for (var i = 0; i < entries.length; i++) {
                    var name = entries[i].name.replace('.gif', '');
                    rs[name] = entries[i].toRemoteURL();
                }

                rs = JSON.stringify(rs);
                myStorage.setItem('expression_list',rs);
            }, function (e) {
                console.log("Read entries failed: " + e.message);
            });
        }, function (e) {
            console.log("Resolve file URL failed: " + e.message);
        });
    }
    return JSON.parse(rs);
};


var get_expression = function(name){
    var list = get_expression_list();
    return list[name]+'?t='+ Math.random();
}



