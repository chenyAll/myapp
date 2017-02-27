/*
* 自动营销相关页面
* 7：满月礼、8：百日礼、9:周年礼
* 页面中单独指定：var pageType = '7','8','9';3种
*/
layui.use(['element', 'form', 'laydate', 'common', 'inputMonitor', 'dispgrid', 'areadlg', 'productdlg'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        element = layui.element(),
        com = layui.common();

    var billType = 'CRM_ORDER_N3|' + window.pageType, detailBillType = 'CRM_SMS|' + window.pageType, recordId = 1;
    // 监控短信内容修改
    var monitor = layui.inputMonitor({
        container: '.sms-form-tab'
    });
    // 初始化
    com.init({
        callback: function (result) {
            $('input[name="sign"]').attr('placeholder', this.options.shop_name).val(this.options.shop_name);

            loadSetting();
        }
    });

    // 表单验证
    form.verify({
        amt1: function (value) {
            if ($('input[name="chkAmt"]').is(':checked')) {
                var amt1 = $('input[name="amt1"]').val();
                if (amt1 && !new RegExp(regexEnum.decmal1).test(amt1)) {
                    return '交易金额开始值输入错误！';
                }
            }
        },
        amt2: function (value) {
            if ($('input[name="chkAmt"]').is(':checked')) {
                var amt2 = $('input[name="amt2"]').val();
                if (amt2) {
                    if (!new RegExp(regexEnum.decmal1).test(amt2))
                        return '交易金额结束值输入错误！';

                    var amt1 = $('input[name="amt1"]').val();
                    if (amt1 && new RegExp(regexEnum.decmal1).test(amt1) && parseFloat(amt1) > parseFloat(amt2)) {
                        return '交易金额结束值必须大于开始金额！'
                    }
                }
            }
        },
        qty1: function (value) {
            if ($('input[name="chkAmt"]').is(':checked')) {
                var qty1 = $('input[name="qty1"]').val();
                if (qty1 && !new RegExp(regexEnum.decmal1).test(qty1)) {
                    return '交易量开始值输入错误！';
                }
            }
        },
        qty2: function (value) {
            if ($('input[name="chkAmt"]').is(':checked')) {
                var qty2 = $('input[name="qty2"]').val();
                if (qty2) {
                    if (!new RegExp(regexEnum.decmal1).test(qty2))
                        return '交易量结束值输入错误！';

                    var qty1 = $('input[name="qty1"]').val();
                    if (qty1 && new RegExp(regexEnum.decmal1).test(qty1) && parseFloat(qty1) > parseFloat(qty2)) {
                        return '交易量结束值必须大于开始量！'
                    }
                }
            }
        },
        sign: window.signVerify
    });
    // 选择商品
    $('a[name="selProducts"]').on('click', function () {
        var $link = $(this);
        layui.productdlg.show({
            checks: $('input[name="products_id"]').val(),// 之前选中的id
            callback: function (_ids, _names, count) {// 确定选择后回调
                $('input[name="products_id"]').val(_ids || '');
                if (count == 0) {
                    $link.html('默认全部商品');
                } else {
                    $link.html('已选择<big style="color:#FF5722">' + count + '</big>个商品');
                }
            }
        });
    });
    // 金额
    form.on('checkbox(amt)', function (data) {
        if (data.elem.checked) {
            $('input[name="amt1"],input[name="amt2"]').removeAttr('disabled');
        } else {
            $('input[name="amt1"],input[name="amt2"]').attr('disabled', 'disabled');
        }
    });
    // 数量
    form.on('checkbox(qty)', function (data) {
        if (data.elem.checked) {
            $('input[name="qty1"],input[name="qty2"]').removeAttr('disabled');
        } else {
            $('input[name="qty1"],input[name="qty2"]').attr('disabled', 'disabled');
        }
    });
    // 地区
    form.on('checkbox(area)', function (data) {
        if (data.elem.checked) {
            $('input[name="areas"]').removeAttr('disabled');
        } else {
            $('input[name="areas"]').attr('disabled', 'disabled');
        }
    });
    // 选择地区
    $('input[name="areas"]').on('click', function () {
        layui.areadlg.show({
            checks: $('input[name="areas_id"]').val(),// 之前选中的id
            callback: function (_ids, _names) {// 确定选择后回调
                $('input[name="areas_id"]').val(_ids || '');
                $('input[name="areas"]').val(_names || '');
            }
        });
    });
    // 保存设置
    form.on('submit(save)', function (data) {
        try {
            saveSetting(data);
        } catch (e) {
            layer.alert(e.message);
        }
        return false;
    });
    // 加载设置数据
    function loadSetting() {
        com.ajax({
            action: 'get_editfields',
            data: {
                billType: billType,
                id: recordId,
                forBillType: 0,
                parentId: 0,
                raw: 1
            },
            success: function (result) {
                var row = result.tbl;
                // 是否启用
                $('input[name="enable"][value="' + (row.enable ? '1' : '0') + '"]').prop('checked', 'checked');
                // 已选择商品
                if (row.products_id) {
                    $('input[name="products_id"]').val(row.products_id);
                    $('input[name="products"]').val(row.products);

                    var arr = row.products_id.split('|');
                    $('a[name="selProducts"]').html('已选择<big style="color:#FF5722">' + arr.length + '</big>个商品');
                }
                // 会员类型
                if (row.seller_flag) {
                    for (var i = 0; i < row.seller_flag.length; i++) {
                        $('input[name="seller_flag_' + row.seller_flag[i] + '"]').prop('checked', 'checked');
                    }
                }
                // 交易额
                if (row.amt1 || row.amt2) {
                    $('input[name="chkAmt"]').prop('checked', 'checked');
                    $('input[name="amt1"]').removeAttr('disabled').val(row.amt1);
                    $('input[name="amt2"]').removeAttr('disabled').val(row.amt2);
                }
                // 交易量
                if (row.qty1 || row.qty2) {
                    $('input[name="chkQty"]').prop('checked', 'checked');
                    $('input[name="qty1"]').removeAttr('disabled').val(row.qty1);
                    $('input[name="qty2"]').removeAttr('disabled').val(row.qty2);
                }
                // 收货地区
                if (row.areas_id) {
                    $('input[name="chkArea"]').prop('checked', 'checked');
                    $('input[name="areas_id"]').val(row.areas_id);
                    $('input[name="areas"]').removeAttr('disabled').val(row.areas);
                }
                // 时间
                $('select[name="hour"]').val(Math.floor(row.min1 / 60) || '9');
                $('select[name="minute"').val(row.min1 % 60 || '00');

                // 短信内容和签名
                var o = parseSMS(row.sms);
                var $sms = $('textarea[name="sms"]');
                var $sign = $('input[name="sign"]');
                if (row.enable) {
                    $sms.val(o.sms || '');
                    $sign.val(o.sign);
                } else {
                    // 没启用时没内容设置为默认内容
                    $sms.val(o.sms ? o.sms : $sms.data('default'));
                    $sign.val(o.sign || $sign.attr('placeholder'));
                }

                $('button[name="save"],button[name="test"]').removeAttr('disabled');

                form.render();

                monitor.refresh();
            }// end of success
        });
    };
    // 保存数据
    function saveSetting(data) {
        var field = data.field;
        // 保存数据如：
        // {"id":1,"enable":false,"products_id":["-"],"seller_flag":"","amt1":null,"amt2":null,"qty1":null,"qty2":null,"areas_id":["-"],"min1":540,"sms":"【签名】 退订回N"}
        var row = {
            id: recordId,
            enable: field.enable == '1',
            products_id: ['-'],
            seller_flag: '',
            amt1: null,
            amt2: null,
            qty1: null,
            qty2: null,
            areas_id: ['-'],
            min1: (parseInt(field.hour) * 60 + parseInt(field.minute)),
            sms: monitor.getSMS()
        };
        // 商品
        if (field.products_id) {
            var arr = field.products_id.split('|');
            for (var i = 0; i < arr.length; i++) {
                row.products_id.push(arr[i]);
            }
        }
        // 会员类型
        if (field.seller_flag_1) {
            row.seller_flag += '1';
        }
        if (field.seller_flag_2) {
            row.seller_flag += '2';
        }
        if (field.seller_flag_3) {
            row.seller_flag += '3';
        }
        if (field.seller_flag_4) {
            row.seller_flag += '4';
        }
        // 金额
        if (field.chkAmt) {
            row.amt1 = parseFloat(field.amt1);
            row.amt2 = parseFloat(field.amt2);
        }
        // 数量
        if (field.chkQty) {
            row.qty1 = parseFloat(field.qty1);
            row.qty2 = parseFloat(field.qty2);
        }
        // 地区
        if (field.chkArea) {
            var arr = field.areas_id.split('|');
            for (var i = 0; i < arr.length; i++) {
                row.areas_id.push(parseInt(arr[i]));
            }
        }
        // 保存
        com.ajax({
            action: 'save_baseinfo',
            data: {
                billType: billType,
                forBillType: 0,
                row: JSON.stringify(row)
            },
            success: function (result) {
                layer.msg('操作成功', { icon: 1, time: 1000 });
            }
        });
    }

    // 以下是明细部分
    var dispGrid;
    // tab切换时显示 发送记录明细
    element.on('tab', function (data) {
        if (data.index == 1) {
            if (dispGrid) {
                dispGrid.reload();
            } else {
                var d1 = com.now().addMonths(-3);
                var d2 = com.now();

                d1.clearTime();
                d2.clearTime();

                // 设置默认的查询条件
                $('input[name=">dt_send"]').val(d1.format('yyyy-MM-dd'));
                $('input[name="<dt_send"]').val(d2.format('yyyy-MM-dd'));

                dispGrid = layui.dispgrid({
                    dataParams: {
                        billType: detailBillType
                    }
                });
                dispGrid.setSearch({
                    '>dt_send': d1,
                    '<dt_send': d2
                });
                dispGrid.init();
            }
        }
    });
    // 查询发送记录
    form.on('submit(search)', function (data) {
        try {
            dispGrid.reload(data.field, true);
        } catch (e) {
            layer.alert(e.message);
        }
        return false;
    });
});