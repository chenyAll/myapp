/*
* 地区选择插件
*/
layui.define(['layer','form', 'common'], function (exports) {
    "use strict";

    var win = window;
    var $ = layui.jquery,
        layer = layui.layer,
        com = layui.common(),
        form = layui.form();

    var data = null, layIndex = -1, loading = true;

    var Funs = {
        loadData: function ($content, checks) {
            if (data == null) {
                com.ajax({
                    action: 'load_dispgrid',
                    data: {
                        billType: 'STATE',
                        forBillType: '-',
                        incChild: false,
                        incDisabled: false,
                        parentId: 0,
                        recCount: -1,
                        sort: 'id',
                        dir: 'ASC',
                        start: 0,
                        limit: 0
                    },
                    success: function (result) {
                        data = result.tbl;

                        Funs.createItems($content, checks);
                    }
                });
            } else {
                Funs.createItems($content, checks);
            }
        },
        createItems: function ($content, checks) {
            if (layIndex == -1)
                return;

            var ids = {};
            var arr = checks.split('|');
            for (var i = 0, len = arr.length; i < len; i++) {
                ids[arr[i]] = true;
            }

            // 生成省份选择列表
            var html = '<form class="layui-form"><ul class="prov-container restore-checkbox clearfix">';
            for (var i = 0, len = data.length; i < len; i++) {
                var o = data[i];
                html += '<li><input type="checkbox" name="province_' + o.id + '" value="' + o.id + '" title="' + o.name + '" ' +
                    ((ids[o.id]) ? 'checked="checked"' : '') + '> ' + o.name + '</li>';
            }
            html += '</ul></form>';

            $content.empty().append(html);

            form.render('checkbox');

            loading = false;
        }
    };
    //主接口
    win.areadlg = function () {
        return areadlg;
    };
    /*
    * checks   已选中的数据 id1|id2|id3|***
    * end      窗口关闭事件
    * callback 选择后确定按钮回调事件,参数：ids(选中的地区id格式：id1|id2|id3)，names(选中的地区名称：name1，name2，name3)
    */
    areadlg.show = function (options) {
        if (layIndex != -1)
            return;

        options = options || {};

        layer.open({
            type: 1,
            title: '选择地区',
            area: ['670px', '400px'],
            btn: ['全选', '确定', '取消'],
            content: '<div class="prov-loading"></div>',
            success: function (layero, index) {
                loading = true;
                layIndex = index;

                Funs.loadData(layero.find('.layui-layer-content'), options.checks);
            },
            yes: function (index, layero) {
                if (loading) { return false; }

                var $btn0 = layero.find('.layui-layer-btn0');
                if ($btn0.data('all') == '1') {
                    layero.find('input[type="checkbox"]').removeAttr('checked');
                    $btn0.removeData('all').text('全选');
                } else {
                    layero.find('input[type="checkbox"]').prop('checked', 'checked');
                    $btn0.data('all', 1).text('取消全选');
                }
                form.render('checkbox');
                return false;
            }, btn2: function (index, layero) {
                if (loading) {
                    layer.msg('正在加载，请稍后...', { time: 1000, tipsMore: true });
                    return false;
                }

                var ids = [], names = [];
                layero.find('input[type="checkbox"]:checked').each(function () {
                    var o = $(this);

                    ids.push(o.attr('value'));
                    names.push(o.attr('title'));
                });

                var callback = function () {
                    if (options.callback) {
                        options.callback(ids.length == 0 ? null : ids.join('|'),
                            names.length == 0 ? null : names.join('，'));
                    }
                    layer.close(index);
                };

                if (ids.length == 0) {
                    layer.confirm('未选择任何地区，请确认是否继续？', {
                        btn: ['是', '否']
                    }, function (index2) {
                        layer.close(index2);

                        callback();
                    });
                } else {
                    callback();
                }

                return false;
            },
            end: function () {
                layIndex = -1;
            }
        });
    };

    exports('areadlg', areadlg);
});