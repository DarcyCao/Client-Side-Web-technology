/**
 */
//http://api.jquery.com/jquery.getjson/
(function (){
    var time = 0;
    $(document).ready(function () {
        $.ajax(
            {
                url: "http://csw08724.appspot.com/breeds.ajax",
                dataType: "json",
                type: "GET",
                success: function(data, textStstus, jqXHR) {
                    for (var i in data) {
                        var name = data[i].name;
                        var id = data[i].id;
                        $('#select').append($("<option></option>>").attr("value",id).text(name));
                    }
                }
            }
        );
        retrieval(1);
        $( "#select" ).change(function() {
            $('#imgsrc').removeAttr("src");
            $('div').remove(".extra");
            clearInterval(time);
            retrieval(event.target.value);
        });
    });

    function retrieval(value) {
        $.ajax(
            {
                url: "http://csw08724.appspot.com/breed.ajax?id=" + value.toString(),
                dataType: "json",
                type: "GET",
                success: function(data, textStstus, jqXHR) {
                    $('#nameofdog').text(data.name);
                    $('#description').text(data.description);
                    $('#origin').text(data.origins);
                    $('#isitright').text(data.rightForYou);
                    var imageurl = "http://csw08724.appspot.com/" + data.imageUrl.toString();
                    $("<div></div>",{"class": "extra"}).appendTo('#slideshow').append($("<img>").attr("src", imageurl));
                    var j = data["extraImageUrls"];
                    for (var i in j) {
                        var imgurl = "http://csw08724.appspot.com/" + j[i].toString();
                        //$('#slideshow').append($("<div></div>").attr("src", imgurl));
                        $("<div></div>",{"class": "extra"}).appendTo('#slideshow').append($("<img>").attr("src", imgurl));
                        //$('#slideshow').append($("<div></div>").attr("class", "extra"));
                    }
                    $("#slideshow > div:gt(0)").hide();
                    time = setInterval(function() {
                        $('#slideshow > div:first')
                            .slideUp(1000)
                            .next()
                            .slideDown(1000)
                            .end()
                            .appendTo('#slideshow');
                    },  6000);
                }
            }
        )
    }
})();
