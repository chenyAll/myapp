layui.use(['form', 'laypage', 'element', 'common'], function () {
    var $ = layui.jquery,
        form = layui.form(),
        element = layui.element(),
        com = layui.common();
    com.init();
    GetCustomerGradeDivideInfo();//获取等级信息

    var vips = $(".vip");//开启与关闭的按钮
    //获取等级信息
    function GetCustomerGradeDivideInfo() {
        com.ajax({
            action: 'get_config',
            data: {
                fld: 'vip_lst'
            },
            success: function (r) {
                var vipList = r.obj.vip_lst;
                if (vipList) {
                    var info = eval('(' + vipList + ')');
                    var ltElement = $('#cust_leve tbody tr');
                    $.each(info, function (x, y) {
                        //console.debug(y);
                        var count = x.charAt(x.length - 1);
                        var num = count - 1;
                        if (x == ("a"+count+"")) {
                            ltElement.eq(num).children("td").eq(1).children("input").eq(0).val(y);
                            ltElement.eq(num).children("td").eq(2).children("input").addClass('active');
                            ltElement.eq(num).children("td").eq(2).children("input").attr('checked', 'checked');
                            form.render();
                        }
                        if (x == ("n" + count + "")) {
                            ltElement.eq(num).children('td').eq(1).children('input').eq(1).val(y);
                            ltElement.eq(num).children("td").eq(2).children("input").addClass('active');
                            ltElement.eq(num).children("td").eq(2).children("input").attr('checked','checked');
                            form.render();
                        }
                        
                    })
                }
            },
            fail: function () {
                console.debug(msg);
            }
        })
    }
    //监听switch开关
    form.on('switch(vip)', function (data) {
        //判断是否开启
        if (data.elem.checked) {
            Leve(true, data)
        } else {
            Leve(false, data);
        }
    });
    //按钮：开启与关闭的判断
    function Leve(IsOff, data) {
        if (IsOff) {
            $.each(vips, function (x, y) {
                if ($(y).attr("id") == data.elem.id) {
                    if (vips[x - 1] == undefined) {
                        $("#" + vips[x].id + "").addClass("active");
                        LeveCondition(x, data);
                    } else {
                        if ($("#" + vips[x - 1].id + "").hasClass("active")) {
                            $("#" + vips[x].id + "").addClass("active");
                            LeveCondition(x, data);
                        } else {
                            layer.alert("请先开启上一级等级", {
                                icon: 2,
                                end: function () {
                                    data.elem.checked = false;
                                    $("#" + data.elem.id + "").removeClass('active');
                                    form.render();
                                }
                            });
                            return;
                        }
                    }

                }
            })
        } else {
            $.each(vips, function (x, y) {
                if ($(y).attr("id") == data.elem.id) {
                    if (vips[x] == undefined) {
                        $("#" + vips[x].id + "").removeClass("active");
                    } else {
                        if (x<3&&$("#" + vips[x + 1].id + "").hasClass("active")) {
                            layer.alert("请先关闭下一级等级", {
                                icon: 2,
                                end: function () {
                                    data.elem.checked = true;
                                    form.render();
                                }
                            });
                            return;
                        } else {
                            $("#" + vips[x].id + "").removeClass("active");
                            LeveCondition(x, data)
                        }
                    }

                }
            })
        }
    }
    //升级条件：交易额或者是笔数
    function LeveCondition(num, data) {
        var ltElement = $('#cust_leve tbody tr');
        var money = parseFloat(ltElement.eq(num).children("td").eq(1).children("input").eq(0).val());
        var count = parseFloat(ltElement.eq(num).children('td').eq(1).children('input').eq(1).val());
        var row = {};
        var Is = true;
        $.each(vips, function (x, y) {
            var m = parseFloat(ltElement.eq(x).children("td").eq(1).children("input").eq(0).val());
            var c = parseInt(ltElement.eq(x).children('td').eq(1).children('input').eq(1).val());
            if ($("#" + vips[x].id + "").hasClass("active")) {
                if (!new RegExp("^[0-9]+.?[0-9]*$").test(money)) {
                    layer.alert("交易额录入错误，请重新录入！", {
                        icon: 2,
                        end: function () {
                            data.elem.checked = false;
                            form.render();
                        }
                    });
                    $("#" + data.elem.id + "").removeClass('active');
                    return;
                }
                if (!new RegExp("^[0-9]*$").test(count)) {
                    layer.alert("笔数录入错误，请重新录入！", {
                        icon: 2,
                        end: function () {
                            data.elem.checked = false;
                            form.render();
                        }
                    });
                    $("#" + data.elem.id + "").removeClass('active');
                    return;
                }
                if (x != num) {
                    if (x < num) {
                        if (parseFloat(money) <= parseFloat(m) || parseInt(count) <= parseInt(c)) {
                            layer.alert("交易金额或笔数必须大于上一等级！", {
                                icon: 2,
                                end: function () {
                                    data.elem.checked = false;
                                    form.render();
                                }
                            });
                            $("#" + data.elem.id + "").removeClass('active');
                            Is = false;
                        } else {
                            row["a" + "" + parseInt(x + 1) + ""] = m;
                            row["n" + "" + parseInt(x + 1) + ""] = c;
                        }
                    }
                } else {
                    row["a" + "" + parseInt(x + 1) + ""] = m;
                    row["n" + "" + parseInt(x + 1) + ""] = c;   
                }
            }
        });
        if (Is) {
            var rows = {};
            rows.vip_lst = JSON.stringify(row);
            com.ajax({
                action:'set_config',
                data: {
                    row: JSON.stringify(rows)
                },
                success: function (result) {
                },
                fail: function () {
                    console.debug(msg);
                }
            })
        }
        
    }
});
