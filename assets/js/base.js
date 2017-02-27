/*
* 基础库，对javascript内置对象扩展等
*/
(function (win) {
    win.SERVER = 'process.aspx';
    /*
    * 退订标签
    */
    win.TUIDING_TAG = '退订回N';
    /*
    * 短信模板，所有短信内容使用该模板替换
    */
    win.SMS_TMPL = '【{sign}】{sms} ' + win.TUIDING_TAG;
    /*
    * 常用正则表达式枚举
    * 使用方法：new RegExp(regexEnum.mobile).test(phone)
    */
    win.regexEnum = {
        intege: "^-?[1-9]\\d*$",                 //整数
        intege1: "^[1-9]\\d*$",                 //正整数
        intege2: "^-[1-9]\\d*$",                 //负整数
        num: "^([+-]?)\\d*\\.?\\d+$",         //数字
        num1: "^[1-9]\\d*|0$",                 //正数（正整数 + 0）
        num2: "^-[1-9]\\d*|0$",                 //负数（负整数 + 0）
        decmal: "^([+-]?)\\d*\\.\\d+$",         //浮点数
        decmal1: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", //正浮点数
        decmal2: "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", //负浮点数
        decmal3: "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //浮点数
        decmal4: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", //非负浮点数（正浮点数 + 0）
        decmal5: "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", //非正浮点数（负浮点数 + 0）

        email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
        color: "^[a-fA-F0-9]{6}$",             //颜色
        url: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", //url
        chinese: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",                 //仅中文
        ascii: "^[\\x00-\\xFF]+$",             //仅ACSII字符
        zipcode: "^\\d{6}$",                     //邮编
        mobile: "^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\\d{8}$",             //手机
        ip4: "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", //ip地址
        notempty: "^\\S+$",                     //非空
        picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", //图片
        rar: "(.*)\\.(rar|zip|7zip|tgz)$",                             //压缩文件
        date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",                 //日期
        qq: "^[1-9]*[1-9][0-9]*$",             //QQ号码
        tel: "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", //电话号码的函数(包括验证国内区号,国际区号,分机号)
        username: "^\\w+$",                     //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter: "^[A-Za-z]+$",                 //字母
        letter_u: "^[A-Z]+$",                 //大写字母
        letter_l: "^[a-z]+$",                 //小写字母
        idcard: "^[1-9]([0-9]{14}|[0-9]{17})$",    //身份证
        specialchar: "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}‘；：”“'。，、？\"]" // 特殊字符
    };
    /*
    * 短信签名验证方式
    */
    win.signVerify = function (v) {
        if (!v)
            return '短信签名必须输入';
        if (v.length > 9)
            return '短信签名必须小于等于9个字';
    };
    /*
    * 获取Url参数对应值
    */
    win.getQueryString = function (paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i"); //i 不区分大小写
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return "";
    };
    //=================begin 内置对象的扩展====================
    /*
    * 对Date的扩展，将 Date 转化为指定格式的String
    * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)、周(E) 可以用 1-2 个占位符， 
    * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    * 例子： 
    * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    * @param {String} fmt 如：(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    */
    win.Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "\u65e5",
            "1": "\u4e00",
            "2": "\u4e8c",
            "3": "\u4e09",
            "4": "\u56db",
            "5": "\u4e94",
            "6": "\u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    /*
    * 重写toJSON方法，默认的有时区问题
    */
    Date.prototype.toJSON = function () {
        return this.format('yyyy-MM-ddTHH:mm:ss');
    }
    /*
    * 日期增加天数
    * @param {int} d
    */
    win.Date.prototype.addDays = function (d) {
        this.setDate(this.getDate() + d);
        return this;
    };
    /*
    * 日期增加周
    * @param {int} w
    */
    win.Date.prototype.addWeeks = function (w) {
        this.addDays(w * 7);
        return this;
    };
    /*
    * 日期增加月
    * @param {int} m
    */
    win.Date.prototype.addMonths = function (m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() + m);
        if (this.getDate() < d)
            this.setDate(0);
        return this;
    };
    /*
    * 日期增加年
    * @param {int} y
    */
    win.Date.prototype.addYears = function (y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() + y);
        if (m < this.getMonth()) {
            this.setDate(0);
        }
        return this;
    };
    /*
    * 清除日期的时间部分
    */
    win.Date.prototype.clearTime = function () {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
    };
    /*
    * 日期比较，此实例的值与d值比较，并返回一个整数。该整数指示此实例是早于（-1：小于）、等于（0）还是晚于（1：大于）
    * @param {Date} d
    */
    win.Date.prototype.compareTo = function (d) {
        var t1 = this.getTime();
        var t2 = d.getTime();
        return t1 == t2 ? 0 : (t1 < t2 ? -1 : 0);
    };
    /*
    * 计算d和当前时间相差
    * d:天，h:小时，m:分钟,s:秒，其它完整的字符串提示，如：1天00小时01分钟01秒
    * @param {Date} d
    * @param {String} opt
    */
    win.Date.prototype.diff = function (d, opt) {
        var t = d.getTime() - this.getTime();
        switch (opt) {
            case 'd':
                return Math.floor(t / (24 * 3600 * 1000));
            case 'h':
                return Math.floor(t / (3600 * 1000));
            case 'm':
                return Math.floor(t / (60 * 1000));
            case 's':
                return Math.floor(t / 1000);
            default:
                var str = '';
                var days = Math.floor(t / (24 * 3600 * 1000));
                if (days > 0)
                    str += days + '天';

                //计算出小时数
                var leave1 = t % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                if (str != '' || hours > 0)
                    str += hours + '小时';

                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000);//计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));
                if (str != '' || minutes > 0)
                    str += (minutes < 10 ? '0' + minutes : minutes) + '分钟';

                //计算相差秒数
                var leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);

                str += (str != '' && seconds < 10 ? '0' + seconds : seconds) + '秒';

                return str;
        }
    };
    /*
    * 计算d1和d2相差的时间
    * d:天，h:小时，m:分钟,s:秒，其它完整的字符串提示，如：1天00小时01分钟01秒
    * @param {Date} d1
    * @param {Date} d2
    * @param {String} opt
    */
    win.diffDate = function (d1, d2, opt) {
        return d1.diff(d2, opt);
    };
    /*
    * 字符串去头尾空格
    */
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    /*
    * 字符串去左边空格
    */
    String.prototype.ltrim = function () {
        return this.replace(/(^\s*)/g, "");
    }
    /*
    * 字符串去右边空格
    */
    String.prototype.rtrim = function () {
        return this.replace(/(\s*$)/g, "");
    }
    //=================end 内置对象的扩展====================

    //=================begin 不支持JSON的相关处理============
    if (!win.JSON) {
        win.JSON = {
            /*
            * JSON String转换为对象
            * @param {String} sJSON
            */
            parse: function (sJSON) {
                return eval('(' + sJSON + ')');
            },
            /*
            * 对象转换为JSON String字符串
            * @param {String}
            */
            stringify: (function () {
                var toString = Object.prototype.toString;
                var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
                var escMap = {
                    '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'
                };
                var escFunc = function (m) {
                    return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
                };
                var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
                return function stringify(value) {
                    if (value == null) {
                        return 'null';
                    } else if (typeof value === 'number') {
                        return isFinite(value) ? value.toString() : 'null';
                    } else if (typeof value === 'boolean') {
                        return value.toString();
                    } else if (typeof value === 'object') {
                        if (typeof value.toJSON === 'function') {
                            return stringify(value.toJSON());
                        } else if (isArray(value)) {
                            var res = '[';
                            for (var i = 0; i < value.length; i++)
                                res += (i ? ', ' : '') + stringify(value[i]);
                            return res + ']';
                        } else if (toString.call(value) === '[object Object]') {
                            var tmp = [];
                            for (var k in value) {
                                if (value.hasOwnProperty(k))
                                    tmp.push(stringify(k) + ': ' + stringify(value[k]));
                            }
                            return '{' + tmp.join(', ') + '}';
                        }
                    }
                    return '"' + value.toString().replace(escRE, escFunc) + '"';
                };
            })()
        };
    }
    //=================begin 不支持JSON的相关处理============

    /*
    * 获取选择域位置，如果未选择便是光标位置
    * @param {HtmlElement} el textarea对象
    */
    win.getSelection = function (el) {
        return (
            ('selectionStart' in el && function () {
                var l = el.selectionEnd - el.selectionStart;
                return {
                    start: el.selectionStart,
                    end: el.selectionEnd,
                    length: l,
                    text: el.value.substr(el.selectionStart, l)
                };
            }) ||

            (document.selection && function () {

                el.focus();

                var r = document.selection.createRange();
                if (r === null) {
                    return {
                        start: 0,
                        end: el.value.length,
                        length: 0
                    }
                }

                var re = el.createTextRange();
                var rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return {
                    start: rc.text.length,
                    end: rc.text.length + r.text.length,
                    length: r.text.length,
                    text: r.text
                };
            }) ||

            function () {
                return null;
            }

        )();
    };
    /*
    * 将文本域中选中的内容替换为指定内容
    * @param {HtmlElement} el textarea对象
    * @param {String} arg 要替换成的内容
    */
    win.replaceSelection = function (el) {

        var text = arguments[1] || '';

        return (
            /* mozilla / dom 3.0 */
            ('selectionStart' in el && function () {
                el.value = el.value.substr(0, el.selectionStart) + text + el.value.substr(el.selectionEnd, el.value.length);
                return this;
            }) ||
            /* exploder */
            (document.selection && function () {
                el.focus();
                document.selection.createRange().text = text;
                return this;
            }) ||
            /* browser not supported */
            function () {
                el.value += text;
                return jQuery(el);
            })();
    };
    /*
    * 格式化2位小数
    */
    win.formatN2 = function (n) {
        if (n == null || n == undefined)
            return ' --';
        var _n = parseFloat(n);
        if (isNaN(_n))
            return n;
        return _n.toFixed(2);
    };
    /*
    * 格式化金额(返回格式：<i>100</i>.<em>00</em>)
    */
    win.formatMoney = function (price) {
        var n = parseFloat(price);
        if (isNaN(n)) {
            return '<i>' + price + '</i>';
        }
        var arr = (n.toFixed(2) + '').split('.');
        return '<i>' + arr[0] + '</i>.<em>' + arr[1] + '</em>';
    };
    /*
    * 格式化服务器返回的日期,服务器返回/Date(****+***)/
    * juicer.register('fm_sdate', formatSDate);
    */
    win.formatSDate = function (strD, fm) {
        if (!strD) {
            return '';
        }
        if (!fm) {
            fm = 'yyyy-MM-dd hh:mm:ss';
        }

        var d;
        if (strD.indexOf('/Date(') != -1) {
            var s = strD.replace('/Date(', '').replace(')/', '');
            d = new Date(parseFloat(s.split('+')[0]));
        } else {
            d = new Date(strD);
        }
        return d.format(fm);
    };

    /*
    * 转换短信内容，将内容“【签名】内容 退订回N”拆分返回具体信息
    * 返回：{sign:"***",sms:"***"}
    */
    win.parseSMS = function (sms) {
        // 去掉退订回
        var msg = sms.replace(window.TUIDING_TAG, '');

        // 去掉签名
        var sign = '';
        var i = msg.indexOf('【');
        if (i != -1) {
            var j = msg.indexOf('】', i);
            sign = msg.substr(i + 1, j - 1);// 签名
            msg = msg.substr(j + 1);
        }

        return {
            sign: sign,
            sms: msg.trim()
        };
    };

})(window);