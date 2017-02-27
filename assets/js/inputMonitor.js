/*
* 短信内容输入监控，用于修改内容签名等后更新短信字数，条数等
*/
layui.define(['jquery'], function (exports) {
    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;
    var sms = '';

    // 更新短信计费等信息，调用的时候需要call
    function refresh() {
        var options = this.options;

        var sign = options.signInput.val();
        if (!sign) {
            sign = options.signInput.attr('placeholder');// 默认签名放到placeholder里面
        }

        var _sms = options.input.val();

        sms = SMS_TMPL.replace('{sign}', sign).replace('{sms}', _sms);

        // 计算短信条数
        var len = sms.length;
        //<span>已输入：<label name="smsLen">0</label>字(包含签名)计费：<label name="smsCount">1</label>条</span>
        options.smsInfo.find('[name="smsLen"]').text(len);
        options.smsInfo.find('[name="smsCount"]').text(len > 70 ? Math.ceil(len / 67) : 1);// 大于70个字的，每条按67个字计算

        options.simulator.find('p').text(sms);
        options.input.data('sms', sms);
    };

    var Monitor = function (options) {
        this.options = options;
    };

    Monitor.prototype.init = function () {
        var options = this.options;
        // 短信内容输入框
        if (!options.input) {
            if (options.container) {
                options.input = $(options.container).find('.input-sms > textarea');
            } else {
                options.input = $('.input-sms > textarea');
            }
        }
        // 短信输入计费提示
        if (!options.smsInfo) {
            if (options.container) {
                options.smsInfo = $(options.container).find('.sms-info');
            } else {
                options.smsInfo = $('.sms-info');
            }
        }
        // 模拟器
        if (!options.simulator) {
            if (options.container) {
                options.simulator = $(options.container).find('#smsSimulator');
            } else {
                options.simulator = $('#smsSimulator');
            }
        }
        // 签名
        if (!options.signInput) {
            if (options.container) {
                options.signInput = $(options.container).find('input[name="sign"]');
            } else {
                options.signInput = $('input[name="sign"]');
            }
        }

        var _this = this;
        function _fn() {
            refresh.call(_this);
        };

        options.input.on({
            'keyup': _fn,
            'change': _fn,
        });

        options.signInput.on({
            'keyup': _fn,
            'change': _fn,
        });

        _fn();
    };

    Monitor.prototype.getSMS = function () {
        return sms;
    };

    Monitor.prototype.refresh = function () {
        refresh.call(this);
    };

    exports('inputMonitor', function (options) {
        var monitor = new Monitor(options = (options || {}));
        monitor.init();
        return monitor;
    });
});