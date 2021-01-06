var layer = layui.layer,
    form = layui.form;
form.verify({
    changdu: [/^\S{6,12}$/, '输入的密码有误，长度6~12位，且不能有空格'],
    diff: function (val) {
        if (val == $(".oldPwd").val()) {
            return "新密码和旧密码不能一致";
        }
    },
    same: function (val) {
        if (val != $(".newPwd").val()) {
            return '两次密码不一致哟~';
        }
    }
});

$("form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: "post",
        url: '/my/updatepwd',
        data: data,
        success: function (res) {
            if (res.status == 0) {
                layer.msg(res.message);
                $("form")[0].reset();
            }
        }
    });
});