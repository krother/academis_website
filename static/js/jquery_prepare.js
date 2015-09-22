function prepare_accordion()
{

	$( "#catalog" ).accordion({
				event: "mousedown", // mouseover
				//collapsible: true, 
				autoHeight: false, 
				navigation: true
	}); 
			
	// -- accordion
	$( ".datePicker" ).datepicker({
		showOn: "button",
		buttonImage: "/static/img/calendar.gif",
		buttonImageOnly: true,
		dateFormat: 'yy-mm-dd'
	});
}

function prepare_basket()
{
    //$("#submit_order").attr('disabled', true).addClass( 'ui-state-disabled' ); // disable ordering
    // basket
	$( "#cart ol" ).droppable({             
		activeClass: "ui-state-default",             
		hoverClass: "ui-state-hover",             
		accept: ":not(.ui-sortable-helper)"  
		}).sortable({             
			items: "li:not(.placeholder)",
			update: function(e,u){ $.cookie('basket-cookie',  JSON.stringify($("#cart ol").html()), { expires: 7, path: '/' }); },             
			sort: function() {                 
				// gets added unintentionally by droppable interacting with sortable                 
				// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options                 
				$( this ).removeClass( "ui-state-default" );             
			}         
	}); 
}

function prepare_menu()
{
	$(".menu ul li").removeClass("ui-state-active");
	$(".menu ul li").addClass("ui-corner-top ui-state-default").show();
	$(".masthead ul li").removeClass("active");
}

function handle_cookie()
{
	$cookieData = $.cookie('menu-cookie')
	if($cookieData)
	{
		$(".menu ul li:contains('" + $cookieData + "')").addClass("ui-state-active").show();
		$(".masthead ul li:contains('" + $cookieData + "')").addClass("active").show();
	}
	else
	{
		$(".menu ul li:first").addClass("ui-state-active").show();
		$(".masthead ul li:first").addClass("active").show();
		$cookieData = $(".menu ul li:first").find("a").text();
		$.cookie('menu-cookie', $cookieData, { expires: 7, path: '/' });
	}
	
	$cookieBasketData = $.cookie('basket-cookie')
	
	if ($cookieBasketData)
	{
		var data = JSON.parse($.cookie("basket-cookie"));
		$( "#cart ol" ).empty();
		$( "#cart ol" ).append(data);
		
		$("#submit_order").button().removeAttr('disabled').removeClass( 'ui-state-disabled' ); // enabled ordering
		
		$( "#cart ol" ).find( "span.ui-icon-trash" ).click(clickToTrash); 
	}else
	{
		// OFF: disabled ordering
		// $('#submit_order').button().attr('disabled', 'disabled').addClass('ui-state-disabled'); 
	}
}

function handle_menu()
{
	$(".menu ul li").click(function() {
		
		$cookieData = $(this).find("a").text();
		$.cookie('menu-cookie', $cookieData, { expires: 7, path: '/' });

		$(".menu ul li").removeClass("ui-state-active"); //Remove any "active" class
		$(".masthead ul li").removeClass("active"); //Remove any "active" class
		$(this).addClass("ui-state-active"); //Add "active" class to selected tab

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});
	$(".masthead ul li").click(function() {
		
		$cookieData = $(this).find("a").text();
		$.cookie('menu-cookie', $cookieData, { expires: 7, path: '/' });

		$(".menu ul li").removeClass("ui-state-active"); //Remove any "active" class
		$(".masthead ul li").removeClass("active"); 
		$(this).addClass("active"); 

		var activeTab = $(this).find("a").attr("href");
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});
}
