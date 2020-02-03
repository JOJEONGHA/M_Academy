$(document).ready(function() { 	

	var pluginName = "lypop";		
	// 기본값 설정
	var defaults = { 
		color : "",
		defaultopen : false, // 기본설정 : 레이어팝업을 숨긴다.
		bg : false
	};
	
	// 제리쿼리 옵션 설정을위한 확장형 함수 설정
	function pluginLypop (element, options) { 		
		this.settings = $.extend({}, defaults, options)
		this.$element = $(element);
		//this._layer = this.$element.attr('href') || null;
		this.init();
		
	};		
	
	// 제이쿼리 확장을 위한 프로토타입 함수의 추가
	$.extend(pluginLypop.prototype, {
		init : function() { 	
			//var _layer = $(_this.attr('href') || null);
			var _this = $(this.$element);
			var _layer = $(_this.attr('href') || null);
			this.$element.css("color", this.settings.color)			
			
			// 초기오픈값 설정
			if(this.settings.defaultopen == false) { 			
				_layer.hide();
			} else { 			
				_layer.show();
			}
			
			// 배경유무 판단
			if(this.settings.bg == false) { 				
				_layer.find(".bg").css('display','none');
			} else { 
				_layer.find(".bg").css('display','block');
			}
			
		},
	});
	
	$[pluginName] = $.fn[pluginName] = function(options) { 
		return this.each(function() { 
			var _this = $(this); // .lypop			
			// href 속성이 없는 레이어 #layer 팝업 레이어 를 지칭
			var _layer = $(_this.attr('href') || null);
			
			_this.on("click", function(){
				_layer.show(); // 팝업 호출
				setTimeout(function(){
					_layer.find('button').attr('tabindex', 0).focus(); // 내부 버튼에 탭인덱스 및 포커스 이동
				}, 1);				
			});
			
			_layer.find('.close').on("click", function(){
				_layer.hide();
				_this.focus();	
			});
					
			if(!$.data(this, "pluginLypop" + pluginName)) { 
				$.data(this, "pluginLypop" + pluginName, new pluginLypop(this, options));
			}
		});
	};						
});