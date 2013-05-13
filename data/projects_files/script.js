$(document).ready(function() {

  //Replace Placeholder
  if(!Modernizr.input.placeholder){
    $("input").each(function(){
      if($(this).val()=="" && $(this).attr("placeholder")!=""){
        $(this).val($(this).attr("placeholder"));
        $(this).focus(function(){
          if($(this).val()==$(this).attr("placeholder")) $(this).val("");
        });
        $(this).blur(function(){
          if($(this).val()=="") $(this).val($(this).attr("placeholder"));
        });
      }
    });
  }



  var $container = $('#container');

  $container.imagesLoaded( function(){
    $container.masonry({
      itemSelector : '.box'
    });

    $(window).on("orientationchange", function() {
      
       $container.masonry( 'reload' )
    }, false);
  });



});


jQuery.extend(jQuery.validator.messages, {
    required: "* campo obrigatório",
    email: "* entre com um e-mail válido",
    date: "* entre com uma data válida",
    number: "* somente números",
    maxlength: jQuery.validator.format("* máximo de {0} caracteres."),
    minlength: jQuery.validator.format("* mínimo de {0} caracteres."),
    max: jQuery.validator.format("* abaixo de {0}."),
    min: jQuery.validator.format("* acima de {0}.")
});



function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " anos";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " meses";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " dias";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " horas";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutos";
    }
    return Math.floor(seconds) + " segundos";
}


function getHashtag(container) {
  $.ajaxSetup({ cache: true });

  $.ajax({
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    url: 'http://search.twitter.com/search.json?rpp=5&q=viradacultural',
    success: function(data) {
      $.each(data.results, function(i, tweet) {
        //console.log(tweet);

        if(tweet.text !== undefined) {
          var date_tweet = new Date(tweet.created_at);
          var hours = timeSince(date_tweet);

          var tweet_html = '<div class="mention">';
          tweet_html += '<div class="thumb"><img src="'+tweet.profile_image_url+'" width="48" height="48" /></div>';
          tweet_html += '<div class="mention-content">';
          tweet_html += '<h4><a href="http://www.twitter.com/';
          tweet_html += tweet.from_user + '/status/' + tweet.id + '">';
          tweet_html += '@'+tweet.from_user+'</a></h4>';
          tweet_html += '<p class="tweet">'+ tweet.text + '</p>';
          tweet_html += '<p class="time">' + hours + ' atrás</p>';
          tweet_html += '</div><br class="clear" />';
          tweet_html += '<hr /></div>';

         container.append(tweet_html);
        }
      });
    }
  });
}