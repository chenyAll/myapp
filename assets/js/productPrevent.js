layui.use(['element', 'form', 'laydate', 'common', 'inputMonitor', 'dispgrid','productdlg'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        element = layui.element(),
        com = layui.common(),
        productdlg = layui.productdlg;
    var dispGrid;
    // 初始化
    com.init({
        callback: function (r) {
            loadSetint();
        }
    });
    // tab切换时显示 发送记录明细
    element.on('tab', function (data) {
        if (data.index == 1) {
            if (dispGrid) {
                dispGrid.reload();
            }
            else {
                var search = {};
                var d = com.now();
                $('input[name="<dt_send"]').val(d.format('yyyy-MM-dd'));
                d.setMonth(d.getMonth() - 3);
                $('input[name=">dt_send"]').val(d.format('yyyy-MM-dd'));
                search[">dt_send"] = $('input[name=">dt_send"]').val();
                search["<dt_send"] = $('input[name="<dt_send"]').val();
                dispGrid = layui.dispgrid({
                    action:'load_dispgrid',
                    dataParams: {
                        billType: window.detailBillType, // 页面中设置
                        search: JSON.stringify(search)
                    }
                });
                dispGrid.init();
            }
        }
    });
    //加载设置数据
    function loadSetint() {
        com.ajax({
            action: 'get_editfields',
            data: {
                billType: window.billType,
                id:window.recordId, 
                forBillType: '0',
                parentId: 0
            },
            success: function (result) {
                var info = result.tbl;
                if (info && info.length > 0) {
                    $.each(info, function (index, iteam) {
                        switch (iteam.field_name) {
                            case 'enable':
                                $('input[name="enable"][value="' + (iteam.value ? '1' : '0') + '"]').prop('checked', 'checked');
                                break;
                            case 'txt1':
                                $('input[name="JSNumber"]').val(iteam.value.replace(/\\r/g, ','));
                                break;
                            case 'qty1':
                                if (iteam.value == 1) {
                                    $('input[name="chkTX_Z"]').prop('checked', 'checked');
                                }
                                break;
                            case 'qty2':
                                if (iteam.value == 1) {
                                    $('input[name="chkTX_C"]').prop('checked', 'checked');
                                }
                                break;
                            case "products_id":
                                if (iteam.value) {
                                    $('input[name="products_id"]').val(iteam.value);
                                    var prod_ids = iteam.value.split('|');
                                    $('button[name="SXShoop"]').html('已选择<big style="color:#FF5722">' + prod_ids.length + '</big>个商品');
                                }
                                break;
                        }
                    });
                }
                $('button[name="save"],button[name="test"]').removeAttr('disabled');
                form.render();
            }
        })
    }
    //保存设置
    form.on('submit(save)', function (data) {
        try {
            saveSetting(data);
        } catch (e) {
            layer.alert(e.message);
        }
    });
    //保存
    function saveSetting(data) {
        var field = data.field;
        var row = {
            id: window.recordId,
            products_id: ['-']
        };
        if (field.enable == 1) {
            row.enable = true;
        } else {
            row.enable = false;
        }
        // 商品
        if (field.products_id) {
            var arr = field.products_id.split('|');
            for (var i = 0; i < arr.length; i++) {
                row.products_id.push(arr[i]);
            }
        }
        var phone = field.JSNumber;
        var sear = new RegExp(',');
        var rg = /^1[3|4|5|8][0-9]\d{8}$/;
        var criteria;
        var num = [];
        var st = true;
        if (sear.test(phone)) {
            criteria = phone.split(',');
            $.each(criteria, function (x, y) {
                if (y && y.length > 0) {
                    if (rg.test(y)) {
                        num.push(y);
                    } else {
                        layer.alert("请输入正确的手机号码！", { icon: 2 });
                        st = false;
                        return;
                    }
                }
            })
        } else {
            if (!rg.test(phone) || phone.length != 11) {
                layer.alert("请输入正确的手机号码！", { icon: 2 });
                st = false;
                return;
            }
            num.push(phone);
        }

        if (st) {
            var sd = num.join(',');

            if (sd.length < 10) {
                layer.alert("请输入手机号码！", { icon: 2 });
                return;
            }
            row.txt1 = sd;
        } else
            return;

        if (field.chkTX_Z) {
            row.qty1 = true;
        } else {
            row.qty1 = false;
        }
        if (field.chkTX_C) {
            row.qty2 = true;
        } else {
            row.qty2 = false;
        }
        if (row.enable && !row.qty1 && !row.qty2) {
            layer.alert('预警条件至少勾选一个', { icon: 2 });
            return;
        }
        //保存
        com.ajax({
            action: 'save_baseinfo',
            data: {
                billType: window.billType,
                forBillType: 0,
                row: JSON.stringify(row)
            },
            success: function (result) {
                layer.msg('操作成功', { icon: 1, time: 1000 });
            }
        })


    }
    //查询发送记录
    form.on('submit(search)', function (data) {
        try {
            dispGrid.reload(data.field, true);
        } catch (e) {
            layer.alert(e.message);
        }
        return false;
    });
    //选择商品
    $('button[name="SXShoop"]').on('click', function () {
        var $link = $(this);
        productdlg.show({
            checks: $('input[name="products_id"]').val(),
            callback: function (_ids, _names, count) {
                $('input[name="products_id"]').val(_ids || '');
                if (count == 0) {
                    $link.html('默认全部商品');
                } else {
                    $link.html('已选择<big style="color:#FF5722">' + count + '</big>个商品');
                }

            }
        })
    })
})