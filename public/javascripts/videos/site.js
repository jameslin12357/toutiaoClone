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
            var videoid = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1);

            $.ajax({
                type: "get",
                url: `/comments?videoid=${videoid}&offset=${offset}`,
                //url: `https://ditu.amap.com/detail/${poiId}/?src=mypage&callnative=0`,
                dataType: "json",
                success: function (data) {
                    if (data.length === 0){
                        layer.msg("没有数据");
                    } else {
                        var wrapperCard = document.getElementById('wrapperCard');
                        var innerHTML = "";
                        data.forEach(function(comment){
                            innerHTML += `           <div class="card">

                                    <div class="card-body flex ai-center">

                                        <div class="mt-10">
                                            <div class="mb-5px">
                                                <a class="gray mr-5px" href="/users/${ comment["id"] }"><img class="profileList" src="${ comment["src"] }"></a>
                                                <a class="gray mr-5px" href="/users/${ comment["id"] }">${ comment["username"] }</a>
                                                <span class="gray">${ moment(comment["created"] ).startOf('hour').fromNow() }</span>

                                            </div>
                                            <h5 class="card-title mb-0">${ comment["body"] }</h5>



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
    buttonDelete.addEventListener("click", function(e) {
        var currentVideo = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1);
        layer.open({
            btn: [],
            //               yes: function(index, layero){
            //  //按钮【按钮一】的回调
            //                   document.getElementsByTagName('form')[0].submit();
            //},
            shade: 0,
            title: "删除视频",
            content: `<div><div class="mb-15 text-center">确定删除视频?</div><div class="tr"><a href="/videos/delete/${currentVideo}" class="btn btn-outline-danger btn-sm fr" role="button">删除</a></div></div>`

        });
        //var container = document.createElement('div');
        //container.setAttribute("class", "modalSmall");
        //container.classList.add("modalCentered");
        //container.innerHTML += `<div class="flex sb mb-10"><span class="bb-lightblue">删除楼宇</span><button type="button" class="layui-btn layui-btn-normal layui-btn-radius layui-btn-sm" onclick="closeModal(this);">X</button></div>
        //            <div class="mb-15 tc">确定删除楼宇?</div><div class="tr"><button type="button" class="layui-btn layui-btn-danger" data-guid=${dataGuid} onclick="deletePoiFinal2(this);">删除</button></div></div>`;
        //document.getElementsByTagName("body")[0].appendChild(container);
    }, 1500);


}

if (document.getElementById('linkLogout')){
 var buttonComment = document.getElementById('buttonComment');
 var inputComment = document.getElementById('inputComment');
 buttonComment.addEventListener('click', function(e){
    var value = inputComment.value;
     var currentUser = document.getElementById('currentUser').getAttribute("data-currentUser");
     var currentUsername = document.getElementById('currentUser').innerText;
     var videoid = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1);;
     if (value.length === 0){
        layer.msg("留言不能为空");
    } else {
        $.ajax({
            type: "post",
            url: `/comments`,
            data: { "body":value, "userid":currentUser, "videoid":videoid},
            dataType: "json",
            success: function (data) {
                inputComment.value = "";
                var card = document.createElement('div');
                card.classList.add('card');
                var innerHTML = `
                

                                    <div class="card-body flex ai-center">

                                        <div class="mt-10">
                                            <div class="mb-5px">
                                                <a class="gray mr-5px" href="/users/${currentUser}"><img class="profileList" src="/images/profile.png"></a>
                                                <a class="gray mr-5px" href="/users/${currentUser} %>">${currentUsername}</a>
                                                <span class="gray">${ moment(data[0]["created"]).startOf('hour').fromNow() }</span>

                                            </div>
                                            <h5 class="card-title mb-0">${data[0]["body"]}</h5>



                                        </div>

                                    </div>
                                
                `;
                card.innerHTML = innerHTML;
                var wrapperCards = document.getElementById("wrapperCards");
                wrapperCards.insertBefore(card, wrapperCards.firstChild);
                // document.getElementById("wrapperCards").appendChild(card);
                document.getElementById('commentsCount').innerText = String(Number(document.getElementById('commentsCount').innerText)+1);
                layer.msg("已添加评论");
            },
            error: function (item, err) {
                console.log(err);
            }
        });
    }
 });

}








