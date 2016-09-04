# jquery.ajax.arraybuffer
With this plugin you can handle ArrayBuffer responses.

How to use it?
--------------
Simply set `dataType` to `arraybuffer`:
```javascript
$.ajax({
    url: url,
    dataType: "arraybuffer",
    success: function(response) {
        // response here is an instance of an ArrayBuffer object
    }
});
```
