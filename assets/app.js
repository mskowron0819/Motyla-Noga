$( document ).ready(function() {

	var mq = window.matchMedia("(min-width: 500px)");
    if(matchMedia) {
  		mq.addListener(WidthChange);
  		WidthChange(mq);
	}
	
	// media query change
	function WidthChange(mq) {
		var imgSrc = $('#bg');
		var offersPosition = $('#main-screen-content');	
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

var offers = $("#main-screen-content .offers");
var categoryOffers = $('#categories-screen .offers');
var categoriesFrame = $('#categories-screen');
var couponFrame = $('#coupon-screen');
var offersData = 'http://localhost:3000/offers';
var categoriesMenu = $('.categories-menu');
var menuWrapper = $('.categories-menu .container');

	function getOffers() {
        $.ajax({
            url: offersData
        }).done(function(data) {
            loadOffers(data);
        }).fail(function(error) {
            console.log(error);
        });
    }

    // Main screen content
    function loadOffers(response) {
		var categories = [];
		$(response).each(function(index, value) {
		    if ($.inArray(value.category,categories)==-1) {
		    	categories.push(value.category);
            	var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">');
            	var offerCategory = $(`<div class="offer">`).text(value.category.toUpperCase());
            	var offerInfo = $('<div class="offer-info">');
            	var offerLogo = $('<div class="offer-logo">');
            	var logo = $('<img class="logo">').attr('src',value.img);
            	var description = value.description.replace(/[-?0-9+(%)]/g,function(a){
  										  return '<span>' + a + '</span>'});
            	var offerDescription = $('<div class="offer-description">').html(`<div class='description'>${description}</div>`);
            	offerDescription.find('span').css('font-size','30px');
            	var offerBtn = $('<div class="button">').text('SPRAWDŹ');
            	var showMore = $('<div class="show-more">').text('Zobacz więcej promocji');
            	if(offerCategory.text() =='MODA&STYL') {
					offerCategory.css('background-color',moda);
					offerBtn.css('background-color',moda);
					offerDescription.find('span').css('color',moda);
				}else if(offerCategory.text() =='PODRÓŻE'){
					offerCategory.css('background-color', podroze);
					offerBtn.css('background-color', podroze);
					offerDescription.find('span').css('color',podroze);
				}else if(offerCategory.text() =='ROZRYWKA'){
					offerCategory.css('background-color',rozrywka)
					offerBtn.css('background-color',rozrywka)
					offerDescription.find('span').css('color',rozrywka);
				}else if(offerCategory.text() =='SPORT I HOBBY'){
					offerCategory.css('background-color', sport)
					offerBtn.css('background-color', sport)
					offerDescription.find('span').css('color',sport);
				}else if(offerCategory.text() =='ELEKTRONIKA'){
					offerCategory.css('background-color', elektronika)
					offerBtn.css('background-color', elektronika)
					offerDescription.find('span').css('color',elektronika);
				}else if(offerCategory.text() =='INNE'){
					offerCategory.css('background-color',inne)
					offerBtn.css('background-color',inne)
					offerDescription.find('span').css('color',inne);
				}else if(offerCategory.text() =='DLA DZIECI'){
					offerCategory.css('background-color',dzieci);
					offerBtn.css('background-color',dzieci);
					offerDescription.find('span').css('color',dzieci);
				}else if(offerCategory.text() =='KOSMETYKI'){
					offerCategory.css('background-color',kosmetyki)
					offerBtn.css('background-color',kosmetyki)
					offerDescription.find('span').css('color',kosmetyki);
				}
				showMore.click(function(){
					loadCategories(response,value.category);
				});
				offerBtn.click(function () {
					var couponWrapper = offerWrapper.clone();
					couponFrame.append(couponWrapper);
					couponWrapper.addClass('coupon-wrapper');
					var couponBtn = $('.coupon-wrapper .button');
					couponBtn.text('IDŹ DO SKLEPU >>');
					$('.coupon-wrapper .show-more').remove();
					var codeInfo = $('<div class="code-info">');
					var code = $('<div class="button code">').text(value.coupon);
					couponBtn.before(codeInfo);

					if(value.coupon === true){
						codeInfo.append(`<p>Skopiuj poniższy kod rabatowy i wklej go na <a>${value.name}</a>`);
						couponBtn.before(code);
						if (mq.matches) {
						    couponBtn.css('float', 'left');
						}
					}else{
						codeInfo.append('<p>Promocja nie wymaga kodu rabatowego!</p>');
						if (!mq.matches) {
						    couponBtn.css('margin-top', '30px');
						}
					}

					couponBtn.click(function() {
						window.open(value.img);
					});

					var closeBtn = $('<div class="close-btn">');
					couponBtn.after(closeBtn);
					closeBtn.click(function() {
						couponFrame.hide();
						couponWrapper.hide();
						
					});
					couponFrame.show();
				});
	            offerWrapper.append(offerCategory);
	            offerCategory.append(offerInfo);
	            offerLogo.append(logo);
	            offerInfo.append(offerLogo,offerDescription,offerBtn,showMore);
	            offers.append(offerWrapper);
		    };
		});
	}
	function loadCategories(response,category,couponHandler) {
		categoriesFrame.show();
		var title = $('<h1>').text('Złap jeszcze więcej super promocji z kategorii ');
		var menuTitle = $('<div class="category-title col-xs-12 col-sm-8">').append(title);
		
		var selectCategory = $('<div class="select-category col-xs-12 col-sm-4">');
		var categoriesDropdown = $('<select class="dropdown">');
		var categories = response.map(function(a) {return a.category;});
		// console.log(categories);
		var uniqueCategories = categories.filter(function(item, pos){return categories.indexOf(item)== pos; });
		uniqueCategories.map(function(a) {
			var categorySelected = $(`<option>`);
			categoriesDropdown.append(categorySelected.text(a));
			if(categorySelected.val() == category){
				categorySelected.attr("selected","selected");				
			}
			return categoriesDropdown;
		});
		
		categoriesDropdown.change(function(){
			category = categoriesDropdown.val();
			categoryOffers.empty();
			showOffers();
		});
		selectCategory.append(categoriesDropdown);
		menuWrapper.append(menuTitle,selectCategory);
		categoriesMenu.append(menuWrapper);
		
	function showOffers(){
		$(response).each(function(index, value) {
			
			if(value.category == category)  {

				var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">');
            	var offerCategory = $(`<div class="offer">`).text(value.category.toUpperCase());
            	var offerInfo = $('<div class="offer-info">');
            	var offerLogo = $('<div class="offer-logo">');
            	var logo = $('<img class="logo">').attr('src',value.img);
            	var description = value.description.replace(/[-?0-9+(%)]/g,function(a){
  										  return '<span>' + a + '</span>'});
            	var offerDescription = $('<div class="offer-description">').html(`<div class='description'>${description}</div>`);
            	offerDescription.find('span').css('font-size','30px');
            	var offerBtn = $('<div class="button">').text('SPRAWDŹ');
            	if(offerCategory.text() =='MODA&STYL') {
					offerCategory.css('background-color',moda);
					offerBtn.css('background-color',moda);
					offerDescription.find('span').css('color',moda);
					categoriesMenu.css('background-color',moda);
				}else if(offerCategory.text() =='PODRÓŻE'){
					offerCategory.css('background-color', podroze);
					offerBtn.css('background-color', podroze);
					offerDescription.find('span').css('color',podroze);
					categoriesMenu.css('background-color',podroze);
				}else if(offerCategory.text() =='ROZRYWKA'){
					offerCategory.css('background-color',rozrywka)
					offerBtn.css('background-color',rozrywka)
					offerDescription.find('span').css('color',rozrywka);
					categoriesMenu.css('background-color',rozrywka);
				}else if(offerCategory.text() =='SPORT I HOBBY'){
					offerCategory.css('background-color', sport)
					offerBtn.css('background-color', sport)
					offerDescription.find('span').css('color',sport);
					categoriesMenu.css('background-color',sport);
				}else if(offerCategory.text() =='ELEKTRONIKA'){
					offerCategory.css('background-color', elektronika)
					offerBtn.css('background-color', elektronika)
					offerDescription.find('span').css('color',elektronika);
					categoriesMenu.css('background-color',elektronika);
				}else if(offerCategory.text() =='INNE'){
					offerCategory.css('background-color',inne)
					offerBtn.css('background-color',inne)
					offerDescription.find('span').css('color',inne);
					categoriesMenu.css('background-color',inne);
				}else if(offerCategory.text() =='DLA DZIECI'){
					offerCategory.css('background-color',dzieci);
					offerBtn.css('background-color',dzieci);
					offerDescription.find('span').css('color',dzieci);
					categoriesMenu.css('background-color',dzieci);
				}else if(offerCategory.text() =='KOSMETYKI'){
					offerCategory.css('background-color',kosmetyki)
					offerBtn.css('background-color',kosmetyki)
					offerDescription.find('span').css('color',kosmetyki);
					categoriesMenu.css('background-color',kosmetyki);
				}
				offerWrapper.append(offerCategory);
	            offerCategory.append(offerInfo);
	            offerLogo.append(logo);
	            offerInfo.append(offerLogo,offerDescription,offerBtn);
	            categoryOffers.append(offerWrapper);
	            
	            offerBtn.click(function () {
	            	var couponWrapper = offerWrapper.clone();
					couponFrame.show().css('z-index', '1');
					couponFrame.append(couponWrapper);
					couponWrapper.addClass('coupon-wrapper');
					var couponBtn = $('.coupon-wrapper .button');
					couponBtn.text('IDŹ DO SKLEPU >>');
					$('.coupon-wrapper .show-more').remove();
					var codeInfo = $('<div class="code-info">');
					var code = $('<div class="button code">').text(value.coupon);
					couponBtn.before(codeInfo);

					if(value.coupon === true){
						codeInfo.append(`<p>Skopiuj poniższy kod rabatowy i wklej go na <a>${value.name}</a>`);
						couponBtn.before(code);
						if (mq.matches) {
						    couponBtn.css('float', 'left');
						}
					}else{
						codeInfo.append('<p>Promocja nie wymaga kodu rabatowego!</p>');
						if (!mq.matches) {
						    couponBtn.css('margin-top', '30px');
						}
					}

					couponBtn.click(function() {
						window.open(value.img);
					});

					var closeBtn = $('<div class="close-btn">');
					couponBtn.after(closeBtn);
					closeBtn.click(function() {
						couponFrame.hide();
						couponWrapper.hide();
						
					});
				});
			}
			
		});
	}
	showOffers();
	};
    getOffers();
    
});













