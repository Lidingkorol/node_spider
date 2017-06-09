


const cheerio = require('cheerio');

const eventproxy = require('eventproxy');

const superagent = require('superagent');

const fs = require('fs');

const path = require('path');


function start(targetUrl,options){
	superagent
		.post(targetUrl)
		.type('form')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(options)
		.end(function(err,res){
			
			if(err) {
				return false;
			}
			
			if(res.success==false){
				return  false;
			}
			
			console.log(res.text)
			
			let jsData = JSON.parse(res.text)
			
			console.log(jsData.content.positionResult.result)
			
			let result = jsData.content.positionResult.result
			
			result = JSON.stringify(result)
			
			fs.appendFileSync(path.join(__dirname,'data.js'),result,function(err){
	  			
	  			if(err) throw err;
	  			
	  			
	  		
	  			console.log(2)
	  			
	  			
	  			
	  		})
			
			
			
			
			
			var $ = cheerio.load(res.text)
			
			var data=[];
		
			$('.con_list_item').each(function (idx, element) {
				
				console.log($(element).attr('data-salary'))
				
	      	
	  		});
	  		fs.writeFile(path.join(__dirname,'data.js'),data,function(err){
	  			
	  			if(err) throw err;
	  			
	  			console.log(1)
	  			
	  		})
		})
}

exports.spiderGo = () => {
	
	var targetUrl = 'https://www.lagou.com/jobs/positionAjax.json?px=default&city=%E6%B7%B1%E5%9C%B3&needAddtionalResult=false';
	 
	var options = {
		first:false,
		pn:2,
		kd:'web前端'
	}
	
	var i=2;
	
	function timer() {
		
		if(i<30) {
			i++;
			options.pn=i;	
			start(targetUrl,options);
			setTimeout(timer,2000);
		}
		else {
			
			return;
			
		}
		
		
	}
	
	timer();
		
	
}



