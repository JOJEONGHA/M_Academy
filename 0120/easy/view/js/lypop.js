var pshpop = { } // 레이어팝업 공통 변수 선언
$(function(){
	pshpop.pluginName = "lypop";
	
	// 모션 변수 선언
	transtop = "transtop";
	scale = "scale";
	normal = "normal";
	
	// 기본값 설정
	pshpop.defaults = { 
		color : "",
		defaultopen : false, // 기본설정 : 레이어팝업을 숨긴다.
		bg : false, // 배경 유무
		closebtn : false, // 닫기버튼 유무
		width : 500, // width값 설정
		height : 500, // height값 설정
		bgopacitydensity : 0,
		bgopacitydelaytime : 1000,
		/** 
			1. transtop : 상 -> 하 모션
			2. scale -> 스케일 모션
		**/
		popmotion : scale 
	};
	
	// 제리쿼리 옵션 설정을위한 확장형 함수 설정
	pshpop.pluginLypop = function (element, options) { 		
		this.settings = $.extend({}, pshpop.defaults, options)
		this.$element = $(element);
		this.init();	
		this.onclick();			
	};		
	
	// 제이쿼리 확장을 위한 프로토타입 함수의 추가
	$.extend(pshpop.pluginLypop.prototype, {
		init : function() { 	
			//var _layer = $(_this.attr('href') || null);
			var _this = $(this.$element);
			var _layer = $(_this.attr('href') || null);
			this.$element.css("color", this.settings.color);
			
			// 초기오픈값 설정
			if(this.settings.defaultopen == false) { 			
				_layer.hide();
			} else { 			
				_layer.show();
			}
			// 닫기버튼 판단
			if(this.settings.closebtn == false) { 				
				_layer.find(".close").css('display','none');
			} else { 
				_layer.find(".close").css('display','block');
			}
			
			// width값 설정
			_layer.find(".lypop_containor").css({"width" : this.settings.width, "margin-left" : -(this.settings.width/2) });

			// height값 설정
			_layer.find(".lypop_containor").css({"height" : this.settings.height, "margin-top" : -(this.settings.height/2) });
			
			// 모션이 상 -> 하 모션일 경우
			if(this.settings.popmotion == transtop) { 
				_layer.find(".lypop_containor").css({"top" : 45 + "%", "opacity" : 0, "-ms-filter" : "alpha(opacity=0)", "filter" : "alpha(opacity=0)"});
			}
			if(this.settings.popmotion == scale) { 
				_layer.find(".lypop_containor").hide("scale", {percent : 100, direction : 'horizonal'});
			}			
		},
		onclick : function() {
			var _this = $(this.$element);
			var plugin = this; // 플러그인과 관계없는 클릭대산 자기자신
			var _layer = $(_this.attr('href') || null);
			var motion = false;
			
			// 레이어 팝업 클리후 호출		 
			_this.on("click", function(){
				_layer.show(); // 팝업 호출
				
				
				// 함수실행을 위한 비동기 처리
				setTimeout(function(){
														
					// 배경유무 판단
					if(plugin.settings.bg == false) {
						_layer.find(".bg").css('display','none');
					} else { 
						_layer.find(".bg").css('display','block');
						_layer.find(".bg").fadeTo(plugin.settings.bgopacitydelaytime,  "0." + plugin.settings.bgopacitydensity);	
					}
					
					// 모션 상 -> 하 이동
					if(plugin.settings.popmotion == transtop) {
						_layer.find(".lypop_containor").animate({"top" : 50 + "%", "opacity" : 1, "-ms-filter" : "alpha(opacity=1)", "filter" : "alpha(opacity=1)"});						
					}
					
					// 모션 스케일
					if(plugin.settings.popmotion == scale) { 
						_layer.find(".lypop_containor").show("scale", {percent : 100, direction : 'horizonal'}, 500);
					}	
					
					_layer.find('button').attr('tabindex', 0).focus(); // 내부 버튼에 탭인덱스 및 포커스 이동					
				}, 10);
			});			
			// 닫기 실행
			_layer.find('.close').on("click", function(){				

				// 모션 상 -> 하 이동
				if(plugin.settings.popmotion == transtop) {
					_layer.find(".lypop_containor").animate({"top" : 45 + "%", "opacity" : 0, "-ms-filter" : "alpha(opacity=0)", "filter" : "alpha(opacity=0)"});						
				}
				
				// 모션 스케일
				if(plugin.settings.popmotion == scale) { 
					_layer.find(".lypop_containor").hide("scale", {percent : 0, direction : 'horizonal'}, 500);
				}				
				
				if(motion == false) { 	
					motion = true;
					// 배경닫힘
					_layer.find(".bg").fadeTo(plugin.settings.bgopacitydelaytime,  0, function() { 
						motion = false;
						_layer.hide();
					});
				}
				_this.focus();	
			});			
		}		
	});
	
	$[pshpop.pluginName] = $.fn[pshpop.pluginName] = function(options) { 
		return this.each(function() { 
			var _this = $(this); // .lypop			
			// href 속성이 없는 레이어 #layer 팝업 레이어 를 지칭
			var _layer = $(_this.attr('href') || null);
			if(!$.data(this, "pshpop.pluginName" + pshpop.pluginName)) { 
				$.data(this, "pshpop.pluginName" + pshpop.pluginName, new pshpop.pluginLypop(this, options));
			}
		});
	};						
});