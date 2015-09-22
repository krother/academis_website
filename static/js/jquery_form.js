			function handle_form()
	{
		// fields to validate
	
	var name = $( "#id_name" ),
		email = $( "#id_email" ),
		comment = $( "#id_comment" ),
		//location = $( "#id_location" ),
		//training_date  = $( ".datePicker" ),
		allFields = $( [] ).add( name ).add( email ),
		tips = $( ".validateTips" );
		
		function updateTips( t ) {
			tips.text( t ).addClass( "ui-state-highlight" );
			setTimeout(function() {
				tips.removeClass( "ui-state-highlight", 1500 );
			}, 500 );
		}
		
		function checkLength( o, n, min, max ) {
			if ( o.val().length > max || o.val().length < min ) {
				o.addClass( "ui-state-error" );
				updateTips( "Length of " + n + " must be between " +
					min + " and " + max + "." );
				return false;
			} else {
				return true;
			}
		}

		function checkRegexp( o, regexp, n ) {
			
			/*
			if (o == $( ".datePicker" ) )
			{
				if ( !( regexp.test( o.datepicker('getDate').getDate()  ) ) ) {
					o.addClass( "ui-state-error" );
					updateTips( n );
					return false;
				} else {
					return true;
				}
			}
			else */
			if ( !( regexp.test( o.val() ) ) ) {
				o.addClass( "ui-state-error" );
				updateTips( n );
				return false;
			} else {
				return true;
			}
		}
	
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 550,
		width: 450,
		modal: true,
		buttons: {
			"Send request": function() {
				
				// validation	
				var bValid = true;
				allFields.removeClass( "ui-state-error" );
				
				bValid = bValid && checkLength( name, "username", 3, 100 );
				bValid = bValid && checkLength( email, "email", 6, 70 );
				//bValid = bValid && checkRegexp( name, /^[a-zA-Z]([0-9a-zA-Z_])+$/i, "Username may consist of A-Z, a-z, 0-9, underscores, begin with a letter." );
				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
				
				if ( bValid ) {
										
					// making an order
					var ordering_Array = [];
					var $basket = $( "#cart ol" );
					
					$basket.children('li').each(function() {
						var training_id = $(this).find(".training_id").text();
						ordering_Array.push(training_id);
					});
					serializing_array = ordering_Array.join(" ");			
					/*
					if ($( ".datePicker" ).datepicker('getDate') != null)
					{
					    var day = $( ".datePicker" ).datepicker('getDate').getDate();                 
						var month = $( ".datePicker" ).datepicker('getDate').getMonth() + 1;             
						var year = $( ".datePicker" ).datepicker('getDate').getFullYear();
                    }
                    var fullDate = null;
					if (day && month && year)
					{
						fullDate = year + "-" + month + "-" + day;
					}
					*/
					comment_val =  comment.val() || null;
					//location_val = location.val() || null;
					//training_date_val = fullDate || null;
					$.post("/submit_order/", 
						{ 
							ordering_array: serializing_array,
							name: name.val(),
							email: email.val(),
							location: null, //location_val,
							comment:  comment_val,
							training_date: null, //training_date_val,
						},function(data) {alert(data);}
					);
					
					// clearing cookie
					$.cookie('basket-cookie', null, {path: '/' });		
					// clearing the basket
					$( "#cart ol" ).empty();
					$( "#cart ol" ).append("<li class=\"placeholder\">empty</li>");
					
					//$('#submit_order').button().attr('disabled', 'disabled').addClass('ui-state-disabled'); // disabled ordering
					$( this ).dialog( "close" );
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
		
	});

	$( "#contact_button" )
		//.button()
		.click(function() {
			$( "#dialog-form" ).dialog( "open" );
	});
}
