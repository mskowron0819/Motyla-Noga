$( document ).ready(function() {
// image change
	var imgSrc = $('#bg');
	var mq = window.matchMedia("(min-width: 500px)");
	function widthChange(mq) {
	  if (mq.matches) {
	    imgSrc.attr('src','assets/img/LP.png');
	  } else {
	    imgSrc.attr('src','assets/img/LP_mobile.png');
	  }
	}
	widthChange(mq)
	mq.addListener(widthChange);

	var offers = $("#main-screen-content .offers");
	var categoryOffers = $('#categories-screen .offers');
	var categoriesFrame = $('#categories-screen');
	var couponFrame = $('#coupon-screen');
	var offersData = 'db/offers_c.json';
	var categoriesMenu = $('.categories-menu');
	var menuWrapper = $('.categories-menu .container');

	function getOffers() {
        $.ajax({
            dataType: 'json',
            url: offersData
        }).done(function(data) {
            console.log(data);
            loadOffers(data);
        }).fail(function(error) {
            console.log(error);
        });
    }

    // Main screen content
    function loadOffers(response) {
    	var tab = Object.keys(response);
		$.map( response, function( value, key ) {
			value.sort(function(a,b) {return (b.priorytet > a.priorytet) ? 1 : ((a.priorytet > b.priorytet) ? -1 : 0);}); 
		    var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">');
            var offerCategory = $('<div class="offer">').text(key);
           	var logo = $('<img class="logo">');
           	var offerInfo = $('<div class="offer-info">');
           	var offerLogo = $('<div class="offer-logo">');
           	var offerDescription = $('<div class="offer-description">');
           	var offerBtn = $('<div class="button">').text('SPRAWDŹ');
           	var showMore = $('<div class="show-more">').text('Zobacz więcej promocji');      	
            var description = value[0].nazwa.replace(/[-?0-9+(%)]/g,function(a){
  										  return '<span>' + a + '</span>'});
            offerDescription.html(`<div class='description'>${description}</div>`);
		    logo.attr('src',value[0].thumbnail_preview_uri);
		    function getImgSize(imgSrc){
						    var newImg = new Image();
						    newImg.src = imgSrc;
						    var height = newImg.height;
						    p = $(newImg).ready(function(){
						        return {width: newImg.width, height: newImg.height};
						    });
						    if(p[0]['height']>220&&p[0]['width']>170){
						    	logo.css('width','25%');
						    }
						};
			getImgSize(value[0].thumbnail_preview_uri);
		    switch(value[0].kategoria_ho_id){
			    case "15": {
			    	offerCategory.addClass('inne');
					break;}
			    case "17": {
			   	    offerCategory.addClass('elektronika');
			        break;}
			    case "21": {
			        offerCategory.addClass('kosmetyki');
			        break;}
			    case "25": {
			        offerCategory.addClass('moda');
			        break;}
			    case "#": {
			        offerCategory.addClass('dzieci');
			        break;}
			    case "#": {
			        offerCategory.addClass('rozrywka');
			        break;}
			    case "#": {
			        offerCategory.addClass('podroze');
			        break;}
			    case "#": {
			        offerCategory.addClass('sport');
			        break;}
				}	

		    offerBtn.click(function() {
				var couponWrapper = offerWrapper.clone();
				couponFrame.append(couponWrapper);
				couponWrapper.addClass('coupon-wrapper');
				var couponBtn = $('.coupon-wrapper .button');
				couponBtn.text('IDŹ DO SKLEPU >>');
				$('.coupon-wrapper .show-more').remove();
				var codeInfo = $('<div class="code-info">');
				var code = $('<div class="button code">');
				couponBtn.before(codeInfo);

				if(value[0].typ == "1"){
					codeInfo.append('<p>Skopiuj poniższy kod rabatowy i wklej go na stronie sklepu</p>');
					code.text(value[0].tresc_kodu_rabatowego);
					couponBtn.before(code);
					if (mq.matches) {
					    couponBtn.css('float', 'left');
					}
				}else if (value[0].typ == "2"){
					codeInfo.append('<p>Promocja nie wymaga kodu rabatowego!</p>');
					if (!mq.matches) {
					    couponBtn.css('margin-top', '30px');
					}
				}

				couponBtn.click(function() {
					window.open(value[0].link_wygenerowany);
				});

				var closeBtn = $('<div class="close-btn">');
				couponBtn.after(closeBtn);

				closeBtn.click(function() {
					couponFrame.hide();
					couponWrapper.hide();						
				});
				couponFrame.show();
			});

			showMore.click(function(){
				loadCategories(response,key,tab);
			}); 	
            offerWrapper.append(offerCategory);
	        offerCategory.append(offerInfo);
	        offerLogo.append(logo);
	        offerInfo.append(offerLogo,offerDescription,offerBtn,showMore);
	        offers.append(offerWrapper);
	    });
	};
	function loadCategories(response,key,tab){
		categoriesFrame.show();
		var title = $('<h1>').text('Złap jeszcze więcej super promocji z kategorii ');
		var menuTitle = $('<div class="category-title col-xs-12 col-sm-8">').append(title);
		var selectCategory = $('<div class="select-category col-xs-12 col-sm-4">');
		var categoriesDropdown = $('<select class="dropdown">');
		tab.map(function(a) {
			var categorySelected = $(`<option>`);
			categoriesDropdown.append(categorySelected.text(a));
			if(categorySelected.val() == key){
				categorySelected.attr("selected","selected");				
			}
			return categoriesDropdown;
		});
		categoriesDropdown.change(function(){
			key = categoriesDropdown.val();
			categoryOffers.empty();
			categoriesMenu.removeAttr("class");
			showOffers();
			categoriesMenu.addClass('categories-menu');
		});
		selectCategory.append(categoriesDropdown);
		menuWrapper.append(menuTitle,selectCategory);
		categoriesMenu.append(menuWrapper);

		function showOffers(){
			$.map(response, function(val,i){
				if(key==i){
					$(val).each(function(index, item){
						var offerWrapper = $('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">');
				        var offerCategory = $(`<div class="offer">`).text(key.toUpperCase());
				        var offerInfo = $('<div class="offer-info">');
				        var offerLogo = $('<div class="offer-logo">');
				        var logo = $('<img class="logo">').attr('src',item.thumbnail_preview_uri);
				        var description = item.nazwa.replace(/[-?0-9+(%)]/g,function(a){
  							return '<span>' + a + '</span>'});
				        var offerDescription = $('<div class="offer-description">').html(`<div class='description'>${description}</div>`);
				        offerDescription.find('span').css('font-size','30px');
				        var offerBtn = $('<div class="button">').text('SPRAWDŹ');
				        function getImgSize(imgSrc){
						    var newImg = new Image();
						    newImg.src = imgSrc;
						    var height = newImg.height;
						    p = $(newImg).ready(function(){
						        return {width: newImg.width, height: newImg.height};
						    });
						    if(p[0]['height']>220&&p[0]['width']>170){
						    	logo.css('width','25%');
						    }
						};
						getImgSize(item.thumbnail_preview_uri);
				        switch(item.kategoria_ho_id){
							case "15": {
								categoriesMenu.addClass('inne');
							   	offerCategory.addClass('inne');
								break;}
							case "17": {
							   	categoriesMenu.addClass('elektronika');
							   	offerCategory.addClass('elektronika');
							   	break;}
							case "21": {
							    categoriesMenu.addClass('kosmetyki');
							    offerCategory.addClass('kosmetyki');
							    break;}
							case "25": {
							    categoriesMenu.addClass('moda');
							    offerCategory.addClass('moda');
							    break;}
							case "#": {
							    categoriesMenu.addClass('dzieci');
							    offerCategory.addClass('dzieci');
							    break;}
							case "#": {
							    categoriesMenu.addClass('rozrywka');
							    offerCategory.addClass('rozrywka');
							    break;}
							case "#": {
							    categoriesMenu.addClass('podroze');
							    offerCategory.addClass('podroze');
							    break;}
							case "#": {
							    categoriesMenu.addClass('sport');
							    offerCategory.addClass('sport');
							    break;}
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
							var code = $('<div class="button code">').text(item.tresc_kodu_rabatowego);
							couponBtn.before(codeInfo);

							if(item.typ == "1"){
								codeInfo.append('<p>Skopiuj poniższy kod rabatowy i wklej go na stronie sklepu</p>');
								couponBtn.before(code);
								if (mq.matches) {
										  couponBtn.css('float', 'left');
								}
							}else if(item.typ == "2"){
								codeInfo.append('<p>Promocja nie wymaga kodu rabatowego!</p>');
								if (!mq.matches) {
										  couponBtn.css('margin-top', '30px');
								}
							}

							couponBtn.click(function() {
								window.open(item.link_wygenerowany);
							});

							var closeBtn = $('<div class="close-btn">');
							couponBtn.after(closeBtn);
							closeBtn.click(function() {
								couponFrame.hide();
								couponWrapper.hide();
										
							});
						});
	        		});
				}
			});
		}
		showOffers();		
	}
    getOffers();
    
});













