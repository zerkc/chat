/**
 * Created by gustavog on 15/10/16.
 */
var lock = false;
var lockbyspan = false;
var messageCount = 0;
var alert =0;
$(document).ready(function(){
    var first = true;
    for(var i = 1;i<100;i++){

        var urlImage = "image/songaSpa"+i+".png";
        try {
            if(imageExists(urlImage)){
                var c = "";
                if(first) {
                    first = false;
                    c = "active";
                    }
                $('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + (i - 1) + '" class="'+c+'"></li>');
                $('.carousel-inner').append('<div class="'+c+' item">  <img src="' + urlImage + '" class="img-responsive"></div>')
            }else{
                break;
            }
        }catch(err){
            break;
        }
    }
    $('.carousel').carousel({interval: 2000});
    $('#btn-chat').click(sendMessage);
    $("#btn-input").keyup(function(e){
        if(e.keyCode == 13) sendMessage();
    });
    getMessages(1);
    setInterval(getMessages,1000);
    setInterval(function (){ messageCount = 0; },5000);
});
function sendMessage(){
    if(messageCount == 10){
        lockbyspan =true;
        setInterval(function(){lockbyspan=false},60000);
    }
    if(lockbyspan){
        addMessage("Se ah bloqueado el envio de mensajes por 1 minuto(s)",false,--alert);
    }
    var valor = $("#btn-input").val();
    if(valor == null || valor == undefined || valor == "" || valor.replace(/\ /g,"") == "" || lock) return false;
    lock = true;
    var scrolled=0;
    $.ajax({
        url:"background-chat.php",
        method:"POST",
        data:{send:"",username:"",message:$("#btn-input").val()},
        success:function(data){
            console.log(data);
            getMessages();
            lock = false;
        }
    });
    scrollButtom();
    $("#btn-input").val("");
}
function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}
function getMessages(reset){
    var urlAdd ="";
    if(reset != undefined) urlAdd="?q=reset";

    $.ajax({
        url:"background-chat.php"+urlAdd,
        success:function(data){
            if(data != "") {
                data = JSON.parse(data);
                for (var i = 0; i < data.length; i++) {
                    if($('#messageID_'+data[i].id).length == 0) {
                        addMessage(data[i].message, data[i].isMe, data[i].id);
                        scrollButtom();
                    }
                }

            }
        }
    });
}
function scrollButtom(){
    scrolled = 0;
    $(".msg_container").each(function(){
        scrolled += $(this).height()+50;
    });
    $("#Messages").animate({
        scrollTop: scrolled
    });
}
function addMessage(message,isMe,id){
    var principalDiv = $('<div id="messageID_'+id+'" class="row msg_container base_sent"></div>');
    var secoundDiv =   $('<div class="col-md-10 col-xs-10 "></div>');
    var divMessage = $('<div class="messages msg_sent"></div>');
    divMessage.append($('<p></p>').append(message));
    //<time datetime="2009-11-13T20:00">Timothy • 51 min</time>
    var divImage = $('<div class="col-md-2 col-xs-2 avatar"></div>');

    divImage.append('<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">');
    secoundDiv.append(divMessage);
    if(isMe) {
        principalDiv.append(secoundDiv);
        principalDiv.append(divImage);
    }else{
        principalDiv.append(divImage);
        principalDiv.append(secoundDiv);
    }
    $("#Messages").append(principalDiv);
}
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
    size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chat_window_1" ).remove();
});
