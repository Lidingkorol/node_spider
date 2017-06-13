


const cheerio = require('cheerio');

const eventproxy = require('eventproxy');

const superagent = require('superagent');

const fs = require('fs');

const path = require('path');

const async = require('async');

var browser = require('./conf');




function start(targetUrl,options,header){

	superagent
		.post(targetUrl)
		.type('form')
		.set(header)
		.send(options)
		.end(function(err,res){
			
			let reData = JSON.parse(res.text)
				
			try{
				
				if(reData.success==false) {
					
					console.log(false)
					
					return false;
					
				}	
				
				console.log('ok')
				
				let resultData = reData.content.positionResult.result;		
				
				var map = Array.prototype.map;
				
				//过滤本科
				function checkEdu(edu) {
				    return edu.education == "专科"||edu.education == "大专";
				}
				
				resultData = resultData.filter(checkEdu)
				
				let urlArr = map.call(resultData,function(x){return x.positionId})
				
				//薪金平均值
				resultData = map.call(resultData,function(x){
					let price = x.salary.split('-');
					function getSum(total, num) {
					    return Number(total.replace('k','')) + Number(num.replace('k',''));
					}
					x.aveSalary = price.reduce(getSum)/price.length;
					
					return x
					
				})
				
				async.mapLimit(urlArr,5,function(item,callback){
					
					details(item,callback)
					
				},function(err,result){
					/*console.log(err)*/
					console.log('这里是结果')
					console.log(result)
					for(let i=0;i<result.length;i++) {
						resultData[i].describe = result[i]
					}
					resultData = JSON.stringify(resultData)
					
					fs.appendFileSync(path.join(__dirname,'szdz_data.js'),resultData,function(err){
		  			
			  			if(err) throw err;
	
			  			console.log(2)
	
			  		})
				})
			
			}catch(e){
				
				
				console.log(e)
				
				
			}

		})
		
}


async function details(pId,callback) {
	
	
	let tReferer = 'https://www.lagou.com/jobs/list_web前端?city=深圳&cl=false&fromSearch=true&labelWords=&suginput='
	
	tReferer = encodeURI(tReferer)
	
	let tHeader = {
		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
		'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
		Referer : tReferer,
		Accept : 'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding' : 'gzip, deflate, br'
	}
	
	tHeader['User-Agent'] = browser[Math.round(Math.random()*9)];
	
	let pIdUrl = 'https://www.lagou.com/jobs/' +pId+ '.html';
	
	let tRes;
	
	
	superagent
		.get(pIdUrl)
		.set(tHeader)
		.end(function(err,res){
						
			let $ = cheerio.load(res.text,{decodeEntities: false})	
			
							
			$('.job_bt p').each(function (idx, element) {
				
				tRes += $(element).html();
				
				
	  		});
	  		
	  		
			//console.log('这是第条,url为：'+pIdUrl+ '内容是:'+tRes)
			
			callback(null,tRes)
		
		})
		
}


exports.spiderGo = () => {
	
	var targetUrl = 'https://www.lagou.com/jobs/positionAjax.json?px=default&city=深圳&needAddtionalResult=false';
	
	targetUrl = encodeURI(targetUrl);
	
	
	var options = {
		first:false,
		pn:2,
		kd:'web前端'
	}
		
	var referer = 'https://www.lagou.com/jobs/list_?px=new&city=%E6%B7%B1%E5%9C%B3';
	
	var origin = 'https://www.lagou.com';
		
	var header = {
		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
		'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
		Referer : referer,
		Origin : origin,
		Accept : 'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding' : 'gzip, deflate, br'
	}
	
	var i=2;
	
	function timer() {
		
		if(i<30) {
			i++;
			
			options.pn=i;
			
			console.log(i)
			
			header['User-Agent'] = browser[Math.round(Math.random()*9)]
			
			
			start(targetUrl,options,header);
			setTimeout(timer,Math.round((Math.random()*9+1)*1000));
		}
		else {
			
			return;
			
		}
		
		
	}
	
	timer();
		
	
}



