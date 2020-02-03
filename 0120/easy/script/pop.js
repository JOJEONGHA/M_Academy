/**  실행문 **/
$.fn.layer_pop = function (options) {
  var opts = $.extend(options);
  var layer_pop = $(this);
  var layer_click = $(opts.clk);

  /* 호출하는 옵션값들*/
  var popWH = opts.popwidth;
  var popHT = opts.popheight;
  var popTIT = opts.poptitle;
  var popBG = opts.popbg;
  var popClose = opts.clsbtn;
  var popScroll = opts.popscroll;
  
  $('.pop-container').css('width', popWH);
  $('.pop-container').css('height', popHT);
  $('h3.poptit').text(popTIT);

	/** 배경의 존재 여부 **/
	if(!popBG) { 
		$('#layer1 .bg').css('display','none');
	} else{ 
			$('#layer1 .bg').css('display','block');
		}
	
	if(!popClose) { 
		$('#layer1 .pop_close').css('display','none');
	} else{ 
			$('#layer1 .pop_close').css('display','block');
		}	
		
	/** 스크롤바 존재 여부 **/	
	var fullHeight = $('.pop-container').outerHeight();
	if(!popScroll) { 
		/** 버튼이 존재하지 않을 경우 **/
		$('#layer1 .cont').css('height',fullHeight-80);
		$('#layer1 .cont').css('overflow-y','hidden');
		$('#layer1 .bottomcont').addClass('type02');		
	} else { 
		/** 버튼이 존재할 경우 **/
		$('#layer1 .cont').css('height',fullHeight-110);
		$('#layer1 .cont').css('overflow-y','auto');
		$('#layer1 .bottomcont').removeClass('type02');		
		}
		
		

  var pop_click = opts.popaction;
};
/**  실행문 **/

function modal() {
	var $popup_body = $('#layer1').find('.pop_body');
	var Win_width = $(window).width();
	var Win_height = $(window).height();  
	$('#layer1').css({'width':$(window).width() + 'px', 'height':$(document).height() +'px'});
	$('#layer1').find('.pop_body').css({'left':(Win_width/2) + 'px','margin-left': - ($popup_body.width()/2) + 'px', 'top':(Win_height)/2 +'px','margin-top':- ($popup_body.height()/2) + 'px'});  
}


  //모달팝업 리사이징시 발생이벤트
  $(window).resize(function(e) {
	  
	
	   if (layer_pop.css('display') == ('block') ) {
		modal();
	   }
  });  


function startpop(width, height, title, bg, closebtn, popscroll) { 

	$("body").append(
		'<div id="layer1" class="pop-layer">' + 
		'<div class="pop-container pop_body">' + 
		'<div class="pophead">' + 
		'<h3 class="poptit"></h3>' +
		'<a href="#none" class="pop_close"></a>' +
		'</div>' +
		'<div class="cont"></div>' +

		'<div class="bottomcont">' + 
		'<a href="#none" class="btn_st01">버튼 테스트</a>' +
		'</div>' +
		
		
		'</div>' +	
		'<div class="bg"></div>' +		
		'</div>'				
	);
	
	/**
	startpopup 의 매개변수 선언 - 순서대로
	1. popwidth : 팝업의 가로 크기
	2. popheight : 팝업의 세로 크기
	3. poptitle : 팝업의 제목
	4. popbg : 배경색 지정 0:없음 1:있음
	5. clsbtn : 닫기버튼 유무 0: 닫기버튼 없음 1:닫기버튼 있음
	**/
	$('#layer1').layer_pop({popwidth: width, popheight: height, poptitle: title, popbg: bg, clsbtn: closebtn, popscroll:popscroll});	
	modal();
	
	$('#layer1').find('.pop_close').click(function(e) {
		$('#layer1').fadeOut('fast');
		$('#layer1').remove();
	});	
}


function loadinginit() { 
	$(function(){	
		$('.innerbox').css('width', '291px');
		$('.innerbox').css('height', '119px');		
	});
}


function loadingbar() { 

	$(function(){	
		var Win_width = $(window).width();
		var Win_height = $(window).height();
		var $loading_body = $('.loadingbox').find('.innerbox');
	
		$('.loadingbox').css('display','block');
		$('.loadingbox').css({'width':$(window).width() + 'px', 'height':$(document).height() +'px'});
		
		$('.loadingbox').find('.innerbox').css({'left':(Win_width/2) + 'px','margin-left': - ($loading_body.width()/2) + 'px', 'top':(Win_height)/2 +'px','margin-top':- ($loading_body.height()/2) + 'px'});
		console.log($loading_body);
		
	});
	//$('.loadingbg').css('height','100px'); 	
}


  //모달팝업 리사이징시 발생이벤트
  $(window).resize(function() {
	  
	
	   if ($('.loadingbox').css('display') == ('block') ) {
		loadingbar();
	   }
  });  
  
  
function startLoadinginit(){
	
	$(function(){
		$("body").append(
			'<div class="loadingbox">' + 
			'<div class="innerbox">' + 
			'<div class="loading_imgbox">' + 
			'<img src="./img/ajax-loader.gif" alt="화면 준비중입니다.">' +
			'</div>' +
			'<p class="loadingtxt">화면이 로딩중입니다.</p>' +
			'</div>' +
			'<div class="bg"></div>' +
			'</div>'
		);	
	});
		
	loadinginit()
	loadingbar();	
	}  

/* 로딩바 호출 함수 */
startLoadinginit();	


