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
                url: `/users3?userid=${userid}&offset=${offset}`,
                //url: `https://ditu.amap.com/detail/${poiId}/?src=mypage&callnative=0`,
                dataType: "json",
                success: function (data) {
                    if (data.length === 0){
                        layer.msg("没有数据");
                    } else {
                        var wrapperCard = document.getElementById('wrapperCard');
                        var innerHTML = "";
                        data.forEach(function(comment){
                            innerHTML += `       <div class="card">

                        <div class="card-body flex ai-center">

                            <div class="mt-10">
                                <h5 class="card-title mb-0">${comment["body"]}</h5>


                                <div>
                                    <span class="gray">${ moment(comment["created"]).startOf('hour').fromNow() }</span>

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

