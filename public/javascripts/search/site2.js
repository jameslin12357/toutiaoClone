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
            var search = window.location.search.slice(window.location.search.lastIndexOf('=')+1);
            $.ajax({
                type: "get",
                url: `/searchByFiltered?search=${search}&offset=${offset}`,
                //url: `https://ditu.amap.com/detail/${poiId}/?src=mypage&callnative=0`,
                dataType: "json",
                success: function (data) {
                    if (data.length === 0){
                        layer.msg("没有数据");
                    } else {
                        var wrapperCard = document.getElementById('wrapperCard');
                        var innerHTML = "";
                        data.forEach(function(video){
                            innerHTML += `     <div class="card">

          <div class="card-body flex">
            <div class="mr-15">
              <video controls class="videoList" poster="/images/poster.png">

                <source src="${video["videosrc"]}"
                        type="video/mp4">
              </video>
            </div>
            <div class="pt-20">
              <a class="black" href="/videos/${video["videoid"]}"><h5 class="card-title">${video["title"]}</h5></a>


              <div>
                <a class="gray mr-5px" href="/users/${video["id"]}"><img class="profileList" src="${video["src"]}"></a>
                <a class="gray mr-5px" href="/users/${video["id"]}">${video["username"]}</a>
                                <span class="gray">${video["count"]}评论</span>

                <span class="gray">${moment(video["created"]).startOf('hour').fromNow()}</span>
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
