$(function() { 
/*  인풋 포커스 제어 */
	$(document).on({
		'focusin' : function(){ 
			if($(this).parent('.inputset').hasClass("on")) { 
				$(this).parent('.inputset').removeClass("on");
			} else { 
				$(this).parent('.inputset').addClass("on");
			}		
		},
		'focusout' : function(){ 
			if($(this).parent('.inputset').hasClass("on")) { 
				$(this).parent('.inputset').removeClass("on");
			} else { 
				$(this).parent('.inputset').addClass("on");
			}		
		}	
	},'.inputset > input , .inputset > select, .inputset > textarea');

	$(document).on({
		'click' : function() { 
			
			if($(this).prop("checked")) { 
				$(this).parents('.inputset').addClass("on");
				
			} else { 
				$(this).parents('.inputset').removeClass("on");
				
			}
		}
	}, '.inputset.ckbox label > input');

	$(document).on({
		'click' : function() { 
			var chkname = $(this).attr("name");
			if($(this).prop("checked")) { 
				$(".inputset.rdo input[name ='" + chkname + "']").parents('.inputset').removeClass("on");
				$(this).parents('.inputset').addClass("on");
				
			} 
		}
	}, '.inputset.rdo label > input');
	
});	