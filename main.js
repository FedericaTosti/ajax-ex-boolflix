$(document).ready(function(){

  // creo variabile input dove scrivo film
  var inputFilm = $(".input-film");

  // inizializzo template handlebars
  var source = $('#film-template').html();
  var template = Handlebars.compile(source);

  // al click su button cerco film
  $(".cerca-film").click(ricercaFilm);

  // da tastiera premo invio, cerco film
  inputFilm.keypress(invioTasto);



  // ---- funzioni ----

  // funzione ricerca film
  function ricercaFilm(){
    // creo variabile dove salvo valore input ricerca film
    // per query chiamata Ajax
    var valoreInputFilm = $(".input-film").val();
    console.log("Ricerca:" + valoreInputFilm);

    // chiamata Ajax
    $.ajax({
      url : "https://api.themoviedb.org/3/search/movie",
      method : "GET",
      data : {
        api_key : "bc3d38b11b70258e0fc7dadd2f064524",
        language : "it-IT",
        query : valoreInputFilm
      },
      // se va tutto bene
      success: function(data) {
        console.log(data.results);

        // tutti i risultati con tutte le proprietà
        var risultatiFilm = data.results;

        for (var i = 0; i < risultatiFilm.length; i++) {

          // singolo film con tutte le proprietà
          var singoloFilm = risultatiFilm[i];

          // creo oggetto context che contiene tutti i dati
          var context = {
            "title" : singoloFilm.title,
            "original_title" : singoloFilm.original_title,
            "vote" : singoloFilm.vote_average,
            "original_language" : singoloFilm.original_language
          };

          // stampo in pagina tramite handlebars
          var html  = template(context);
          $(".container-film").append(html);
        }

        // azzero input ricerca
        $(".input-film").val('');

      },
      // se ci sono errori
      error: function(richiesta, stato, errori) {
        alert("Si è verificato un errore. " + errori);
        console.log("Si è verificato un errore: ", richiesta, stato, errori);
      }
    });

    // cancello tutti i film in pagina
    $(".container-film").html('');
  }


  // funzione che cerca film con tasto invio
  function invioTasto(e){
    var key = e.which;
    var inputCercaFilm = inputFilm.val();
    if(key == 13){ // 13 tasto invio
      ricercaFilm();
    }
  }


})
