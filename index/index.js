//判断本地有没有token   如果没有是偷偷过来的，如果有，证明用户登陆了
if (!localStorage.getItem('token')) {
    location.href = '/login.html';
}

//防止用户长时间不操作（保护用户登录信息）

//获取用户信息
$.ajax({
    url: "http://ajax.frontend.itheima.net/my/userinfo",
    //设置请求头
    headers: {
        'Authorization': localStorage.getItem("token")
    },
    success: function (res) {
        if (res.status == 0) {
            var name = res.data.nickname || res.data.username;
            $(".username").html(name);
            if (res.data.user_pic) {
                $('.layui-nav-img').attr('src', res.data.user_pic).show();
                $('.avatar').hide();
            } else {
                var first = name.substr(0, 1).toUpperCase();
                $('.layui-nav-img').hide();
                $('.avatar').text(first).css('display', 'inline-block');
            }
        }
    },
    complete: function (xhr) {
        // xhr.responseJSON  就是返回的数据

        if (xhr.responseJSON && xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {

            // 删除 过期 token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';
        }
    },
});

//退出功能
var layer = layui.layer;
$('#logout').click(function () {
    // 弹出层，询问是否要退出
    layer.confirm('你确定退出吗？你退出了还得登录，你想好了吗？', function (index) {

        // 如果点击了确定，删除token，页面跳转
        localStorage.removeItem('token');
        location.href = '/login.html';
        layer.close(index); // 关闭当前弹出层
    });
});