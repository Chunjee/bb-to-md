//INCLUDES
var converter = require('bbcode-to-markdown'),
    // personalconverter = require('nodebb-plugin-bbcode-to-markdownMODIFIED'),
    fs = require('fs'),
    _ = require('lodash');

//GLOBAL VARS
var dir_import = "\\posts\\";
var dir_export = "";
// var dir_export = "\\markdown\\";


fs.readdir(process.cwd() + dir_import, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }
  
    files.forEach(function (file, index) {
        var post = {}
        //extact from file to memory
        post.rawfile = fs.readFileSync(process.cwd() + dir_import + file, 'utf8');
        post.original = post.rawfile.split('}##')[1];

        //grab some useful bits
        post.title = post.original.split('\n')[1].trim();
        post.title = post.title.replace(/\[\S?b\]/g,"") //replace bbcode for BOLD
        post.title = post.title.replace(/[\!\?]/g,"") //replace unsuitable filename characters
        var dateregex = /\#\#([\w\W\n\r]+?)\#\#/g;
        post.propertiesString = dateregex.exec(post.rawfile)[0].replace(/\#/g,"").trim(); //regex out the header and parse to a json object
        post.properties = JSON.parse(post.propertiesString)

        //convert the post to markdown
        var re = /\[quote=?["]?([\s\S]*?)\"\s.+?\]([\s\S]*?)\[quote\=\"/gi; //[1] is the username, [2] is the entire quote
        var alll = post.original
        var all = [];

        // while (toplevelquote = alll.match(re)) {

        //     oldstyle = toplevelquote[0].slice(0, -9).toString();
        //     var convertedquote = converter(oldstyle);
        //     // console.log(convertedquote);
        //     alll = alll.replace(oldstyle, "")
        //     // console.log(alll.length);
        //     all.push(convertedquote)
        // }
        // console.log("finished converting" + file);
        // console.log(all.length);

        //save the markdown version
        post.markdown = all.join("\n\n<br>\n\n\n")
        post.markdown = converter(post.original);

         //remove some bits from the posts
            //

        //Build the post metadata
        post.type = "Thread Recap";
        post.tags = ["Thread Recap"];
        // post.tags.push("")
        post.header = '+++\ndate = "'+post.properties.date+'"\ntitle = "'+post.title+'"\ncategories= '+JSON.stringify(["recap"]) +'\n+++\n\n\n'

        //write out to new file
        if (post.title) {
            console.log("writing " + post.title + " to file...");
            fs.appendFileSync(dir_export + post.properties.date + " " + index + post.title + ".md", post.header + post.markdown );
        }
    });
});
