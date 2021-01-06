$.ajaxPrefilter(function (obj) {
    obj.url = 'http://api-breakingnews-web.itheima.net' + obj.url;
    // includes()  判断字符串中是否包含指定的子字符串
    //或者还可以用indexOf()    正则表达式
    if (obj.url.includes('/my/')) {
        obj.headers = {
            'Authorization': localStorage.getItem("token")
        };
        obj.complete = function (xhr) {
            // xhr.responseJSON  就是返回的数据

            if (xhr.responseJSON && xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {

                // 删除 过期 token
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = '/login.html';
            }
        }
    }
});