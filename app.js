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
        post.originalcontent = fs.readFileSync(process.cwd() + dir_import + file, 'utf8');

        //grab some useful bits
        post.title = post.originalcontent.split('\n')[0];
        
        //convert the post to markdown
        post.markdown = converter.parse(post.originalcontent);

        //remove some bits from the posts
            //

        //Build the post metadata
        post.type = "Thread Recap"
        post.tags = ["Thread Recap"];
        // post.tags.push("")
        post.date = "2018-01-01"

        //write out to new file
        if (post.title) {
            console.log("writing " + post.title + " to file...")
            fs.appendFileSync(process.cwd() + dir_export + file + ".md", post.markdown );
        }
    })
});



// converter.parse(post, function(i, posty) {
//     console.log(i);
//     console.log("###################")
//     console.log(posty);
//     fs.appendFileSync(process.cwd() + '/body.md', posty );
// });
