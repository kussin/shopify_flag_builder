(function(){
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  
    $(".grid__item small--one-half medium-up--one-fifth").append("Some appended text.");
})()
