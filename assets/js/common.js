layui.define(['jquery','layer'], function (exports) {
    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;

    var userTag = '#loginUser,#loginUser2';// 登录用户名
    var versionTag = '#softVersion';// 版本
    var lastLoginDate = '#lastLoginDate';// 上次登录日期
    var smsRemainTag = '#top_sms_remain';// 剩余短信数量
    var daysRemainTag = '#top_days_remain';// 剩余天数

    /*
    * ajax出错后的处理，如网络错误等
    */
    var ajaxError = function (xhr, textStatus, errorThrown) {
        //alert('服务器或网络异常，请稍后重试！');
        //console.debug();
    };

    var Common = function (options) {
        //console.debug('common');
        this.options = options;
    };

    /*
    * 初始化，默认需要加载stbar数据。
    */
    Common.prototype.init = function (config) {
        config = config || {};

        var _this = this;

        this.ajax({
            action: 'stbar2',
            success: function (result) {
                //{"success":true,"msg":"小玩熊乐园","n":1,"obj":{"shop_id":3,"shop_msg":"请先在网店设置界面点击“登录授权”进行授权\u000027:invalid-sessionkey:Invalid session:\r\n   在 Shop.TaobaoI.Execute[T](ITopRequest`1 req, Boolean secure) 位置 D:\\hgh\\mydrp\\Shop\\Taobao.cs:行号 1121\r\n   在 Shop.TaobaoI.ImportCrmCust(mydb db, Int32 timer2_id) 位置 D:\\hgh\\mydrp\\Shop\\Taobao.cs:行号 2124",
                // "gNow":"2017-02-22T10:43:00.2873591+08:00","order_notif":"X5","shop_m3":"","priv_code":null,"poster":"","lic_due":"2017-10-24T00:00:00"},"metaData":{},"tbl":null}
                var obj = result.obj;

                obj.sms_remain = result.n;
                obj.shop_name = result.msg;

                $.extend(_this.options, obj);

                // 短信剩余数量
                $(smsRemainTag).text(obj.sms_remain);
                // 服务器时间
                var gNow = new Date(obj.gNow.split('T')[0].replace(/-/g, '/') + ' 00:00:00');
                // 软件到期日
                if (obj.lic_due) {
                    var licDue = new Date(obj.lic_due.replace(/-/g, "/").replace('T', ' '));
                    $(daysRemainTag).text(gNow.diff(licDue, 'd'));
                } else {
                    $(daysRemainTag).text(0);
                }
                // 用户名
                $(userTag).text(obj.shop_name);
                $(versionTag).text('标准版');

                if (config.callback) {
                    config.callback.call(_this, result);
                }
            }
        });
    };
    /*
    * 返回当前时间，本时间是根据服务器时间计算。获取时间都应该从这里获取
    */
    Common.prototype.now = function () {
        return new Date();// 暂时直接返回客户端时间，待改进
    };
    /*
      * ajax请求，所有请求数据都从这里发送
      * config参数说明：
      *            el:      发起请求需要禁用或标识的对象，可以是jQuery对象或选择器
      *            action:  请求类型
      *            data:    {需要提交的数据}
      *            error:   错误时回调
      *            success: 请求返回success=true时回调
      *            fail:    请求返回success=false时回调
      */
    Common.prototype.ajax = function (config) {
        try {
            var _config = {
                url: window.SERVER,
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    action: config.action
                },
                error: function (xhr, textStatus, errorThrown) {
                    ajaxError(xhr, textStatus, errorThrown);
                    if (config.error) {
                        config.error(xh, textStatus, errorThrown);
                    }
                },
                success: function (result, textStatus) {//成功回调方法增强处理
                    if (result.success) {
                        if (config.success) {
                            config.success(result);
                        }
                    } else {
                        if (result.msg == 'RELOGIN') {// 登录超时或没登录
                            location.href = 'login.html?returnUrl=' + encodeURIComponent(location.href);
                        } else {
                            layer.alert(result.msg, {
                                end: function () {
                                    if (config.fail) {
                                        config.fail(result);
                                    }
                                }
                            });
                        }
                    }
                },
                beforeSend: function (XHR) {
                    // 正在加载....在处理（待处理）
                },
                complete: function (XHR, TS) {
                    // 请求完成后关闭加载动画（待处理）

                }
            };

            $.extend(_config.data, config.data);

            $.ajax(_config);
        } catch (e) {
            console.error(e);
        }
    };

    // 保证Common只创建一次
    var common;
    exports('common', function (options) {
        return common || (common = new Common(options = (options || {})));
    });
});