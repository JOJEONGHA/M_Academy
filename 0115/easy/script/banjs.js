//메인 주요고사사 스크롤 배너 
var listmbanFunc = function() { 
	var trigger = $('.partner_outer .ctr > a:not(".play")'),
		autotrigger = $('.partner_outer .ctr > a.play'),
		target = $('.partner_outer .list_mban .list_slide > ul'), 
		items = target.find("li"),		
		current = 1,
		direction = items.width(),
		leng = items.length,
		first = items.filter(':first'),
		last = items.filter(':last');
	
	/*
	for(var i = 0; i < leng; i++) { 
		items.eq(i).css({"left" : direction * i});
	}
	*/
	
	first.before(last.clone(true));
	last.after(first.clone(true));
	
	trigger.on("click", function() { 
		if(target.is(':not(:animated)')) { 
			var cycle = false;
			var delta = (this.id === 'prev') ? -1 : 1;				
			target.animate({"left" : "+=" + (-direction * delta) }, function() { 
				current += delta;
				cycle = (current === 0 || current > leng);
				/*
				if(current == 0) { 
					cycle = false;
				} else if(current > leng) { 
					cycle = true;
				}
				*/
				//console.log("current ==", current);	
				//console.log("cycle ==", cycle);
				if (cycle) {					
					current = (current === 0)? leng : 1; 
					console.log("current ==", current);
					console.log("direction ==", direction);
					target.css({left:  -direction * current });
					
				}
				
			});
		}
	});
	
	var autoIntervalfunc = function() { 
		if(target.is(':not(:animated)')) { 
			var cycle = false;
			var delta = 1;
			target.animate({"left" : "+=" + (-direction * delta) }, function() { 
				current += delta;
				cycle = current > leng;

				if (cycle) { 
					current = 1;
					target.css({left:  -direction * current });						
				}
			});
		}
	};
	
	

	function setTimer() { 
		i = setInterval(autoIntervalfunc, 5000);
		return i;
	}	
	
	var intId = setTimer();

	function stopSlider() { 
		clearInterval(intId);
	}	

	function restartSlider() { 
		intId = setTimer();
	}

	autotrigger.on("click", function() { 
		if(autotrigger.hasClass("stop")) {
			restartSlider();
			autotrigger.removeClass("stop");
		} else { 
			stopSlider();
			autotrigger.addClass("stop");
		}
	});	
};