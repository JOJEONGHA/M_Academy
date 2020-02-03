// JavaScript Documen

$(function(){
	$('aside .nav > li > a').on("click",function(){
		var _targetOrigin = $(this).parent(),
			_target = _targetOrigin.find('.dp2');
	})
	
	function gndInit(){
		$('aside .nav > li').find('dp2').parent().addClass("act");
	}
})