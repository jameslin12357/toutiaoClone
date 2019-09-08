// function delete_cookie (name) {
//     document.cookie = name + '=;Path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// };
//
// setTimeout(function(){ delete_cookie("sid"); }, 3000);


var form, layer, element;
layui.use(['form', 'layedit', 'laydate', 'layer','element'], function () {
    form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate
        , element = layui.element;
    layer.msg("用户已删除");

});



