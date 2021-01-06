var laypage = layui.laypage,
    layer = layui.layer,
    form = layui.form;
var data = {
    pagenum: 1, // 获取第1页的数据
    pagesize: 2, // 每页显示2条数据
};
list();

function list() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            if (res.status == 0) {
                var str = "";
                $.each(res.data, function (index, item) {
                    str += `<tr>
                        <td>${item.title}</td>
                        <td>${item.cate_name}</td>
                        <td>${item.pub_date.slice(0, item.pub_date.length-4)}</td>
                        <td>${item.state}</td>
                        <th>
                          <!-- 编辑按钮 -->
                          <a href="/article/edit/edit.html?id=${item.Id}" class="layui-btn layui-btn-xs">编辑</a>
                          <!-- 删除按钮 -->
                          <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger danger">删除</button>
                        </th>
                      </tr>`;
                });
                $('tbody').html(str);
                page(res.total);
            }

        }
    });
}
//分页
function page(total) {
    laypage.render({
        // 容器的id值；
        elem: 'page',

        // 数据总数
        count: total,
        limit: data.pagesize, // 每页显示条数
        curr: data.pagenum, // 起始页，当前页

        limits: [2, 3, 5, 10], // 下拉框的值，表示每页多少条，下拉框用于更换
        layout: ['prev', 'page', 'next', 'count', 'limit', 'skip'],

        // 刷新页面 及 页码切换 的时候，会执行jump函数
        jump: function (obj, first) {
            // first: jump第一次触发，first=true;  除此之外，first=undefined
            if (first === undefined) {
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                list();
            }
        }
    });
}


//删除
$("tbody").on("click", ".danger", function () {
    var id = $(this).attr("data-id");
    layer.confirm('是否要删除？', function (index) {

        // 点击确定，执行这里的代码
        $.ajax({
            url: '/my/article/delete/' + id,
            success: function (res) {

                layer.msg(res.message);
                if (res.status === 0) {

                    layer.close(index);
                    data.pagenum = 1;
                    list();
                }
            }
        });
    });
});

//加载分类数据
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        console.log(res);
        if (res.status == 0) {
            var str = `<option value="">所有分类</option>`;
            $.each(res.data, function (index, ele) {
                str += `<option value="${ele.Id}">${ele.name}</option>`;
            });
            $('#category').html(str);
            form.render('select');
        }
    }
});


//筛选
$('.search').on('submit', function (e) {
    e.preventDefault();
    // 获取下拉框的值
    var arr = $(this).serializeArray();

    // 修改请求参数，发送ajax请求即可
    data.cate_id = arr[0].value;
    data.state = arr[1].value;

    // 重置一下pagenum（筛选之后，也是应该先看到第1页的数据）
    data.pagenum = 1;
    list();
});