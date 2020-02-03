$(function(){
	$(".btn").on("click",function(e){
		e.preventDefault();
		
		var moving = false;
		
		if($(".line").stop().hasClass("on") && moving == false){
			console.log(moving);
			moving = true;
			$(".line").removeClass("on");
			$(".line").animate({height: 1},{
				duration : 2000, 
				complete : function(){
					moving = false;
				}
			});	
		}else{
			moving = true;
			console.log(moving);
			$(".line").addClass("on");
			$(".line").animate({height: 100},{
				duration : 2000, 
				complete : function(){	
				}
			})	
		}		
	})
})
