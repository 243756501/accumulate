/**
 * Created by Administrator on 15-11-19.
 */

/*登陆悟空*/
var wk_login_token = function () {

    var token = sessionStorage["token"];
    if (token) {
        token = JSON.parse(token);
        WKim.auth.login(token).then(function (token) {
        });
    }
};


var get_user_info = function(id){
    return JSON.parse(sessionStorage['user_info_'+id]) ;
}
/*获取会话列表*/
var get_conv_list = function () {
    $('#chat_body').html('');
    wk_conversion.getList(0, 20, function (res) {
        for (var i = 0; i < res.length; i++) {
            console.log(JSON.stringify(res[i]));
            if (res[i].isSingleChat) {
                var data = res[i];
                var other_id = res[i].peerId();
                data.user =  get_user_info(other_id);
                if (typeof get_user_info(other_id) != 'undefined') {
                    var html = template('my_chat_list', data);
                    $('#chat_body').append(html);
                    if ($('#wk_message_frame_' + other_id).css('display') == 'block') {
                        $('#chat_' + other_id).find('.other .un_read').html('');
                    }
                }
            }
        }
        bink_create_conv_click();


    })
};

var wk_insertFace = function (obj) {
    insertFace(obj);
    $('.sanjiao').remove();
}

/*弹出会话框*/
var show_chat_frame = function (callback) {
    callback = callback || $.noop;
    var $div = $('#wk_content');
    if ($div.css('display') == 'none') {
        toast.showLoading();
        $div.show();
        $.get(chat_list_url, {}, function (html) {
            toast.hideLoading();
            $div.html(html);
            callback();
        })
    }else{
        callback();
    }
}

/*创建会话*/
var creat_conv = function (id) {
    $('#chat_' + id).find('.other .un_read').html('')
    wk_conversion.create(id, function (res) {
        wk_message.$conv = res;
        $('#message_body').html('  <div class="wk_message_frame"  data-id="' + id + '" id="wk_message_frame_' + id + '"></div>');
        wk_message.getNextList(null, 20, function (res) {
            first = res[0];
            render_message_list(id, res);



            $('#message_list').find('.header h2').text( get_user_info(id).nickname)
            $('#message_list').show()
            go_to_frame_bottom();
            bind_scroll();
            $('[name="send_wk_message"]').focus();
        });

    });
}

/*绑定创建会话的按钮*/
var bink_create_conv_click = function () {
    $('[data-role="create_conv"]').unbind('click');
    $('[data-role="create_conv"]').click(function () {
        var $this = $(this);
        var id = $this.attr('data-uid');
        creat_conv(id);
    })
}

/*绑定滚动刷新*/
var bind_scroll = function () {
    $('.wk_message_frame').scroll(function () {
        var $this = $(this);
        var id = $this.attr('data-id');
        if ($this.scrollTop() == 0) {
            if (typeof first != 'undefined' && first != {}) {
                $('#wk_message_frame_' + id).prepend(' <li id="msg_tip" class="time text-center clearfix " style="color: #f0d1d1"></li>')

                var first_id = first.baseMessage.messageId;
                $('#msg_tip').html('载入中...')
                wk_message.getNextList(first, 20, function (res) {
                    $('#msg_tip').html('')
                    first = res[0];
                    for (var i = res.length - 1; i >= 0; i--) {
                        var data = {};
                        data.msg = res[i];
                        if (res[i].isMe()) {
                            data.user = myInfo;
                            data.is_me = true;
                        } else {
                            data.user =   get_user_info(get_other_id(res[i]));
                            data.is_me = false;
                        }
                        var html = template('my_message', data);
                        $('#wk_message_frame_' + id).prepend(html)
                    }
                    //location.hash = '#wk_msg_'+first_id;
                    $('.wk_message_frame').scrollTop($('#wk_msg_' + first_id).offset().top - $('.wk_message_frame').offset().top);

                })
            } else {
                $('#msg_tip').html('没有记录了')
            }
        }
    });
};

/*加载会话列表*/
var prepend_chat_list = function (html) {
    $('#chat_list').prepend(html);
    bind_magnific();
};

/*获取聊天对象的id*/
var get_other_id = function (msg) {
    var mid = WKim.auth.getOpenId().toString();
    var ids = msg.getConvId();
    ids = ids.split(':');
    var index = $.inArray(mid, ids)
    return ids[index == 0 ? 1 : 0];
};

/*渲染对话*/
var render_message_list = function (id, list) {

    for (var i = 0; i < list.length; i++) {
        var data = {};
        data.msg = list[i];
        if (list[i].isMe()) {
            data.user = myInfo;
            data.is_me = true;
        } else {
            data.user =  get_user_info(get_other_id(list[i])) ;
            data.is_me = false;
        }
        var html = template('my_message', data);
        $('#wk_message_frame_' + id).append(html)
    }

}


