
function clickToTrash()
{
    // KR: removes training module from basket
	var parent = $(this).parent();
		parent.remove();
		if (!$( "#cart ol" ).find("li").length) 
		{ // parent is empty
			$.cookie('basket-cookie', null, {path: '/' });
			$( "#cart ol" ).append("<li class=\"placeholder\">empty</li>");
			$('#submit_order').button().attr('disabled', 'disabled').addClass('ui-state-disabled'); // disabled ordering
			
		}else 
		$.cookie('basket-cookie',  JSON.stringify($("#cart ol").html()), { expires: 7, path: '/' });
}
		
function onClickHandler() 
{
	// KR: does something when clicked on a JS element.
	$newItem = $("#cart ol").append("<li>" + $(this).parent().find( "p.training_title" ).text().substr(0,20) + "..."
			   +"<span class=\"ui-icon ui-icon-trash\"></span>"
			   +"<span class=\"time\">"+ $(this).parent().find( "p.training_duration" ).text() + "</span>"
			   + "<p class=\"training_id\" style=\"display:none;\" >" + $(this).parent().find( "p.training_id" ).text() + "</p>"
			   +"</li>");
				   
	$( "#cart ol" ).find( ".placeholder" ).remove();
	$.cookie('basket-cookie',  JSON.stringify($("#cart ol").html()), { expires: 7, path: '/' });
	$newItem.find( "span.ui-icon-trash:last" ).click(clickToTrash);
	$("#submit_order").button().removeAttr('disabled').removeClass( 'ui-state-disabled' ); // enabled ordering
};

function handle_trainings_page()
{
	$('#catalog li span').click(onClickHandler);
		
	$('#catalog li p.training_title').click(function() {
		$trainingTitle = $(this).parent().find( "p.training_title" ).text();
		
		$trainingDuration = $(this).parent().find( "p.training_duration" ).text();
		$trainingShortDesc = $(this).parent().find( "div.training_short_desc" ).html();
		$trainingLongDesc = $(this).parent().find( "div.training_long_desc" ).html();
		$trainingId = $(this).parent().find( "p.training_id" ).text();
		
		$trainingContent = $("#acc_content").empty()
		$trainingContent = $("#acc_content").append("<p class=\"training_title\">" + $trainingTitle + "</p>"
													//+ "<span class=\"ui-icon ui-icon-circle-plus\"></span><br>"
													+ "<p class=\"training_duration\">" + $trainingDuration + "</p>"
													+ "<div class=\"training_short_desc\">" + $trainingShortDesc + "</div>"
													+ "<div class=\"training_long_desc\">" + $trainingLongDesc + "</div>"
													+ "<p class=\"training_id\" style=\"display:none;\" >" + $trainingId + "</p>"
													);
		$('#acc_content span').click(onClickHandler);
	});
	
	if (!jQuery.cookie('acc-cookie'))
	{
		// KR: activate first entry by default?
		//$('#catalog li p.training_title:first').click();
	}
	else
	{
		$text = jQuery.cookie('acc-cookie');
		$("#catalog h3:contains('" + $text + "')").mouseover();
		$("#catalog h3:contains('" + $text + "')").next().find("li p.training_title:first").click();
	}
}

function handle_subpage()
{
	$('a[href=#]').attr('href', '/');
		
	$('#catalog h3').click(function() {
		// setting a cokie for remember last clicked accordion category
		$text = $(this).text()
		$.cookie('acc-cookie', $text, { expires: 1, path: '/' });
		
		//default menu tab
		$.cookie('menu-cookie', null, { expires: 1, path: '/' });
		
		var activeTab = "/"; //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content	
		
	});
	
	$('#catalog li span').click(onClickHandler);
	$('#catalog li p.training_title').click(function() {
		
		// setting a cokie for remember last clicked accordion category
		
		$text = $(this).parent().parent().parent().prev().text();
		$.cookie('acc-cookie', $text, { expires: 1, path: '/' });
		// $trainingTitle = $(this).parent().find( "p.training_title" ).text();
		
		//default menu tab
		
		$.cookie('menu-cookie', null, { expires: 1, path: '/' });
		
		var activeTab = "/"; //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
		
	});
}
