var _infowindow;

var _map;

var _LatLngSP;

var _isLocation = false;

var _filterSelecteds = [];

var _markers = [];

function initProgramacao() {
  var isSearch;
  var windw = this;

  $.fn.followTo = function () {
      var $this = this,
          $window = $(windw);

      $window.scroll(function(e){
           if (($("#holder-atracoes").offset().top >= $window.scrollTop())) {
            $this.removeClass('holder-mapa-lock');
            $this.removeClass('holder-mapa-move');
            $this.addClass('holder-mapa-normal');           
          }
           else {
            if ($window.scrollTop() < ($(document).height() - 1080))
               {
                   $this.removeClass('holder-mapa-lock');
                   $this.removeClass('holder-mapa-normal');
                   $this.addClass('holder-mapa-move');
                   
               } else {
                 $this.addClass('holder-mapa-lock');
                 $this.removeClass('holder-mapa-normal');
                 $this.removeClass('holder-mapa-move');
                  }
               }
      });
  };

  $('#holder-mapa').followTo();

  


  function posAtracoes() {
    var $container = $('#holder-atracoes');
    $container.imagesLoaded( function(){
        $container.masonry({
          itemSelector : '.holder-content-atracoes:visible'
        });
    });
  }

  posAtracoes();

  var lis = '';
  $( ".filtro-oque li" ).each(function( index ) {
    var _li = "<li>"+$(this).html()+"</li>";
    if (index  > 0 && ((index+1) % 6 == 0)) {
      _li += '</ul><ul class="filtro-oque">';
    }
    lis += _li;
  });
  $(".filtro-oque").remove();
  $(".box-filtros").append('<div style="clear:both"><ul class="filtro-oque" style="float:left">'+lis+'</ul></div>');




  //location box click
  jQuery(document).bind('marker_click', function( e, infowindow, zoom, load_elm ){
    // console.log(infoData)
    loadEventLocation(infowindow,zoom,load_elm);

  });


  function loadEventLocation(infowindow,zoom,load_elm) {
    $.ajax( EM.ajaxurl, {
        dataType : 'json',
        data : "action=get_events_location&location_id="+infowindow.data.location_id+'&'+$("#wpnonce").serialize(),
        success : function(data) {
            if (load_elm) {
              load_elm.addClass("hide");
            }
            $(".list-locations-zone").hide();
            $(".list-events-location").removeClass("hide");
            $("#holder-atracoes").css("height","auto");

            $(windw).scrollTop($("#holder-atracoes").offset().top);
            _infowindow = infowindow;

            if (data && data.result) {
                $(".list-events-location").html(data.html);  
            }

            if (zoom) {
              _map.setZoom(16);
              _map.setCenter(new google.maps.LatLng(infowindow.data.location_latitude,infowindow.data.location_longitude)); 
            }
            

            window.history.pushState(null, "Programação", "/programacao/locais/"+infowindow.data.location_slug);


            $(".bt-voltar").click(function(e){
                e.preventDefault();
                $(".list-events-location").html("");  
                $(".list-locations-zone").show();
                $(".list-events-location").addClass("hide");
                $('#holder-atracoes').masonry( 'reload' );


                if (_infowindow) _infowindow.infobox.close();              


                window.history.pushState(null, "Programação", "/programacao/locais/");                
                _map.setZoom(12);                
                _map.setCenter(_LatLngSP);
            });


            $(".list-events-location").height($(".events-by-location").height()+30)

            
            enableClick($(".list-events-location"));
        }
      });
  }

  function enableOpenClose(parent) {
      parent.children('.bt-showhide-atracoes').click(function(e) {
           e.preventDefault();
           if ($(this).hasClass("bt-fechar-atracoes")) {
                $(this).addClass('bt-abrir-atracoes');
                $(this).removeClass('bt-fechar-atracoes');
                $(this).text("Abrir");
                $(this).closest('.holder-content-atracoes').children('.holder-content-atracoes-boxes').hide();
                parent.find(".hr").before($(this));
           } else {
                $(this).removeClass('bt-abrir-atracoes');
                $(this).addClass('bt-fechar-atracoes');
                $(this).text("Fechar");
                $(this).closest('.holder-content-atracoes').children('.holder-content-atracoes-boxes').show();
                parent.find(".hr").after($(this));
           }

           $('#holder-atracoes').masonry( 'reload' );
                
      });  
  }

  function enableClick(parent) {
       parent.find('.fancybox').click(function(e) {
           e.preventDefault();

           event_id = $(this).attr("rel");
           $("#event_id").val($(this).attr("rel"));

           openEvent(event_id);
           
            // $('.em-events-search select[name=state]').load( EM.ajaxurl, data );

           window.history.pushState(null, "Programação", $(this).attr("href"));
      })

      
  }





  $('.filtro-oque li a').click(function(e) {
      e.preventDefault();   
      var cat_id = $(this).attr('rel');
      var _this = $(this);
      var hasSelected;
      

      if (_isLocation) {        

        if ($(this).hasClass('selected')) {
          hasSelected = false;
          if (_filterSelecteds.indexOf(cat_id) > -1) _filterSelecteds.splice(_filterSelecteds.indexOf(cat_id),1);

          $('.box-atracoes-local').each(function(i) {
            if ($(this).hasClass('cat-'+cat_id)) {
              $(this).removeClass("filtered");
              $(this).hide();

              
            }

            if ($(this).hasClass("filtered")) {
              hasSelected = true;
            } 

          });



          if (!hasSelected) {
              $('.box-atracoes-local').show();
          }

        } else {          
           $('.box-atracoes-local').each(function(i) {
            if (!$(this).hasClass("filtered")) $(this).hide();
            if ($(this).hasClass('cat-'+cat_id)) {
                $(this).show();
                $(this).addClass("filtered");                
            }
            
          });

           _filterSelecteds.push(cat_id);
        }

        
        
        jQuery(document).triggerHandler('category_filter');
        $('#holder-atracoes').masonry( 'reload' );     
        $(this).toggleClass("selected");


        return;
      }
      

      

      if ($(this).hasClass('selected')) {
           if ($(this).hasClass('loaded')) {
                $('#category-'+cat_id ).hide();
                
           } else {
                $('#category-'+cat_id ).remove();
                
           }
           $('#holder-atracoes').masonry( 'reload' );                   

      } else {
           if ($(this).hasClass('loaded')) {
                $('#category-'+cat_id ).show();
                $('#holder-atracoes').masonry( 'reload' );     
           } else {
                $.ajax({
                     url: EM.ajaxurl,
                     dataType: 'json',
                     data: 'cat_id='+cat_id+'&action=get_events_virada&'+$("#wpnonce").serialize(),
                     type:"POST",
                     success: function(data){
                          
                          $('.filtro-oque li a').each(function() {
                               if ($(this).hasClass("selected") && $(this).hasClass("loaded") && isSearch) {
                                    $(this).removeClass("selected");
                                    $(this).removeClass("loaded");
                               }                                   
                          })

                          if (isSearch) {
                               $('#holder-atracoes').empty();
                               isSearch = false;
                               $("#tx_search").val("");
                          }

                          $('#holder-atracoes').append(data.html);
                          enableEventsByZone();
                          $('#holder-atracoes').masonry( 'reload' );

                          var holder = $('#category-'+cat_id );
                          enableOpenClose(holder);
                          enableClick(holder);
                          
                          _this.addClass("selected");
                          _this.addClass("loaded");

                     },
                     error: function(){ $('.box-filtros').css({'color':'red','display':'block'}).html('Server Error'); }
                     
                });
           }
           
      }
      $(this).toggleClass("selected");
      

      

  });


  $('.seletor li a').click(function(e) {

  $('.seletor li').removeClass("selected");
  $(this).parent().toggleClass("selected");
  });

  _selectedZones = [];

  $(".filtro-onde a").click(function(e){
      e.preventDefault();
      _this = $(this);

      // if ($(this).hasClass("selected")) {
      //      $('#holder-atracoes').find("."+$(this).attr("id")).hide();
      // } else {
      //      $('#holder-atracoes').find("."+$(this).attr("id")).show();
      // }

      if ($(this).hasClass("selected")) {
        _selectedZones.splice(_selectedZones.indexOf($(this)),1);
      } else {
        _selectedZones.push($(this));
      }

      $(".holder-content-atracoes").each(function() {
          if (_selectedZones.length > 0) {
              if (!$(this).hasClass("filtered")) $(this).hide();

              if (!_this.hasClass("selected") && $(this).hasClass(_this.attr("id"))) {
                  $(this).addClass("filtered");
                  $(this).show();
              } else if (_this.hasClass("selected") && $(this).hasClass(_this.attr("id"))) {
                  $(this).removeClass("filtered");
                  $(this).hide();
              }
          } else {
              $(this).removeClass("filtered");
              $(this).show();
          }
          
      });

      

      $(this).toggleClass("selected");
      $('#holder-atracoes').masonry( 'reload' );


  });



  function enableEventsByZone() {
      $(".filtro-onde a").each(function(){
           if (!$(this).hasClass("selected")) {
                $('#holder-atracoes').find("."+$(this).attr("id")).hide();
           }
      });
  }





  //BUSCA
  $(document).delegate('#search-events', 'submit', function(e){
      $('.filtro-oque li a').each(function() {
           if ($(this).hasClass("selected") && $(this).hasClass("loaded")) {
                $(this).removeClass("selected");
                $(this).removeClass("loaded");
           }                                   
      })

      e.preventDefault();

      $(".load-search").removeClass("hide");


      $.ajax( EM.ajaxurl, {
        dataType : 'json',
        data : $(this).serialize(),
        success : function(data) {
            $(".load-search").addClass("hide");
             if (data.result) {
                  //enableEventsByZone();

                  

                  if (data.event_id) {
                      openEvent(data.event_id)
                  } else {
                    if ($(".list-events-location").is(":visible")) {
                      $(".list-events-location").addClass("hide");
                      $(".list-locations-zone").show();
                      window.history.pushState(null, "Programação", "/programacao/locais/");
                    }
                  }

                  $('#holder-atracoes .list-locations-zone').html(data.html);
                  $('#holder-atracoes').masonry( 'reload' );
                  isSearch = true;

                  //location box trigger
                  $('.box-atracoes-local').click(function(e) {
                    $(this).find(".load-atracao").removeClass("hide");
                    var loc_id = $(this).attr("rel").substr($(this).attr("rel").indexOf("-")+1);
                    _infowindow = _markers[loc_id];

                    _infowindow.infobox.open(_map, _infowindow.marker);
                    loadEventLocation(_infowindow, true, $(this).find(".load-atracao"));
                  })


                  



                  // $(".holder-content-atracoes").each(function(){
                  //      var cat_id = $(this).attr("id").substr($(this).attr("id").indexOf("-")+1);
                  //      enableOpenClose($(this));

                  //      $('.filtro-oque li a').each(function() {
                  //           if ($(this).attr("rel") == cat_id) {
                  //                $(this).addClass("selected");
                  //                $(this).addClass("loaded");
                  //           }
                  //      })
                  // });

               $(".holder-content-atracoes").each(function(){
                     enableOpenClose($(this));
                });   
             }
                     
        }
      });
      return false;
  });



  $(".holder-content-atracoes").each(function(){
       enableOpenClose($(this));
  });   
}

function openEvent(event_id) {
  $.ajax({
     url: EM.ajaxurl,
     dataType: 'json',
     data: 'event_id='+event_id+'&action=get_event_ajax',
     type:"POST",
     success: function(data){
          $("#agenda_exemplo .bg_modal").html(data.html);
          
          $.fancybox({
             width  : 980,
             height : 749,
             fitToView : false,
             autoSize  : false,
             openEffect  : 'none',
             closeEffect : 'none', 
             padding : 0,
             // href: $(this).attr("href") + "?event_id="+$(this).attr("rel"),
             href: "#agenda_exemplo"
             
           });

          console.log("ae")
          em_maps();

     },
     error: function(){ $('.box-filtros').css({'color':'red','display':'block'}).html('Server Error'); }
     
});

       
        // $('.em-events-search select[name=state]').load( EM.ajaxurl, data );

  
      // $.fancybox.open({
      //   width  : 980,
      //   height : 749,
      //   fitToView : false,
      //   autoSize  : false,
      //   openEffect  : 'none',
      //   closeEffect : 'none', 
      //   padding : 0,
      //   href : "#agenda_exemplo"
      // });
    }