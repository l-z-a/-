//加载列表
function getList() {
    $.ajax({
        url: "/my/article/cates",
        success: function (res) {
            if (res.status == 0) {
                var str = "";
                $.each(res.data, function (index, item) {
                    str += `<tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button myid="${item.Id}" data-name="${item.name}" data-alias="${item.alias}" type="button" class="layui-btn layui-btn-xs edit">编辑</button>
                          <button myid="${item.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger delete">删除</button>
                    </td>
                  </tr>`;
                });
                $('tbody').html(str);
            }
        }
    });

}
getList();

function add_submit(index) {
    $("#add_form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // 无论成功，还是失败，都给提示
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功，重新渲染列表
                    getList();

                    // 关闭弹出层
                    layer.close(index);
                }
            }
        });
    });
}

var add_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="add_form">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>`;

$('.layui-card-header button').click(function () {
    layer.open({
        type: 1,
        title: '添加类别',
        content: add_str,
        area: ['500px', '250px'],
        success: function (dom, index) {
            add_submit(index);
        }
    });
});

//删除
$("tbody").on('click', ".delete", function () {
    var id = $(this).attr("myid");
    layer.confirm('你忍心删除我么？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {

                    // 删除成功，重新渲染
                    getList();
                }
            }
        });

        layer.close(index);
    });
});

//编辑


$("tbody").on('click', ".edit", function () {
    var id = $(this).attr("myid");
    var name = $(this).attr("data-name");
    var alias = $(this).attr("data-alias");
    var edit_str = `
    <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="edit_form" lay-filter="abc">
      <div class="layui-form-item">
        <label class="layui-form-label">类别名称</label>
        <div class="layui-input-block">
          <input type="text" name="name" required lay-verify="required" placeholder="请输入类名" autocomplete="off" class="layui-input" value=${name}>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">类别别名</label>
        <div class="layui-input-block">
          <input type="text" name="alias" required lay-verify="required" placeholder="请输入别名" autocomplete="off" class="layui-input" value=${alias}>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-input-block">
          <input type="hidden" name="Id" value=${id}>
          <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
        </div>
      </div>
    </form>`;

    layer.open({
        type: 1,
        title: '编辑分类',
        content: edit_str,
        area: ['500px', '250px'],
        // 等弹层出来之后，执行下面的success方法
        success: function (dom, index) {
            var form = layui.form;
            form.val('abc', {
                Id: id,
                name: name,
                alias: alias
            });
            edit_submit(index);
        }
    });
});

function edit_submit(index) {
    $("#edit_form").on("submit", function (e) {
        e.preventDefault();
        var data = $(this).serialize().replace('id', 'Id');

        $.post('/my/article/updatecate', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('更新分类成功');
            // 1. 从新渲染页面
            getList();

            // 2. 关闭弹层
            layer.close(index);
        });
    });
}