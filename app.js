//INCLUDES
var converter = require('bbcode-to-markdown'),
    personalconverter = require('nodebb-plugin-bbcode-to-markdown'),
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
        post.markdown = personalconverter.parse(post.original)
        post.markdown = converter(post.markdown);
        post.markdown = post.markdown.replace(/\[timg\]([\w\?\.\:\/\=\&]+)\[\/timg\]/gi,'<img src="$1" class="timg" alt="embedded external image">'); //timgs
        post.markdown = post.markdown.replace(/\:([a-z0-9]{1,10})\:/gi,'<img src="/img/emotes/$1.gif" alt="$1 emote">') //emotes


        //rename or remove posters to
        var re = /\[quote=?["]?([\s\S]*?)\"\s.+?\]([\s\S]*?)\[quote\=\"/gi; //[1] is the username, [2] is the entire quote
        var re = /\@(\w+)\:/gi;
        var posters = ["Virtual Captain"]
        var index = 0
        console.log()
        while (post_and_author = post.markdown.match(re) && index > 100) {
            console.log(index)
            index++;
            if (posters.indexOf(post_and_author[1])) {
                
            } else {
                var authorRegEx = new RegExp(post_and_author[1],"gi")
                post.markdown.replace(authorRegEx, "")
            }
        }


        //remove some bits from the posts
            //

        //Build the post metadata
        post.type = "Thread Recap";
        post.tags = ["Thread Recap"];
        // post.tags.push("")
        if (!post.properties.bigimg) {
            post.properties.bigimg = "/img/background.png"
        }
        if (!post.properties.salink) {
            post.properties.salink = "https://forums.somethingawful.com/forumdisplay.php?forumid=212"
        }

        post.header = '+++\n'
        + 'date = "' + post.properties.date + '"'
        + '\ntitle = "' + post.title +'"' 
        + '\ncategories= "' + JSON.stringify(["recap"]) + '"' 
        + '\nbigimg = "' + post.properties.bigimg + '"'
        + '\n+++\n\n\n'


        //writeable file
        post.tofile = post.header 
        + post.markdown 
        + '\n\n\n## [As Seen on SOMETHINGAWFULDOTCOM](' + post.properties.salink + ')'

        //write out to new file
        if (post.title) {
            console.log("writing " + post.title + " to file...");
            fs.appendFileSync(dir_export + post.properties.date + " " + index + post.title + ".md", post.tofile );
        }
    });
});
