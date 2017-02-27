layui.use(['layer','element'],function(){
	var $ = layui.jquery;
		var el = layui.element();
	var path = window.location.pathname;
	if (path.substring(path.lastIndexOf('/')) == '/' || path.substring(path.lastIndexOf('/')) == '/index.html'){
		$(document.body).addClass('sidebar-collapse');
		$('#breadcrumb .breadName').parent().remove();
	}
	var $posElement = $('.menu-child a[href = "'+path.substring(path.lastIndexOf('/')+1)+'"]')
	.addClass('active').closest('ul').parent('li').parent('ul');
	$('.menu-child').removeClass('active');
	$posElement.addClass('active');
	$('#menu>li').removeClass('active');
	$('#menu>li').eq($posElement.index()+1).addClass('active');
	
	//console.debug($posElement.index());
	
	// 面包屑导航
	$('#breadcrumb>a').eq(2).attr('href',path.substring(path.lastIndexOf('/')+1));
	$('#breadcrumb>a').eq(2).children('.breadName').text($('.menu-child a[href = "'+path.substring(path.lastIndexOf('/')+1)+'"]').text());
	$('#breadcrumb>a').eq(1).children('.breadName').text($('#menu>li').eq($posElement.index()+1).children('a').text());
	$('#breadcrumb>a').eq(1).attr('myIndex',$posElement.index()+1);
	$('#breadcrumb>a').eq(1).on('click',function  () {
		var i = $(this).attr('myIndex');
		$('#menu>li').eq(i).click();
	});
	/*
	 
	 * 菜单功能 ，菜单toggle  菜单*/
	$('#menu>li').on('click',function  () {
		var iNow = $(this).index() - 1;
		if (iNow == -1){
			return;
		}
		$(document.body).removeClass('sidebar-collapse');
		$(this).addClass('active').siblings().removeClass('active');
		$('.menu-child').eq(iNow).addClass('active').siblings().removeClass('active');
	});
	
	/*
	 
	 * 关闭菜单 按钮 */
	$('#btnNavEC').on('click',function  () {
		$(document.body).addClass('sidebar-collapse');
	});
	
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