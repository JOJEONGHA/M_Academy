/*
(function ($) { 
	$.fn.lypop = function(options) { 
		var setting = $.extend({
			color : "",
			border : "",
		}, options);
		
		return this.css({
			color : setting.color,
			border : setting.border
		});
	};
}(jQuery));
*/
(function ($) { 
	// 플러그인 이름을 변수명으로 지정한다. 
	var pluginName = "lypop";
	
	// 기본값 설정
	var defaults = { 
		color : "",
		defaultopen : false // 기본설정 : 레이어팝업을 숨긴다.
	};
	
	function pluginLypop (element, options) { 		
		this.settings = $.extend({}, defaults, options)
		this.$element = $(element);
		this.init();
	};
	
	$.lypopopen = function() { 
		alert(1);
		//this.$element = $(element);
		//console.log("element ==" + $(element).html());
		console.log("this ==" + $(this));
		//this.parents("#lypop").$element.css('display','block');	
	};	
	
	// 제이쿼리 확장을 위한 프로토타입 함수의 추가
	$.extend(pluginLypop.prototype, {
		init : function() { 			
			this.$element.css("color", this.settings.color)			
			if(this.settings.defaultopen == false) { 
				this.$element.css('display','none');
			} else { 
				this.$element.css('display','block');
			}
		},
	});
	
	$[pluginName] = $.fn[pluginName] = function(options) { 
		return this.each(function() { 
			if(!$.data(this, "pluginLypop" + pluginName)) { 
				$.data(this, "pluginLypop" + pluginName, new pluginLypop(this, options));
			}
		});
	};

	

	
}(jQuery, window, document));
