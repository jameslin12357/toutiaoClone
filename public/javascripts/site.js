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
            var topicid = "";
            var pathname = window.location.pathname;
            if (pathname === "/"){
                topicid = 1;
            } else {
                if (pathname === "/videos/hot"){
                    topicid = 2;
                }
                else if (pathname === "/videos/live"){
                    topicid = 3;
                }
                else if (pathname === "/videos/tech"){
                    topicid = 4;
                }
                else if (pathname === "/videos/ent"){
                    topicid = 5;
                }
                else if (pathname === "/videos/games"){
                    topicid = 6;
                }
                else if (pathname === "/videos/sports"){
                    topicid = 7;
                }
                else if (pathname === "/videos/cars"){
                    topicid = 8;
                }
                else if (pathname === "/videos/finance"){
                    topicid = 9;
                }
                else if (pathname === "/videos/funny"){
                    topicid = 10;
                }
            }

               $.ajax({
                   type: "get",
                   url: `/videos?topicid=${topicid}&offset=${offset}`,
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