//general tools
var fs = require('fs');


//3rd party
var converter = require("nodebb-plugin-bbcode-to-markdown");
    
//Global vars




//MAIN
var posttext = fs.readFileSync(process.cwd() + '/post.bb',"utf8");
// console.log(posttext)

var convertedpost = converter.parse(posttext);
