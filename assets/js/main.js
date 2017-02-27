layui.use(['layer'],function(){
	var $ = layui.jquery;
	/*
	 
	 * 头部导航 按钮  下拉菜单*/
	var navTimer;
	$('.dragbtn').on('mouseover',function  () {
		clearTimeout(navTimer);
		$('.dragdown').hide();
		$(this).siblings('.dragdown').show();
		
	});
	$('.dragbtn').on('mouseout',function  () {
		$this = $(this);
		navTimer = setTimeout(function  () {
			$this.siblings('.dragdown').hide();
		},300);
	});
	$('.dragdown').on('mouseover',function  () {
		clearTimeout(navTimer);
	});
	$('.dragdown').on('mouseout',function  () {
		$this = $(this);
		navTimer = setTimeout(function  () {
			$this.hide();
		},300);
	});
});