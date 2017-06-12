


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
				
				let result = reData.content.positionResult.result		
				
				var map = Array.prototype.map;
				
				let urlArr = map.call(result,function(x){return x.positionId})
				
				async.map(urlArr,function(item,callback){
					details(item)
					
				},function(err,result){
					console.log(err)
					console.log(result)
				})
				
				
				
				result = JSON.stringify(result)
				
				
				
				
				
				/*fs.appendFileSync(path.join(__dirname,'zzz_data.js'),result,function(err){
		  			
		  			if(err) throw err;

		  			console.log(2)

		  		})*/
			
			}catch(e){
				
				
				console.log(e)
				
				
			}
			
			
			
			
			
/*			
			
			
			
			var $ = cheerio.load(res.text)
			
			var data=[];
		
			$('.con_list_item').each(function (idx, element) {
				
				console.log($(element).attr('data-salary'))
				
	      	
	  		});
	  		fs.writeFile(path.join(__dirname,'data.js'),data,function(err){
	  			
	  			if(err) throw err;
	  			
	  			console.log(1)
	  			
	  		})

*/

		})
		
}


async function details(pId) {
	
	
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
	
	var tHtml;
	
	
	/*console.log(pIdUrl)*/

	function htp(pIdUrl) {
		
		superagent
			.get(pIdUrl)
			.set(tHeader)
			.end(function(err,res){
							
				let $ = cheerio.load(res.text,{decodeEntities: false})	
				
				let tRes;
								
				$('.job_bt p').each(function (idx, element) {
					
					tRes += $(element).html();
					
					/*console.log(tRes)*/
					
		  		});
				
			})	
	}
		
	tHtml = await htp(pIdUrl);	
	
	return tHtml;
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



