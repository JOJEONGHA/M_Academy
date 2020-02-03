// JavaScript Document

$(function(){
	$('.btn').on("click",function(){
		var _target = $('aside');
		if(_target.hasClass('on')){
			_target.removeClass('on');
		}else{
			_target.addClass('on')
		}
	})
})