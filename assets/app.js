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
	  if (mq.matches) {
	    imgSrc.attr('src','assets/img/LP.png');
	    offersPosition.css( "margin-top", "-100px" );
	  } else {
	    imgSrc.attr('src','assets/img/LP_mobile.png');
	    offersPosition.css( "margin-top", "-80px" );
	  }

	}

//  colors of the categories

var moda = '#3CB9D9';
var dzieci = '#68E0D6';
var kosmetyki = '#CFA4EB';
var rozrywka = '#454F94';
var elektronika = '#9DA79E';
var podroze = '#85C169';
var sport = '#FE6987';
var inne = '#CFCB9B';


var offers = $(".offers");
var couponFrame = $('#coupon-screen');

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
		    if ($.inArray(value.category,categories)==-1) {
		    	categories.push(value.category);
            	var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="padding: 0">');
            	var offerCategory = $(`<div class="offer">`).text(value.category.toUpperCase());
            	var offerInfo = $('<div class="offer-info">');
            	var offerLogo = $('<div class="offer-logo">');
            	var logo = $('<img class="logo">').attr('src',value.img);
            	var description = value.description.replace(/[-?0-9+(%)]/g,function(a){
  										  return '<span>' + a + '</span>'});
            	var offerDescription = $('<div class="offer-description">').html(`<div class='description'>${description}</div>`);
            	offerDescription.find('span').css('font-size','30px');
            	var button = $('<div class="button">').text('SPRAWDŹ');
            	var showMore = $('<div class="show-more">').text('Zobacz więcej promocji');
            	if(offerCategory.text() =='MODA&STYL') {
					offerCategory.css('background-color',moda);
					button.css('background-color',moda);
					offerDescription.find('span').css('color',moda);
				}else if(offerCategory.text() =='PODRÓŻE'){
					offerCategory.css('background-color', podroze);
					button.css('background-color', podroze);
					offerDescription.find('span').css('color',podroze);
				}else if(offerCategory.text() =='ROZRYWKA'){
					offerCategory.css('background-color',rozrywka)
					button.css('background-color',rozrywka)
					offerDescription.find('span').css('color',rozrywka);
				}else if(offerCategory.text() =='SPORT I HOBBY'){
					offerCategory.css('background-color', sport)
					button.css('background-color', sport)
					offerDescription.find('span').css('color',sport);
				}else if(offerCategory.text() =='ELEKTRONIKA'){
					offerCategory.css('background-color', elektronika)
					button.css('background-color', elektronika)
					offerDescription.find('span').css('color',elektronika);
				}else if(offerCategory.text() =='INNE'){
					offerCategory.css('background-color',inne)
					button.css('background-color',inne)
					offerDescription.find('span').css('color',inne);
				}else if(offerCategory.text() =='DLA DZIECI'){
					offerCategory.css('background-color',dzieci);
					button.css('background-color',dzieci);
					offerDescription.find('span').css('color',dzieci);
				}else if(offerCategory.text() =='KOSMETYKI'){
					offerCategory.css('background-color',kosmetyki)
					button.css('background-color',kosmetyki)
					offerDescription.find('span').css('color',kosmetyki);
				}
				
				button.click(function() {
					couponFrame.show();
					var couponWrapper = $('<div class="col-xs-12 col-sm-6 coupon-wrapper">');
					console.log(couponFrame);
					var couponCategory = $(`<div class="offer coupon-category">`).text(value.category.toUpperCase());
					couponWrapper.append(couponCategory);


					if(value.coupon === true){
						couponFrame.append(couponWrapper.text("hello"));
					}else{
						couponFrame.append(couponWrapper.text("yoyoyo"));
					}

				});


	            offerWrapper.append(offerCategory);
	            offerCategory.append(offerInfo);
	            offerLogo.append(logo);
	            offerInfo.append(offerLogo,offerDescription,button,showMore);
	            offers.append(offerWrapper);
		    };
		});
	}
    getOffers();
    

});

