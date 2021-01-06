var layer = layui.layer,
    form = layui.form;

function get_info() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            // 完成数据回填
            // $('input[name=username]').val(res.data.username);
            // $('input[name=nickname]').val(res.data.nickname);
            // $('input[name=email]').val(res.data.email);
            form.val('user', res.data);
        }
    });
}
get_info();
$("form").on("submit", function (e) {
    e.preventDefault();
    //获取表单中的所有值    layui的方法
    var data = form.val("user");

    //提交数据
    $.ajax({
        type: "post",
        url: "/my/userinfo",
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 需要回到index页面，对获取信息的方法进行封装！
                window.parent.getInfo();
            }
        }
    });
});


$(".reset").on("click", function (e) {
    e.preventDefault();
    get_info();
});