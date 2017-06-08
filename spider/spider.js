


const cheerio = require('cheerio');

const eventproxy = require('eventproxy');

const superagent = require('superagent');




function start(targetUrl){
	superagent.get(targetUrl)
	.end(function(err,res){
		
			var $ = cheerio.load(res.text)
		
		
			$('a').each(function (idx, element) {
				
	      		console.log($(element).attr('href'));	
	      	
	  		});
	})
}

exports.spiderGo = () => {
	var targetUrl = 'https://www.lagou.com/zhaopin/webqianduan/?labelWords=label';
	start(targetUrl);
}



