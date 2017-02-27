layui.use(['common'],function  (exports) {
	var com = layui.common();
	
	com.init({
		callback:function  (res) {
		}
	});
	
	/*
	 
	 * 仪表图表 */
	
	var myChart1 = echarts.init(document.getElementById('meter1'));
	option1 = {
	    tooltip : {
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	    toolbox: {
	        feature: {
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    series: [
	        {
	            name: '业务指标',
	            type: 'gauge',
	            detail: {formatter:'{value}%'},
	            data: [{value: 50, name: '完成率'}],
	            splitNumber:10,
	            axisTick:{
	            	show:false
	            },
	            splitLine:{
	            	length:10
	            },
	            pointer:{
	            	length:'80%',
	            	width:4
	            },
	            axisLine:{
	            	lineStyle:{
	            		width:10,
	            		color:[[0.2,'#fc8131'],[0.5,'#f0cf69'],[1,'#39ca74']]
	            	}
	            },
	            title:{
	            	fontSize:12,
	            }
	        }
	    ]
	};
	myChart1.setOption(option1);
	var myChart2 = echarts.init(document.getElementById('meter2'));
	option2 = {
	    tooltip : {
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	    toolbox: {
	        feature: {
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    series: [
	        {
	            name: '业务指标',
	            type: 'gauge',
	            detail: {formatter:'{value}%'},
	            data: [{value: 10, name: '完成率'}],
	            splitNumber:10,
	            axisTick:{
	            	show:false
	            },
	            splitLine:{
	            	length:10
	            },
	            pointer:{
	            	length:'80%',
	            	width:4
	            },
	            axisLine:{
	            	lineStyle:{
	            		width:10,
	            		color:[[0.2,'#fc8131'],[0.5,'#f0cf69'],[1,'#39ca74']]
	            	}
	            },
	            title:{
	            	fontSize:12,
	            }
	        }
	    ]
	};
	myChart2.setOption(option2);
	var myChart3 = echarts.init(document.getElementById('meter3'));
	option3 = {
	    tooltip : {
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	    toolbox: {
	        feature: {
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    series: [
	        {
	            name: '业务指标',
	            type: 'gauge',
	            detail: {formatter:'{value}%'},
	            data: [{value: 70, name: '完成率'}],
	            splitNumber:10,
	            axisTick:{
	            	show:false
	            },
	            splitLine:{
	            	length:10
	            },
	            pointer:{
	            	length:'80%',
	            	width:4
	            },
	            axisLine:{
	            	lineStyle:{
	            		width:10,
	            		color:[[0.2,'#fc8131'],[0.5,'#f0cf69'],[1,'#39ca74']]
	            	}
	            },
	            title:{
	            	fontSize:12,
	            }
	        }
	    ]
	};
	myChart3.setOption(option3);
	
	/*
	 
	 * 折线图表*/
	var myChart4 = echarts.init(document.getElementById('client-analyse'));
	option4 = {
	    title: {
	        text: '客户走势图'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['新客户','老客户']
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : ['1月','2月','3月','4月','5月','6月','7月','8月','8月','10月','11月','12月'],
	            axisLine:{
	            	show:false
	            },
	            axisTick:{
	            	show:false
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLine:{
	            	show:false
	            },
	            axisTick:{
	            	show:false
	            }
	        }
	    ],
	    series : [
	        {
	            name:'新客户',
	            type:'line',
	            stack: '总量',
	            lineStyle:{
	            	normal:{
	            		color:'#39ca74',
	            		width:2
	            	}
	            },
	            itemStyle:{
	            	normal:{
	            		color:'#39ca74'
	            	}
	            },
	            areaStyle: {normal: {
	            	color:'#bde5d0'
	            }},
	            data:[2, 3, 10, 4, 9, 3, 51, 10, 20, 14, 5,2],
	            smooth: true
	            
	        },
	        {
	            name:'老客户',
	            type:'line',
	            stack: '总量',
	            lineStyle:{
	            	normal:{
	            		color:'#0093f7',
	            		width:2
	            	}
	            },
	            itemStyle:{
	            	normal:{
	            		color:'#0093f7'
	            	}
	            },
	            areaStyle: {normal: {
	            	color:'#d2eaff'
	            }},
	            data:[1, 10, 20, 14, 5, 7, 12,10, 4, 9, 3, 5],
	            smooth: true
	        }
	    ]
	};
	myChart4.setOption(option4);
});
