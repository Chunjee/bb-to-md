//INCLUDES
var converter = require('nodebb-plugin-bbcode-to-markdown'),
    fs = require('fs'),
    _ = require('lodash');

//GLOBAL VARS
var dir_import = "\\posts\\";
var dir_export = "\\markdown\\";



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
        var dateregex = /\#\#([\w\W\n\r]+?)\#\#/g;
        post.propertiesString = dateregex.exec(post.rawfile)[0].replace(/\#/g,"").trim(); //regex out the header and parse to a json object
        post.properties = JSON.parse(post.propertiesString)

        //convert the post to markdown
        post.markdown = converter.parse(post.original);

        //remove some bits from the posts
            //

        //Build the post metadata
        post.type = "Thread Recap";
        post.tags = ["Thread Recap"];
        // post.tags.push("")

        //write out to new file
        if (post.title) {
            console.log("writing " + post.title + " to file...");
            fs.appendFileSync(process.cwd() + dir_export + post.properties.date + "-" + index + " " + post.title + ".md", post.markdown );
        }
    });
});



// converter.parse(post, function(i, posty) {
//     console.log(i);
//     console.log("###################")
//     console.log(posty);
//     fs.appendFileSync(process.cwd() + '/body.md', posty );
// });
