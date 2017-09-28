$( document ).ready(function() {

    if(matchMedia) {
  		var mq = window.matchMedia("(min-width: 500px)");
  		mq.addListener(WidthChange);
  		WidthChange(mq);
	}
	
	// media query change
	function WidthChange(mq) {
		var imgSrc = $('#bg');
		var offersPosition = $('.main-screen-content');
		console.log(imgSrc);	
	  if (mq.matches) {
	    imgSrc.attr('src','assets/img/LP.png');
	    offersPosition.css( "margin-top", "-70px" )
	  } else {
	    imgSrc.attr('src','assets/img/LP_mobile.png');
	  }

	}
});

//  colors of the categories

var moda = '#3CB9D9';
var dzieci = '#68E0D6';
var kosmetyki = '#CFA4EB';
var rozrywka = '#454F94';
var elektronika = '#9DA79E';
var podroze = '#85C169';
var sport = '#FE6987';
var inne = '#CFCB9B';

$(function () {
   var offersData = 'http://localhost:3000/offers';
    function getOffers() {
        $.ajax({
            url: offersData
        }).done(function(data) {
            loadOffers(data);
        }).fail(function(error) {
            console.log(error);
        });
    }
    function loadOffers(response) {
			var categories = [];
		$(response).each(function(index, value) {
			var offers = $(".offers");
		    if ($.inArray(value.category,categories)==-1) {
		    	categories.push(value.category);
            	var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">');
            	var offerCategory = $(`<div class="offer">`).text(value.category.toUpperCase());
            	var offerInfo = $('<div class="offer-info">');
            	var offerLogo = $('<div class="offer-logo">');
            	var logo = $('<img class="logo">').attr('src',value.img);
            	var description = value.coupon.replace(/[-?0-9+(%)]/g,function(a){
  										  return '<span>' + a + '</span>'});
            	var offerDescription = $('<div class="offer-description">').html(`<div class='description'>${description}</div>`);
            	if(offerCategory.text() =='MODA&STYL') {
					// offerCategory.attr('id','moda');
					offerCategory.css('background-color',moda);
					offerDescription.find('span').css({'color':moda,
						'font-size':'30px'});
				}else if(offerCategory.text() =='PODRÓŻE'){
					// offerCategory.attr('id','podroze');
					offerCategory.css('background-color', podroze)
				}else if(offerCategory.text() =='ROZRYWKA'){
					// offerCategory.attr('id','rozrywka');
					offerCategory.css('background-color',rozrywka)
				}else if(offerCategory.text() =='SPORT I HOBBY'){
					// offerCategory.attr('id','sport');
					offerCategory.css('background-color', sport)
				}else if(offerCategory.text() =='ELEKTRONIKA'){
					// offerCategory.attr('id','elektronika');
					offerCategory.css('background-color', elektronika)
				}else if(offerCategory.text() =='INNE'){
					// offerCategory.attr('id','inne');
					offerCategory.css('background-color',inne)
				}else if(offerCategory.text() =='DLA DZIECI'){
					// offerCategory.attr('id','dzieci');
					offerCategory.css('background-color',dzieci)
				}else if(offerCategory.text() =='KOSMETYKI'){
					// offerCategory.attr('id','kosmetyki');
					offerCategory.css('background-color',kosmetyki)
				}
				

            // var p = $('<p>').text(value.name);

            offerWrapper.append(offerCategory);
            offerCategory.append(offerInfo);
            offerLogo.append(logo);
            offerInfo.append(offerLogo,offerDescription);
            offers.append(offerWrapper);
		    }
		});

        $(response).each(function () {

        	
        	// console.log(this);
        	// if(this.category )
            // var li = $('<li>');
            // var h3 = $('<h3>').text(this.title);
            // var p = $('<p>').text(this.description);
            // var remove = $('<button>').text('Usuń film');
            // var modify = $('<button>').text('Zmodyfikuj');
            // modify.attr('id', 'nr'+ this.id);
            // $(modify).on('click',function () {
            //     updateMovie(this.id);
            // });
            // remove.attr('id', this.id);
            // $(remove).on('click', function () {
            //     removeMovie(this.id);
            // });
            // li.append(h3);
            // li.append(p);
            // li.append(remove);
            // li.append(modify);
            // repertuar.append(li);
        })
    }
    getOffers();
    // function removeMovie(id) {
    //     var button= $('#' + id);
    //     button.parent().remove();
    //         $.ajax({
    //             url: moviesData + '/' + id,
    //             method: "delete",
    //             dataType: 'json'
    //         })
    //             .done(function(response){
    //             });
    // }
    // function updateMovie(id) {
    //     var save = $('#' + id);
    //     save.text('Zatwierdź');
    //     var titleUpdate = $(save).prev().prev().prev().attr('contenteditable', 'true').addClass('editable');
    //     var descriptionUpdate = $(save).prev().prev().attr('contenteditable', 'true').addClass('editable');
    //     $(save).on('click', function () {
    //         $.ajax({
    //             url: moviesData + '/' + id.split('nr')[1],
    //             data: {title : titleUpdate.text(),
    //                 description: descriptionUpdate.text()},
    //             method: "patch",
    //             dataType: 'json'
    //         })
    //             .done(function(response){
    //             });
    //         titleUpdate.attr('contenteditable', 'false').removeClass('editable');
    //         descriptionUpdate.attr('contenteditable', 'false').removeClass('editable');
    //     })
    // }
    // getMovies();
    // function addMovies() {
    //         $.ajax({
    //             url: moviesData,
    //             data: {title: getTitle.val(),
    //                 description: getDescription.val()},
    //             method: "post",
    //             dataType: 'json'
    //         })
    //             .done(function (response) {
    //                 getMovies();
    //             });
    // }
    //     $(addMovie).on('click', function (e) {
    //         e.preventDefault();
    //         addMovies();
    //     })

});