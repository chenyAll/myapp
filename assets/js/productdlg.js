/*
* 商品选择窗口插件
*/
layui.define(['layer', 'laypage', 'common'], function (exports) {
    "use strict";

    var win = window;
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        com = layui.common();

    
    // 框架整体模板
    var contentHtml = ['<div class="lay-pd-container clearfix">',
                        '<div class="pd-l">',
                            '<h3>店铺中的宝贝</h3>',
                            '<div class="pd-wrap">',
                                '<div class="pd-search">',
                                    '<div class="layui-input-inline">',
                                        '<input type="text" name="str" autocomplete="off" placeholder="查询" class="layui-input">',
                                    '</div>',
                                    '&nbsp;<button name="btnSearch" type="button" class="layui-btn layui-btn-primary layui-btn-small">查询</button>',
                                '</div>',
                                '<div class="pd-list">',
                                '</div>',
                                '<div class="pd-page"></div>',
                            '</div>',
                        '</div>',
                        '<div class="pd-r">',
                            '<h3>已选中的宝贝(<big name="selCount">0</big>)</h3>',
                            '<div class="pd-wrap">',
                                '<div class="pd-list">',

                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="loading"></div>',
                    '</div>'].join('');
    // 商品行模板
    var rowTemplate = ['{@each tbl as row}',
                            '<div class="pd-row" data-id="${row.id}" data-name="${row.name}" data-pic="${row.pic_path}" data-price="${row.price}">',
                                '<div class="p-img"><img src="${row.pic_path|r_https}_60x60.jpg" /></div>',
                                '<div class="p-name">',
                                    '<a href="javascript:void(0);" title="${row.name}">${row.name}</a>',
                                    '<small>${row.price|fm_n2}</small>',
                                '</div>',
                                '<div class="opt">',
                                '{@if isLeft}',
                                    '<a name="linkAdd" href="javascript:void(0);" class="crm-icon crm-icon-jia2 ${row.id|is_checked}"></a>',
                                '{@else}',
                                    '<a name="linkAdd" href="javascript:void(0);" class="crm-icon crm-icon-jian1"></a>',
                                '{@/if}',
                                '</div>',
                            '</div>',
                        '{@/each}'].join('');

    //{
    //    "id": 42168316062, 
    //    "rn": 3, 
    //    "name": "", 
    //    "pic_path": "", 
    //    "price": 11.9
    //}, 

    var layIndex = -1, loading = true, $container=null;
    // 查询条件，id是固定值
    var search = '', pageSize = 7, selData = null;
    // 判断是否已选择
    function isChecked(id) {
        if (selData) {
            for (var i = 0, len = selData.length; i < len; i++) {
                if (selData[i].id == id) {
                    return true;
                }
            }
        }
        return false;
    }
    // 用来判断是否已选择了
    juicer.register('is_checked', function (v) {
        return isChecked(v) ? 'checked' : '';
    });
    // 去https
    juicer.register('r_https', function (v) {
        if (v) {
            return v.replace('https:', 'http:');
        }
        return '';
    });

    var Funs = {
        loadData: function (checks, pageIndex, recCount) {
            loading = true;
            com.ajax({
                action: 'load_dispgrid',
                data: {
                    billType: 'CRM_PRODUCT',
                    forBillType: checks ? checks.replace(/\|/g, ',') : '',// 传过来的id为 id1|id2格式，这里替换
                    incChild: false,
                    incDisabled: false,
                    parentId: 0,
                    recCount: -1,
                    sort: 'id',
                    dir: 'ASC',
                    search: JSON.stringify({ 48237: search }),// 注意：48237是固定值
                    start: (pageIndex - 1) * pageSize,
                    limit: pageSize
                },
                success: function (result) {
                    var tbl = result.tbl;
                    // 已选中的商品列表
                    if (checks) {
                        selData = result.obj.products;
                        Funs.refreshSel();
                    }

                    // 商品列表
                    var html = juicer(rowTemplate, {
                        tbl: result.tbl,
                        isLeft: true
                    });
                    $container.find('.pd-l .pd-list').empty().append(html);

                    // 生成分页
                    if (recCount == -1) {
                        laypage({
                            cont: $container.find('.pd-l .pd-page'),
                            pages: Math.floor((result.n - 1) / pageSize) + 1,
                            curr: pageIndex,
                            skin: '#23AA63',
                            groups: 3,
                            first: false,
                            last: false,
                            jump: function (obj, first) {
                                if (!first)
                                    Funs.loadData(null, obj.curr, result.n);
                            }
                        });
                    }
                    // 左边区事件绑定
                    Funs.bindEvent();

                    $container.find('.loading').remove();

                    loading = false;
                }
            });
        },
        refreshSel: function () {
            var html = juicer(rowTemplate, {
                tbl: selData
            });

            var $pdr = $container.find('.pd-r');
            $pdr.find('.pd-list').empty().append(html);
            $pdr.find('h3 big').text(selData ? selData.length : 0);

            // 已选中记录删除
            $pdr.find('.crm-icon-jian1').on('click', function () {
                var $o = $(this).closest('.pd-row');
                var _id = $o.data('id');

                $o.slideUp('fast', function () {
                    $o.remove();
                });

                for (var i = 0,len = selData.length; i < len; i++) {
                    if (selData[i].id == _id) {
                        // 从组中删除
                        selData.splice(i, 1);
                        console.debug('删除');
                        break;
                    }
                }

                //查找左边界面，去掉选中样式
                $container.find('.pd-l .pd-row[data-id="' + _id + '"] .checked').removeClass('checked');

                $pdr.find('h3 big').text(selData.length);

                $(this).addClass('checked');
            });
        },
        bindEvent: function () {
            // 查询
            $container.find('button[name="btnSearch"]').on('click', function () {
                search = $container.find('input[name="str"]').val();
                Funs.loadData(null, 1, -1);
            });
            // 左边添加到右边
            $container.find('.pd-l .crm-icon-jia2').on('click', function () {
                var $o = $(this).closest('.pd-row');
                var _id = $o.data('id');
                if (isChecked(_id)) {
                    layer.msg('已选择，请勿重复点击！', { time: 700 });
                    return;
                }

                if (selData == null) {
                    selData = [];
                }

                selData.push({
                    id: _id,
                    name: $o.data('name'),
                    pic_path: $o.data('pic'),
                    price: $o.data('price')
                });

                Funs.refreshSel();

                $(this).addClass('checked');
            });
        }
    };
    //主接口
    var productdlg = function () {
        return productdlg;
    };
    /*
    * checks   已选中的数据 id1|id2|id3|***
    * end      窗口关闭事件
    * callback 选择后确定按钮回调事件,参数：ids(选中的商品id格式：id1|id2|id3)，names(选中的商品名称：name1，name2，name3)，count（已选中记录数）
    */
    productdlg.show = function (options) {
        if (layIndex != -1)
            return;

        options = options || {};

        layer.open({
            type: 1,
            title: '选择商品',
            area: ['900px', '640px'],
            btn: ['选择好了', '取消'],
            content: contentHtml,
            success: function (layero, index) {
                loading = true;
                layIndex = index;

                $container = layero.find('.lay-pd-container');

                Funs.loadData(options.checks, 1, -1);
            },
            yes: function (index, layero) {
                if (loading) {
                    layer.msg('正在加载，请稍后...', { time: 1000, tipsMore: true });
                    return false;
                }

                var callback = function () {
                    if (options.callback) {
                        if (selData == null) {
                            options.callback(null, null, 0);
                        } else {
                            var _ids = [];
                            var _names = [];
                            var len = selData.length;
                            for (var i = 0 ; i < len; i++) {
                                var o = selData[i];
                                _ids.push(o.id);
                                _names.push(o.name);
                            }

                            options.callback(_ids.join('|'), _names.join('，'), len);
                        }
                    }
                    layer.close(index);
                };

                if (selData == null || selData.length == 0) {
                    layer.confirm('未选择任何商品，请确认是否继续？', {
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
                selData = null;
                $container = null;
            }
        });
    };

    exports('productdlg', productdlg);
});