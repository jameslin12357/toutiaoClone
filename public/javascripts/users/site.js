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
            var userid = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1);

            $.ajax({
                type: "get",
                url: `/videos2?userid=${userid}&offset=${offset}`,
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

if (document.getElementById('linkLogout') && document.getElementById('special')){
    var buttonFollow = document.getElementById('buttonFollow');
    buttonFollow.addEventListener("click", function(e){
        var following = e.target.getAttribute("data-userid");
        var followed = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1);
        var text = e.target.innerText;
        if (text === "关注"){
            $.ajax({
                type: "post",
                url: `/userfollowings`,
                data: { "following":following, "followed":followed},
                dataType: "json",
                success: function (data) {
                    e.target.innerText = "取消关注";
                    document.getElementById('userfollowerscount').innerText = String(Number(document.getElementById('userfollowerscount').innerText)+1);
                    layer.msg("已关注用户");
                },
                error: function (item, err) {
                    console.log(err);
                }
            });
        } else {
            $.ajax({
                type: "post",
                url: `/deleteuserfollowings`,
                data: { "following":following, "followed":followed},
                dataType: "json",
                success: function (data) {
                    e.target.innerText = "关注";
                    document.getElementById('userfollowerscount').innerText = String(Number(document.getElementById('userfollowerscount').innerText)-1);
                    layer.msg("已取消关注用户");
                },
                error: function (item, err) {
                    console.log(err);
                }
            });
        }
    });
}

if (document.getElementById('linkLogout') && document.getElementById('special2')) {
    var buttonDelete = document.getElementById('buttonDelete');
    function deleteUser(e){
        var currentUser = document.getElementById('currentUser').getAttribute("data-currentUser");
        // $.ajax({
        //     type: "post",
        //     url: `/users/delete/${currentUser}`,
        //     dataType: "json",
        //     success: function (data) {
        //         // e.target.innerText = "关注";
        //         // document.getElementById('userfollowerscount').innerText = String(Number(document.getElementById('userfollowerscount').innerText)-1);
        //         // layer.msg("已取消关注用户");
        //     },
        //     error: function (item, err) {
        //         console.log(err);
        //     }
        // });
    }
    buttonDelete.addEventListener("click", function(e) {
        var currentUser = document.getElementById('currentUser').getAttribute("data-currentUser");
        layer.open({
            btn: [],
            //               yes: function(index, layero){
            //  //按钮【按钮一】的回调
            //                   document.getElementsByTagName('form')[0].submit();
            //},
            shade: 0,
            title: "删除用户",
            content: `<div><div class="mb-15 text-center">确定删除用户?</div><div class="tr"><a href="/users/delete/${currentUser}" class="btn btn-outline-danger btn-sm fr" role="button">删除</a></div></div>`

        });
        //var container = document.createElement('div');
        //container.setAttribute("class", "modalSmall");
        //container.classList.add("modalCentered");
        //container.innerHTML += `<div class="flex sb mb-10"><span class="bb-lightblue">删除楼宇</span><button type="button" class="layui-btn layui-btn-normal layui-btn-radius layui-btn-sm" onclick="closeModal(this);">X</button></div>
        //            <div class="mb-15 tc">确定删除楼宇?</div><div class="tr"><button type="button" class="layui-btn layui-btn-danger" data-guid=${dataGuid} onclick="deletePoiFinal2(this);">删除</button></div></div>`;
        //document.getElementsByTagName("body")[0].appendChild(container);
    }, 1500);


}


