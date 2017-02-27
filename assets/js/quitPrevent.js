layui.use(['element', 'form', 'laydate', 'common', 'inputMonitor', 'dispgrid'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        element = layui.element(),
        com = layui.common();
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
                var d = new Date();
                $('input[name="<dt_send"]').val(d.format('yyyy-MM-dd'));
                d.setMonth(d.getMonth() - 3);
                $('input[name=">dt_send"]').val(d.format('yyyy-MM-dd'));
                search[">dt_send"] = $('input[name=">dt_send"]').val();
                search["<dt_send"] = $('input[name="<dt_send"]').val();
                dispGrid = layui.dispgrid({
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
            action: 'load_dispgrid',
            data: {
                billType: window.billType,
                id: window.recordId,
                forBillType: '',
                incChild: false,
                incDisabled: false,
                parentId: 0,
                recCount: 1,
                sort: 'id',
                dir: 'ASC',
                start: 0,
                limit: 10
            },
            success: function (result) {
                var row = result.tbl;
                // 是否启用
                $('input[name="enable"][value="' + (row[0].enable ? '1' : '0') + '"]').prop('checked', 'checked');
                $('input[name="JSNumber"]').val(row[0].txt1);
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
            id: window.recordId
        };
        if (field.enable == 1) {
            row.enable = true;
        } else {
            row.enable = false;
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
    // 查询发送记录
    form.on('submit(search)', function (data) {
        try {
            dispGrid.reload(data.field, true);
        } catch (e) {
            layer.alert(e.message);
        }
        return false;
    });
})