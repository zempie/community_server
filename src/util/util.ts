const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export function stringToHTML(htmlString: string ) {
  
  const dom =new JSDOM(htmlString);
 

  return dom.window.document.body.firstChild.textContent || 'your post'

}


export function isArrayEmpty(arr: any[]) {
  return !arr || arr.length === 0
}


export const isObjEmpty = (obj: Record<string, any>): Boolean => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}
