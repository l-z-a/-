// ---------------  创建剪裁区
// - 调用cropper方法，创建剪裁区
$('#image').cropper({
    // 纵横比(宽高比)
    aspectRatio: 1, // 正方形
    // 指定预览区域
    preview: '.img-preview' // 指定预览区的类名（选择器）
});

$(".shang").on("click", function () {
    $('#file').click();
});
//change事件   只要文件或者下拉选择框发生改变，就能监听到
$("#file").change(function () {
    var obj = this.files[0];
    var url = URL.createObjectURL(obj);
    $('#image').cropper("replace", url);
});

$('.sure').click(function () {
    // 4.1）调用插件方法，剪裁图片；剪裁之后得到一张canvas格式的图片
    var canvas = $('#image').cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    });
    // 4.2) 把canvas图片转成base64格式，得到超长字符串
    //       
    var base64 = canvas.toDataURL('image/png');

    // 4.3) ajax提交url编码 提交字符串，完成更新
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: base64
        },
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 重新渲染父页面的头像
                window.parent.getInfo();
            }
        }
    });
});