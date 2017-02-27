/*
* DispGrid数据表格
* 需设置表格模板、分页容器
*/
layui.define(['jquery', 'laypage','layer', 'common'], function (exports) {
    var $ = layui.jquery;
    var com = layui.common();
    var laypage = layui.laypage;
    var layer = layui.layer;

    if (window.juicer) {
        //模板中格式化2位小数
        juicer.register('fm_n2', formatN2);
        //模板中格式化价格
        juicer.register('fm_money', window.formatMoney);
        //url编码
        juicer.register('fm_url_encode', function (str) {
            return encodeURIComponent(str);
        });
        //null转换
        juicer.register('fm_null', function (str) {
            return str || '';
        });
        //服务器日期转换
        juicer.register('fm_date', function (s) {
            return window.formatSDate(s, 'yyyy-MM-dd');
        });
        //服务器时间转换
        juicer.register('fm_stime', function (s) {
            return window.formatSDate(s, 'yyyy-MM-dd HH:mm');
        });
        //服务器时间转换
        juicer.register('fm_time', window.formatSDate);
    }

    var DispGrid = function (options) {
        this._init = true;
        // 默认参数
        this.options = {
            tableSelector: '#dataContainer',// 数据容器
            pagingId: 'pagingBar',// 分页容器ID
            dataTemplateId: 'dataTemplate',// 模板id
            selCheckboxName: 'chkSel',
            checkAll: false,
            onLoad: null,
            loadSuccess: null // 数据据加载成功后第一时间调用，解决生成模板前需要对数据的处理(返回false时取消后面的生成操作)
        };

        // 请求相关的参数
        this.dataParams = {
            billType: '',
            forBillType: '',
            incChild: false,
            incDisabled: false,
            parentId: 0,
            search: '',
            recCount: -1,
            sort: 'id',
            dir: 'DESC',
            start: 0,
            limit: 10// 每页显示行数，0：不分页
        };

        if (options.dataParams) {
            $.extend(this.dataParams, options.dataParams);
            delete options.dataParams;
        }

        $.extend(this.options, options);
    };
    
    DispGrid.prototype.init = function () {
        if (this._init) {
            delete this._init;

            // 模板
            var html = $('#' + this.options.dataTemplateId).html();

            $(this.options.tableSelector).empty().append(juicer(html, { loading: true }));

            this.load();
        }
        return this;
    };

    /*
    * 初始化
    * 可能有默认的查询条件
    * 支持参数：start     加载数据开始行；
    *           search    查询条件；
    *           callback  数据加载后回调
    */
    DispGrid.prototype.load = function () {
        var _this = this;
        var params = this.dataParams;
        var options = this.options;

        com.ajax({
            action: 'load_dispgrid',
            data: params,
            success: function (result) {
                if (options.loadSuccess && options.loadSuccess.call(_this, result) === false) {
                    return;
                }

                params.recCount = result.n;

                var tbl = result.tbl;
                // 模板
                var html = $('#' + options.dataTemplateId).html();
                var $container = $(options.tableSelector);
                $container.empty().append(juicer(html, result));

                // 生成分页控件
                if (params.limit > 0 && params.start == 0) {
                    laypage({
                        cont: options.pagingId,
                        pages: Math.floor((result.n - 1) / params.limit) + 1,
                        curr: params.start / params.limit + 1,
                        skin: '#23AA63',
                        skip:true,
                        jump: function (obj, first) {
                            if (!first) {
                                params.start = (obj.curr - 1) * params.limit;
                                _this.load();
                            }
                        }
                    });
                }

                var $table = $container.children('table');
                if ($table.hasClass('show-signle')) {
                    // 展开、关闭
                    $table.find('th a.crm-icon-down').on('click', function () {
                        if ($table.hasClass('show-signle')) {
                            $table.removeClass('show-signle')
                        } else {
                            $table.addClass('show-signle')
                        }
                    });
                    // 需计算一下列宽，设置一下单行显示内容的宽度
                    $table.find('.single-txt').each(function () {
                        var _this = $(this);
                        _this.width(_this.parent().width() * 0.95);
                    });
                }

                // 启用全选功能
                if (options.checkAll) {
                    $('#chkAll', $table).bind('change', function () {
                        if ($(this).is(':checked'))
                            $('input[type="checkbox"][name="' + options.selCheckboxName + '"]', $table).prop('checked', 'checked');
                        else
                            $('input[type="checkbox"][name="' + options.selCheckboxName + '"]', $table).removeAttr('checked');
                    });
                }

                if (options.onLoad) {
                    options.onLoad.call(_this, result);
                }
            }
        });
    };
    /*
    * 设置查询条件
    */
    DispGrid.prototype.reload = function (search, resetPage) {
        if (search) {
            this.search = search;
            if (typeof search === 'object') {
                this.dataParams.search = JSON.stringify(search);
            } else {
                this.dataParams.search = search;
            }
        }

        if (resetPage) {
            this.dataParams.start = 0;// 设置查询后恢复
            this.dataParams.recCount = -1;
        }

        this.load()
    };
    /*
    * 设置查询参数
    */
    DispGrid.prototype.setSearch = function (search) {
        if (search) {
            this.search = search;
            if (typeof search === 'object') {
                this.dataParams.search = JSON.stringify(search);
            } else {
                this.dataParams.search = search;
            }
        }
    };
    /*
    * 获取查询参数
    */
    DispGrid.prototype.getSearch = function () {
        return this.search;
    };
    /*
    * 获取选择记录id
    * 选择数据行的复选框：<input type="checkbox" name="selCheckboxName" value="id"/>
    */
    DispGrid.prototype.getSelIds = function (noAlert) {
        var ids = [];
        var sels = $(this.options.tableSelector).find('tbody input[name="'+this.options.selCheckboxName+'"][type="checkbox"]:checked');
        sels.each(function () {
            ids.push($(this).attr('value'));
        });

        if (ids.length == 0) {
            if (noAlert)
                return null;
            layer.alert('请选择需要操作的记录！', { icon: 0 });
            return null;
        }

        return ids;
    };

    exports('dispgrid', function (options) {
        return new DispGrid(options || {});
    });
});