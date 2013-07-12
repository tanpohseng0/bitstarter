#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var sys = require('util');

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var rest = require('restler');
var WEB_DEFAULT = "http://www.google.com"

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var getResp = function(web_url, checksfile){
	rest.get(web_url).on('complete', function(result) {
	
		 if (result instanceof Error) {
			sys.puts('Error: ' + result.message);
			this.retry(5000); // try again after 5 sec
			}
		else {
		
//			console.log("result is : " + result);
			/*
			outfile = "outfile.html";
			fs.writeFileSync(outfile, result);
			$ = cheerio.load(fs.readFileSync(outfile));
			*/
			
			$ = cheerio.load(result);
			var checks = loadChecks(checksfile).sort();
			var out = {};
			for(var ii in checks) {
				var present = $(checks[ii]).length > 0;
				out[checks[ii]] = present;
			}
			var outJson = JSON.stringify(out, null, 4);
			console.log(outJson);
		}
	});
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <webpage>', 'Path to web', WEB_DEFAULT)
        .parse(process.argv);
		
		if(process.argv.indexOf('--file') >= 0)	{
					
			var checkJson = checkHtmlFile(program.file, program.checks);
			var outJson = JSON.stringify(checkJson, null, 4);
			console.log(outJson);
		}
		else if (process.argv.indexOf('--url') >= 0){
		
			web_url = program.url.toString();		
			getResp(web_url, program.checks);	
		}
		else {
			var checkJson = checkHtmlFile(program.file, program.checks);
			var outJson = JSON.stringify(checkJson, null, 4);
			console.log(outJson);
		}
		
   
} else {
    exports.checkHtmlFile = checkHtmlFile;
}