"use strict";

var converter = {};



function parseQuotes(content) {
	var quote, quoteBlock,
		re = /\[quote=?["]?([\s\S]*?)["]?\]([\s\S]*?)\[\/quote\]/gi;

	while(quote = content.match(re)) {
		quote = quote[0];
		quoteBlock = quote.replace(re, '\n\n<div id="quote">$2</div><br>')
		// .replace(/[\r\n]/g, '\n')

		// SomethingAwful Customizations
		// (none yet)
		
		// finalize block
		content = content.replace(quote, quoteBlock);
	}

	return content;
}

converter.parse = function(postContent) {
	postContent = postContent
		.replace('&#58;', ':')
		.replace(/\*/g, '\\*') //replace * with literal \*
		.replace(/\[\S?color[\s\S]*?\]/gi, '') //colors are removed entirely
		.replace(/\[\S?b[s\S]*?\]/gi, '**') //bolds
		.replace(/\[\/?i\]/gi, '*') //italics
		.replace(/\[\u\]/gi, '<u>') //underscore open
		.replace(/\[\/u\]/gi, '</u>') //underscore close
		.replace(/\[s\]/gi, '<s>') //strikethrough open
		.replace(/\[\/s\]/gi, '</s>') //strikethrough open
		// .replace(/\[quote:?[\s\S]*?\]([\s\S]*?)\[\/quote:[\s\S]*?\]/gi, '> $1')
		.replace(/\[url=(https?:[\s\S]*?)\]([\s\S]*?)\[\/url\]/gi, '[$2]($1)') //urls
		.replace(/\[\S?url[s\S]*?\]/gi, '') // [url]google.com[/url] non-pretty urls
		.replace(/<!--[\s\S]*?href="([\s\S]*?)">([\s\S]*?)<[\s\S]*?-->/gi, '[$2]($1)') //commented urls?


		// SomethingAwful Customizations
		.replace(/\[video.+?([\d]*).\]([\[a-zA-Z0-9]*)\[\/video\]/gi,'[youtube link](https:youtube.com/watch=$2&t=$1)')
		.replace(/\[t*img\](.+?)\[\/t*img\]/gi,'<img src="$1">') //img and timg
		.replace(/\[list\]/,'<ul>') //lists open
		.replace(/\[\*\]([\s\w]+)/,'<li>$1</li>') //list item
		.replace(/\[\/list\]/,'</ul>') //lists close
		//emote customization
		.replace(/\:(\w+)\:/gi,'<img src="/images/emotes/$1.gif" alt="$1 emote">')

	postContent = parseQuotes(postContent);
	return postContent
};

module.exports = converter;
