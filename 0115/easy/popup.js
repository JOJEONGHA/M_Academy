
function lypopfunc(wd, ht) {
	$('#lypop').show();
	$('.lypop_containor').css({"width" : wd, "margin-left" : -(wd/2), "height" : ht});
} 

$(function() { 
	$('#lypop .close').on("click", function() { 
		$('#lypop').hide();
	});
})