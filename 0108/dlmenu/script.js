$(function(){
	var _trigger = $('.tab .dlist dt > a');
	
	_trigger.on("click",function(p,e){		// e는 이벤트 객체
		var _this = $(p.target); 			// e.target == this 결국은 이벤트의 타겟은 같다.
		var _thispt = _this.parent();
		var _target = _thispt.next();
			
		$('.tab .dlist dt').removeClass("on");
		_thispt.addClass("on");
		
		$('.tab .dlist dd').hide();
		_target.show();
	})
})
