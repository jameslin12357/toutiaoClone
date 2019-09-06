var active = true;
$(window).scroll(function() {
    if (active){
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            active = false;
            var offset = document.getElementsByClassName("card").length;
               $.ajax({
                   type: "get",
                   url: `./videos?topicid=1&offset=${offset}`,
                   //url: `https://ditu.amap.com/detail/${poiId}/?src=mypage&callnative=0`,
                   dataType: "json",
                   success: function (data) {
                       console.log(data);
                   },
                   error: function (item, err) {
                       console.log(err);
                   }
               });
        }
    }

});