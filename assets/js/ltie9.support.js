/*
* ie9以下版本需要该js支持（不包含ie9）。
* 主要用于一些小于ie9版本css等不兼容的部分使用js来配合
* 如：css3 中的calc
*/
layui.use('jquery', function () {
    var $ = layui.jquery;

    $(function () {
        //#layout-content {height:calc(100% - 50px)}调整内部部分的高度
        $(window).on('resize', function () {
            var h = $(this).height() - $('#layout-top').height();
            $('#layout-content').height(h);

            //$.fixOrFit({
            //    obj1: $('#fixW'),
            //    obj2: $('#fitW'),
            //    num: $('#content-warp').width(),
            //    margin: 20
            //});
        }).trigger('resize');
    });
});