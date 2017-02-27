layui.use(['element', 'form', 'laydate', 'common', 'inputMonitor', 'dispgrid','layer'], function (exports) {
    var $ = layui.jquery,
        form = layui.form(),
        element = layui.element(),
        com = layui.common(),
        layer = layui.layer;
    com.init();
    var dispGrid;
    var billType = 'CTAG';
    dispGrid = layui.dispgrid({
        dataParams: {
            billType: billType
        }
    });
    dispGrid.init();
    //新增标签弹出框
    var index;
    $("#add_tag").click(function () {
        //console.debug(1);
        if ($("#tag_id").html()) {
            $("#tag_name").val("");
        }
        index = layer.open({
            type: 1,
            title: '添加标签',
            skin: 'layui-layer-rim', //加上边框
            area: ['420px', '240px'], //宽高,
            content:$('#editorDialog')
        });
    })
    //关闭标签弹出框
    $("#add_close").click(function () {
        layer.close(index);
    })
    //自定义规则
    form.verify({
        title: function (value) {
            if (value.length < 1) {
                return '请输入标签名';
            };
            var pattern = new RegExp("[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}‘；：”“'。，、？\"]", 'g');
            var arr2 = value.match(pattern);
            if (arr2) {
                return '标签名存在特殊字符“' + arr2.join("，") + '”';
            };
            var $tagNames = $('#dataContainer .tag_name');
            for (var i = 0; i < $tagNames.size() ; i++) {
                var $tagName = $($tagNames[i]).first();
                if ($tagName.text() == value) {
                    return '您输入的标签名已存在';
                }
            }
            
        }
    })
    //监听提交
    form.on('submit(save)', function (data) {
        var row = {};        
        if (!$("#tag_id").html()) {
            row.id = 0;
        } else {
            row.id = parseInt($("#tag_id").html());
        }
        row.name = data.field.title;
        com.ajax({
            action: 'save_baseinfo',
            data: {
                billType: 'CTAG',
                forBillType: '0',
                row:JSON.stringify(row)
            },
            success: function (r) {
                $("#tag_name").val("");
                layer.msg('保存成功！', {icon:1, time: 1000 });
                layer.close(index);
                dispGrid.reload();
            }
        })
        return false;
    });
    //编辑
    editTag = function (id,name) {
        $("#add_tag").click();
        $("#tag_name").val(name);
        $("#tag_id").html(id);
    }
    delTag = function (id) {
        layer.confirm('确定是否删除此数据？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            com.ajax({
                action: 'del_baseinfo',
                data: {
                    billType: 'CTAG',
                    id:id
                },
                success: function (r) {
                    layer.msg('删除成功', { icon: 1, time: 1000 });
                    layer.close(index);
                    dispGrid.reload();
                }
            })

            
        });
    }
})