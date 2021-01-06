var form = layui.form;
$.ajax({
    url: '/my/article/cates',
    success: function (res) {

        if (res.status == 0) {
            var str = `<option value="">所有分类</option>`;
            $.each(res.data, function (index, item) {
                str += `<option value="${item.Id}">${item.name}</option>`;
            });
            $('select').html(str);
            form.render('select'); // 重新创建div结构
        }
    }
});
initEditor();
$('#image').cropper({
    // 宽高比例
    aspectRatio: 400 / 280,
    // 预览区容器的类名
    preview: '.img-preview'
});


$('.btn').click(function () {
    $('#file').click();
});


// 文件域的内容改变的时候，更换剪裁区的图片
$('#file').change(function () {
    // 3.1) 先找到文件对象
    var fileObj = this.files[0];

    // 3.2) 为选择的图片生成一个临时的url
    var url = URL.createObjectURL(fileObj);
    $('#image').cropper("replace", url);
});



$("form").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(this);
    fd.set('content', tinyMCE.activeEditor.getContent());

    // 剪裁图片后canvas对象
    var canvas = $('#image').cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });

    // 把图片转成 blob 形式 ： 对象形式
    canvas.toBlob(function (blob) {

        // 把 文件 追加到fd中
        fd.append('cover_img', blob);

        // 完成添加
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 提交formdata数据，必须加下面两个选项
            processData: false,
            contentType: false,
            success: function (res) {

                layer.msg(res.message);
                if (res.status === 0) {
                    // 地址栏发生转跳
                    location.href = '/article/list/list.html';

                    // 相对于的a要亮起来；
                    var dom = window.parent.document.querySelector("#article_dd");
                    $(dom).addClass("layui-this").next().removeClass("layui-this");
                }
            }
        });
    });
})