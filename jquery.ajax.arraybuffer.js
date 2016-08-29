/**
 * @license jQuery.ajax.arraybuffer
 * https://github.com/vobruba-martin/jquery.ajax.arraybuffer
 * Copyright (C) 2016 Martin Vobruba
 * Licensed MIT (/blob/master/LICENSE.md)
 */

jQuery.ajaxTransport('arraybuffer', function(/** !jQueryAjaxSettingsExtra */ options, /** !jQueryAjaxSettings */ originalOptions, /** !jQuery.jqXHR */ jqXHR) {
	/** @type {number} */
	var xhrId = 0;
	/** @type {!IObject<number,!ArrayBufferCallback>} */
	var xhrCallbacks = {};
	/** @type {!XMLHttpRequest} */
	var xhrSupported = jQuery.ajaxSettings.xhr();
	/** @type {boolean} */
	var cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	
	// Support: IE<10
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			/** @type {string} */
			var key;
			for ( key in xhrCallbacks ) {
				xhrCallbacks[ +key ]( undefined, true );
			}
		} );
	}
	
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( !options.crossDomain || cors ) {

		/** @type {?ArrayBufferCallback} */
		var callback = null;

		return {
			send: function(/** !IObject<string,string> */ headers, /** function(number, string, !IObject<string,*>=, string=):undefined */ complete ) {
				/** @type {string} */
				var i;
				/** @type {!XMLHttpRequest} */
				var xhr = options.xhr();
				/** @type {number} */
				var id = ++xhrId;

				// Open the socket
				xhr.open(
					options.type +"",
					options.url +"",
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {

					// Support: IE<9
					// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
					// request header to a null-value.
					//
					// To keep consistent with other XHR implementations, cast the value
					// to string and ignore `undefined`.
					if ( headers[ i ] !== undefined ) {
						xhr.setRequestHeader( i, headers[ i ] + "" );
					}
				}

				(/** @suppress {checkTypes} */ function() {
					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );
				})();

				// Listener
				callback = function(/** *= */ _, /** boolean= */ isAbort ) {
					/** @type {number} */
					var status;
					/** @type {string} */
					var statusText;
					/** @type {!ArrayBufferResponses} */
					var responses;

					// Was never called and is aborted or complete
					if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

						// Clean up
						delete xhrCallbacks[ id ];
						callback = null;
						xhr.onreadystatechange = jQuery.noop;

						// Abort manually if needed
						if ( isAbort ) {
							if ( xhr.readyState !== 4 ) {
								xhr.abort();
							}
						} else {
							responses = {};
							status = xhr.status;

							try {
								responses.arraybuffer = xhr.response;
							} catch (e) {};

							// Firefox throws an exception when accessing
							// statusText for faulty cross-domain requests
							try {
								statusText = xhr.statusText;
							} catch ( e ) {

								// We normalize with Webkit giving an empty statusText
								statusText = "";
							}

							// Filter status for non standard behaviors

							// If the request is local and we have data: assume a success
							// (success with no data won't get notified, that's the best we
							// can do given current implementations)
							if ( !status && options.isLocal && !options.crossDomain ) {
								status = responses.arraybuffer ? 200 : 404;

							// IE - #1450: sometimes returns 1223 when it should be 204
							} else if ( status === 1223 ) {
								status = 204;
							}
						}
					}

					// Call complete if needed
					if ( responses ) {
						complete(+status, statusText+'', responses, xhr.getAllResponseHeaders() );
					}
				};

				// Do send the request
				// `xhr.send` may raise an exception, but it will be
				// handled in jQuery.ajax (so no try/catch here)
				if ( !options.async ) {

					// If we're in sync mode we fire the callback
					callback();
				} else if ( xhr.readyState === 4 ) {

					// (IE6 & IE7) if it's in cache and has been
					// retrieved directly we need to fire the callback
					window.setTimeout( callback );
				} else {

					// Register the callback, but delay it in case `xhr.send` throws
					// Add to the list of active xhr callbacks
					xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
				}
			},

			abort: function() {
				if ( callback ) {
					callback( undefined, true );
				}
			}
		};
	}
});
