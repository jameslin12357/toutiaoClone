var form, layer, element;
layui.use(['form', 'layedit', 'laydate', 'layer','element'], function () {
    form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate
        , element = layui.element;
});

var active = true;
$(window).scroll(function() {
    if (active){
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            active = false;
            var offset = document.getElementsByClassName("card").length;
            var part = window.location.pathname.slice(0,window.location.pathname.lastIndexOf('/'));
            var userid = part.slice(part.lastIndexOf('/')+1);

            $.ajax({
                type: "get",
                url: `/users?userid=${userid}&offset=${offset}`,
                //url: `https://ditu.amap.com/detail/${poiId}/?src=mypage&callnative=0`,
                dataType: "json",
                success: function (data) {
                    if (data.length === 0){
                        layer.msg("没有数据");
                    } else {
                        var wrapperCard = document.getElementById('wrapperCard');
                        var innerHTML = "";
                        data.forEach(function(user){
                            innerHTML += `      <div class="card">
                        <div class="card-body flex">
                            <div class="pt-20">
                                <div>
                                    <a class="gray mr-5px" href="/users/${user["id"]}"><img class="profileList" src="${user["src"]}"></a>
                                    <a class="gray" href="/users/${user["id"]}">${user["username"]}</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                        });
                        wrapperCard.innerHTML += innerHTML;
                        active = true;
                    }
                },
                error: function (item, err) {
                    console.log(err);
                }
            });
        }
    }

});

