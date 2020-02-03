

//슬라이드 컴포넌트
var slideComponent = {};

// 슬라이드 자동 로테이션시 이동 방향
slideComponent.directionLeftmove = false;
// 슬라이드 자동 로테이션 인터발 객체이다.
slideComponent.interval_self;
slideComponent.moving = false;

jQuery(document).ready(function() {
	slideComponent.init();	
});

/**
 * 슬라이드 초기화 함수이다.
 *
 */
slideComponent.init = function() { 
	var contentWidth = $('div.slide_box > div').outerWidth(true);
	var posLeft = 0;
	$('div.slide_box > div').each(function(index, element) {
		$(element).css('left',posLeft);
		posLeft = posLeft + contentWidth;
	});
	
	$('#leftBtn').on('click',slideComponent.leftMove);
	$('#rightBtn').on('click',slideComponent.rightMove);
	var contentWidth = $('div.slide_box > div').outerWidth(true);
	$('#autoPlayBtn').on('click' , slideComponent.autoPlay);
	$('#autoStopBtn').on('click' , function(){
		clearInterval(slideComponent.interval_self);
	});
};

slideComponent.autoPlay = function() {
	slideComponent.interval_self = setInterval(function(){
	 if(0 == $('div.slide_box>div:last').css('left').replace('px','')) { 
		 slideComponent.directionLeftmove = false;
		}else if(0 == $('div.slide_box>div:first').css('left').replace('px','')){
			slideComponent.directionLeftmove = true;
		}
		if(slideComponent.directionLeftmove) {
			slideComponent.leftMove();
		} else {
			slideComponent.rightMove();
		}
	}, 3000)
};
		
/**
 * 
 *
 */
slideComponent.leftMove = function() {
	if(0 < $('div.slide_box > div:last').css('left').replace('px','') && false == slideComponent.moving) {
		slideComponent.moving = true;
		
		var currentPositionLeft = 0;
		var movepx = -$("div.slide_box>div:first").outerWidth(true);
		$("div.slide_box>div").each(function(index, element) {
			currentPositionLeft = $(element).css('left').replace('px','');
			$(element).animate({left:eval(currentPositionLeft) + eval(movepx)}, {complete : function(){slideComponent.moving=false;}});
		});
	}
};

/**
 * 
 *
 */
slideComponent.rightMove = function() {
	if(0 > $('div.slide_box > div:first').css('left').replace('px','') && false == slideComponent.moving) {
	slideComponent.moving = true;
	var currentPositionLeft = 0;
	var movepx = $("div.slide_box>div:first").outerWidth(true);
	$("div.slide_box>div").each(function(index, element) {
			currentPositionLeft = $(element).css('left').replace('px','');
			$(element).animate({left:eval(currentPositionLeft) + eval(movepx)}, {complete : function(){slideComponent.moving=false;}});			
		})
	}
};