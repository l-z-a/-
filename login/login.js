var layer = layui.layer,
    form = layui.form;
//登录和注册窗口的切换
$('#goto-register').on('click', function () {
    $('#login').hide();
    $('#register').show();
});
$('#goto-login').on('click', function () {
    $('#register').hide();
    $('#login').show();
});


//注册功能
//验证
form.verify({
    changdu: [/^\S{6,12}$/, '输入的密码有误，长度6~12位，且不能有空格'],

    // 使用函数
    same: function (val) {
        // 获取某个地方的值
        var pwd = $('#pwd').val();

        // val:要验证的值
        if (pwd !== val) {
            return '两次密码不一致哟~';
        }

    }

});
//注册的提交数据
$("#register form").on('submit', function (e) {
    e.preventDefault();
    var params = $(this).serialize();
    $.ajax({
        url: '/api/reguser',
        type: 'post',
        data: params,
        success: function (res) {
            layer.msg(res.message);
            if (res.status == 0) {
                $('#register').hide();
                $('#login').show();

            }
            $("#register .layui-form")[0].reset();
        }
    });
});
//登录的提交数据
$("#login form").on('submit', function (e) {
    e.preventDefault();
    var params = $(this).serialize();
    $.ajax({
        url: '/api/login',
        type: 'post',
        data: params,
        success: function (res) {
            layer.msg(res.message);
            if (res.status == 0) {
                localStorage.setItem("token", res.token);
                location.href = "../index.html";
            }

        }
    });
})