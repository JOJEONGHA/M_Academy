// JavaScript Document

/*
	1. 탭메뉴 클릭 시 해당탭 활성화(class on), 나머지 비활성화
	2. 활성화 된 메뉴에 맞는 내용 display, 나머지 display : none;
*/

$(function(){
	$('.tablist > li > a').on("click",function(){
		var _this = $(this);
		var _thispt = _this.parent();	// 자식의 부모를 찾는 method(객체).
		var _thisptIndex = _thispt.index()	// index는 순서를 찾는다.
//		console.log(_thisptIndex);
//		console.log(_thispt.html());	// 내부의 태그들을 출력
		$('.tablist > li').removeClass("on");
		_thispt.addClass("on");
		console.log(_thisptIndex);
		$('.tabcont .cont').hide();
        $('.tabcont .cont').eq(_thisptIndex).show();	// nth-child와 같이 eq(INDEX)
	})
})	