/**
 * @externs
 */

/** @typedef {function(*=,boolean=):undefined} */
var ArrayBufferCallback;

/**
 * @record
 * @extends {IObject<string,*>}
 */
function ArrayBufferResponses() {};

/** @type {(undefined|!ArrayBuffer)} */
ArrayBufferResponses.prototype.arraybuffer;

/** @type {(undefined|string)} */
ArrayBufferResponses.prototype.text;


jQuery.ajaxTransport;