var go_to_frame_bottom = function () {
    var div = $('.wk_message_frame');
    div.scrollTop(9999);
};

String.prototype.time_format = function () {
    var string = this;
    var newDate = new Date();
    newDate.setTime(string);
    return newDate.format('yyyy-MM-dd hh:mm:ss');
};


String.prototype.time_format_friendly = function () {
    var string = this;
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var newDate = new Date();
    newDate.setTime(string);
    if (parseFloat(string) < today.getTime()) {
        return newDate.format('MM-dd');
    } else {
        return newDate.format('hh:mm');
    }


};

String.prototype.check_is_me = function () {
    var openid = this;
    var res = WKim.auth.getOpenId() == openid ? true : false
    return  res;
};


/*重要 悟空会话对象*/
var wk_conversion = {

    /**
     * 创建会话
     * @method create
     * @param {object} options
     * @return {promise}
     */
    create: function (openid, callback) {
        var title = '[' + WKim.auth.getOpenId() + ']与[' + openid + ']的聊天';
        if (typeof openid == 'object') {
            if (openid.length > 1) {
                title = '群聊';
            }
        } else {
            openid = [openid];
        }

        // 例如
        var options = {
            openIds: openid,
            title: title, // 仅群聊有效
            icon: "11", // 仅群聊有效
            map: {"a": "123"},
            tag: 0
        };

        WKim.conversation.create(options).then(function (Conv) {
            callback(Conv);
            // 得到会话实例Conv，可使用其成员方法
        });
        // return '';
    },

    /**
     * 删除会话
     * @param cid
     * @param callback
     */
    remove: function (cid, callback) {
        WKim.conversation.remove(cid).then(function (res) {
            callback(res)
        });

    },


    /**
     * 获取会话列表
     * @method list
     * @param {long} cursor 游标位置
     * @param {int} count 数量
     * @return {object} convList
     * @return {promise}
     */
    getList: function (cursor, count, callback) {
        WKim.conversation.list(cursor, count).then(function (convList) {
            callback(convList);
        });
    },


    /**
     * 获取一个会话对象
     * @method get
     * @param {string} cid conversationId
     * @return {object} conv instance
     * @return {promise}
     */
    getConv: function (cid, callback) {
        WKim.conversation.get(cid).then(function (Conv) {
            callback(Conv);
            //
        });
    }


};


var wk_message = {
    $conv: '',
    sendText: function (txt, callback) {
        txt = txt.htmlEncode();
        this.$conv.sendText(txt).then(function (res) {
            // console.log(JSON.stringify(res));
            callback(res)
        });
    },

    getNextList: function (msg, count, callback) {

        this.$conv.listNextMessages(msg, count).then(function (res) {
            // console.log(JSON.stringify(res));
            callback(res)
        });
    },

    getPreviousList: function (msg, count, callback) {
        this.$conv.listPreviousMessages(msg, count).then(function (res) {
            //   console.log(JSON.stringify(res));
            callback(res)
        });
    },
    getMessage: function (id) {

        return this.$conv.getMsgById([id]);

    },

    readMessage: function (id) {
        this.$conv.read(id);
    }



};


var bind_magnific = function () {

    $('[data-role="chat"]').magnificPopup({
        type: 'ajax',
        overflowY: 'scroll',
        modal: true,

        callbacks: {
            ajaxContentAdded: function () {
                // Ajax content is loaded and appended to DOM
                $('[name="send_wk_message"]').focus();
            }, open: function () {
                $('.mfp-bg').css('opacity', 0.5)
                $('[name="send_wk_message"]').focus();
            }
        }
    });
};


String.prototype.parseContent = function () {
    //var string = this.removeTag();

    var string = this.htmlEncode();
    return string.parseExpression();
};

String.prototype.removeTag = function () {
    var string = this;
    string = string.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    string = string.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    string = string.replace(/ /ig, '');//去掉
    return string;
};


String.prototype.parseExpression = function () {
    var string = this;
    return string.replace(/\[(.+?)\]/g, function (find) {

        find = find.replace('[', '').replace(']', '');
        if (find.indexOf(':') == -1) {
            return ' <img src="' + expression_path + find + '.gif"  style="width:24px;height:24px;"/>';
        } else {
            return  '[' + find + ']'
        }
    });

};

String.prototype.htmlEncode = function () {
    var s = this;
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
};


String.prototype.htmlDecode = function () {
    var s = this;
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
};

