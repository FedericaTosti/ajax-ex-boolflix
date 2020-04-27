$(document).ready(function(){

  // creo variabile apiKey personale
  var apiKeyMio = "bc3d38b11b70258e0fc7dadd2f064524";

  // creo variabili link film e tv
  var linkFilm = "https://api.themoviedb.org/3/search/movie";
  var linkTv = "https://api.themoviedb.org/3/search/tv";

  // creo variabile input dove scrivo titolo
  var inputFilm = $(".input-film");

  // inizializzo template handlebars
  var source = $('#film-template').html();
  var template = Handlebars.compile(source);

  // al click su button cerco titolo
  $(".cerca-film").click(ricercaTitolo);

  // da tastiera premo invio, cerco titolo
  inputFilm.keypress(invioTasto);

  // mouseover per mostrare info e nascondere l'img della ricerca
  $(".container-film").on("mouseover", ".cover-film",function(){
    $(this).children(".cover-film-img").hide();
    $(this).children(".cover-film-info").show();
  });

  // mouseleave per nascondere info e mostrare l'img della ricerca
  $(".container-film").on('mouseleave', ".cover-film",function(){
    $(this).children(".cover-film-info").hide();
    $(this).children(".cover-film-img").show();
  });




  // -------  funzioni  -------

  // funzione ricerca titolo
  function ricercaTitolo(){
    // creo variabile dove salvo valore input ricerca titolo
    // per query in data nella chiamata Ajax
    var valoreInput = $(".input-film").val();
    console.log("Ricerca:" + valoreInput);

    // funzione chiamata ajax per film
    chiamataAjax(linkFilm, apiKeyMio, valoreInput, "film");

    // funzione chiamata ajax per serie tv
    chiamataAjax(linkTv, apiKeyMio, valoreInput, "tv");

    // cancello tutti i risultati in pagina
    $(".container-film").html('');
  }

  // funzione che cerca titolo con tasto invio
  function invioTasto(e){
    var key = e.which;
    var inputCercaFilm = inputFilm.val();
    if(key == 13){ // 13 tasto invio
      ricercaTitolo();
    }
  }

  // funzione ajax generale
  function chiamataAjax(urlArgs, apiKey, queryArgs, genere) {

    $.ajax({
      url : urlArgs,
      method : "GET",
      data : {
        api_key : apiKey,
        language : "it-IT",
        query : queryArgs
      },
      // se va tutto bene
      success: function(data) {
        console.log(data.results);

        // tutti i risultati con tutte le proprietà (array di oggetti)
        var risultatiRicerca = data.results;

        // se non ci sono risultati, avviso l'utente
        if (risultatiRicerca.length <= 0) {

          // stampo in pagina
          $(".container-film").html("<h1>Ricerca non trovata</h1>");

          // altrimenti prosegui
        } else {

          outputAjaxSuccess(risultatiRicerca, genere);
        }

        // azzero input ricerca
        $(".input-film").val('');
      },

      // se ci sono errori
      error: function(richiesta, stato, errori) {
        alert("Si è verificato un errore. " + errori);
        console.log("Si è verificato un errore: ", richiesta, stato, errori);
      }
    })
  }

  // funzione output generale
  function outputAjaxSuccess(listaRichiesta, genere) {

    for (var i = 0; i < listaRichiesta.length; i++) {

      // singolo titolo con tutte le proprietà
      var singoloTitolo = listaRichiesta[i];

      // creo variabile per voto in stelle (diviso per 2)
      var votoStelle = Math.ceil((singoloTitolo.vote_average)/2);
      console.log(votoStelle);

      // se genere è film
      if (genere === "film"){
        var titolo = singoloTitolo.title;
        var titoloOriginale = singoloTitolo.original_title;

        // se genere è tv
      } else if (genere === "tv"){
        titolo = singoloTitolo.name;
        titoloOriginale = singoloTitolo.original_name;
      };

      // controllo se titolo === titoloOriginale
      if (titolo === titoloOriginale) {

        // se si creo oggetto context che contiene tutti i dati tranne titoloOriginale
        var context = {
          "title" : titolo,
          "vote" : votoInStelline(votoStelle),
          "voteNumber" : singoloTitolo.vote_average,
          "original_language" : linguaInBandierine(singoloTitolo.original_language),
          "img" : "https://image.tmdb.org/t/p/w342" + singoloTitolo.poster_path,
          "type" : genere,
          "plot" : gestiscoOverview(singoloTitolo)
          // "plot" : singoloTitolo.overview.substring(0, 470) + "[...]"
        };

        // altrimenti modifico oggetto context aggiungendo titoloOriginale
      } else{
        context = {
          "title" : titolo,
          "TitoloOriginale" : "Titolo Originale: ",
          "original_title" : titoloOriginale,
          "vote" : votoInStelline(votoStelle),
          "voteNumber" : singoloTitolo.vote_average,
          "original_language" : linguaInBandierine(singoloTitolo.original_language),
          "img" : "https://image.tmdb.org/t/p/w342" + singoloTitolo.poster_path,
          "type" : genere,
          "plot" : gestiscoOverview(singoloTitolo)
          // "plot" : singoloTitolo.overview.substring(0, 470) + "[...]"
        };
      }

      // se singoloTitolo non ha una copertina aggiungo io una copertina di default
      if (singoloTitolo.poster_path === null){
        context.img = "img/not-found.png"
      };

      // stampo in pagina tramite handlebars
      var html  = template(context);
      $(".container-film").append(html);
    }
  }

  // funzione stampa stelline
  function votoInStelline(punteggioArgs){

    // variabile vuota
    var stella="";

    // fin quando "punteggioArgs" (poi sarà votoStelle) sarà maggiore stampo le stelline colorate
    for (var i=0; i < punteggioArgs; i++){
      stella = stella + "<i class='fas fa-star'></i>";
    }

    // quando invece "punteggioArgs" è inferiore di 5 stampo stellina bianca
    while (punteggioArgs < 5){
      stella = stella + "<i class='far fa-star'></i>";
      punteggioArgs++;
    }

    // chiudo la funz portando fuori la var stella
    return stella;
  }

  // funzione stampa bandierine
  function linguaInBandierine(linguaArgs){

    // se "linguaArgs" (poi sarà original_language) ha uno dei seguenti valori
    if(linguaArgs==="de"||linguaArgs==="en"||linguaArgs==="es"||linguaArgs==="fr"||linguaArgs==="it"||linguaArgs==="ja"||linguaArgs==="pt"){

      // creo variabile e cerco se esiste la bandiera con lo stesso nome
      var bandierina = "<img class='lingue' src='img/" + linguaArgs + ".png'>";

      // porto fuori l'img
      return bandierina;

      // altrimenti stampo solo la stringa
    } else{
      return linguaArgs;
    }
  }

  // funzione per gestire in maniera più corretta l'overview
  function gestiscoOverview(titoloArgs){

    // se la descrizione è presente ed è più lunga di 470 caratteri
    if (titoloArgs.overview != "" && titoloArgs.overview.length > 470){
      // stampo solo 470 caratteri più i puntini
      return titoloArgs.overview.substring(0, 470) + "[...]";
    }
    // se la descrizione è presente ed è più corta di 470 caratteri
    else if (titoloArgs.overview != "" && titoloArgs.overview.length <= 470){
      // stampo tutta la descrizione
      return titoloArgs.overview;
    }
    // se la descrizione non è presente stampo la stringa
    else {
      return "Nessuna descrizione è disponibile";
    }
  }
})
