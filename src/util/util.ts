const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export function stringToHTML(htmlString: string ) {
  
  const dom =new JSDOM(htmlString);
 

  return dom.window.document.body.firstChild.textContent || 'your post'

}
