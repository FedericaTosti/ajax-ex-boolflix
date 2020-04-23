$(document).ready(function(){

  // creo variabile input dove scrivo titolo
  var inputFilm = $(".input-film");

  // inizializzo template handlebars
  var source = $('#film-template').html();
  var template = Handlebars.compile(source);

  // al click su button cerco titolo
  $(".cerca-film").click(ricercaTitolo);

  // da tastiera premo invio, cerco titolo
  inputFilm.keypress(invioTasto);



  // ---- funzioni ----

  // funzione ricerca titolo
  function ricercaTitolo(){
    // creo variabile dove salvo valore input ricerca titolo
    // per query chiamata Ajax
    var valoreInputFilm = $(".input-film").val();
    console.log("Ricerca:" + valoreInputFilm);

    // chiamata Ajax per film
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

        // tutti i risultati con tutte le proprietà (array di oggetti)
        var risultatiFilm = data.results;

        for (var i = 0; i < risultatiFilm.length; i++) {

          // singolo film con tutte le proprietà
          var singoloFilm = risultatiFilm[i];

          // creo variabile per voto in stelle (diviso per 2)
          var votoStelle = Math.ceil((singoloFilm.vote_average)/2);
          console.log(votoStelle);

          // creo oggetto context che contiene tutti i dati
          var context = {
            "title" : singoloFilm.title,
            "original_title" : singoloFilm.original_title,
            "vote" : votoInStelline(votoStelle),
            "voteNumber" : singoloFilm.vote_average,
            "original_language" : linguaInBandierine(singoloFilm.original_language),
            "img" : "https://image.tmdb.org/t/p/w500" +  singoloFilm.poster_path,
            "type" : "Film"
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



    // chiamata Ajax per serie tv
    $.ajax({
      url : "https://api.themoviedb.org/3/search/tv",
      method : "GET",
      data : {
        api_key : "bc3d38b11b70258e0fc7dadd2f064524",
        language : "it-IT",
        query : valoreInputFilm
      },
      // se va tutto bene
      success: function(data) {
        console.log(data.results);

        // tutti i risultati con tutte le proprietà (array di oggetti)
        var risultatiFilm = data.results;

        for (var i = 0; i < risultatiFilm.length; i++) {

          // singolo "film" con tutte le proprietà
          var singoloFilm = risultatiFilm[i];

          // creo variabile per voto in stelle (diviso per 2)
          var votoStelle = Math.ceil((singoloFilm.vote_average)/2);
          console.log(votoStelle);

          // creo oggetto context che contiene tutti i dati
          var context = {
            "title" : singoloFilm.name,
            "original_title" : singoloFilm.original_name,
            "vote" : votoInStelline(votoStelle),
            "voteNumber" : singoloFilm.vote_average,
            "original_language" : linguaInBandierine(singoloFilm.original_language),
            "img" : "https://image.tmdb.org/t/p/w500" + singoloFilm.poster_path,
            "type" : "Serie tv"
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
  }

  // funzione che cerca film con tasto invio
  function invioTasto(e){
    var key = e.which;
    var inputCercaFilm = inputFilm.val();
    if(key == 13){ // 13 tasto invio
      ricercaTitolo();
    }
  }

  // funzione stampa stelline
  function votoInStelline(punteggio){

    // variabile vuota
    var stella="";

    // fin quando "punteggio" (poi sarà votoStelle) sarà maggiore stampo le stelline colorate
    for (var i=0; i < punteggio; i++){
      stella = stella + "<i class='fas fa-star'></i>";
    }

    // quando invece "punteggio" è inferiore di 5 stampo stellina bianca
    while (punteggio < 5){
      stella = stella + "<i class='far fa-star'></i>";
      punteggio++;
    }

    // chiudo la funz portando fuori la var stella
    return stella;
  }

  // funzione stampa bandierine
  function linguaInBandierine(lingua){

    // se "lingua" (poi sarà original_language) ha uno dei seguenti valori
    if(lingua==="de"||lingua==="en"||lingua==="es"||lingua==="fr"||lingua==="it"||lingua==="ja"||lingua==="pt"){

      // creo variabile e cerco se esiste la bandiera con lo stesso nome
      var bandierina = "<img class='lingue' src='img/" + lingua + ".png'>";

      // porto fuori l'img
      return bandierina;

      // altrimenti stampo solo la stringa
    } else{
      return lingua;
    }
  }
})
