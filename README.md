# jquery.ajax.arraybuffer
With this plugin you can handle ArrayBuffer or Blob responses.

How to use it?
--------------
Simply set `dataType` to `arraybuffer` or `blob`:
```javascript
$.ajax({
    url: url,
    dataType: "arraybuffer",
    success: function(response) {
        // response here is an instance of an ArrayBuffer object
    }
});
$.ajax({
    url: url,
    dataType: "blob",
    success: function(response) {
        // response here is an instance of a Blob object
    }
});
```

Custom `XMLHttpRequest` is supported. This is how you can setup a progress handler:
```javascript
$.ajax({
    url: url,
    dataType: "arraybuffer",
    success: function(response) {
        // response here is an instance of an ArrayBuffer object
    },
    xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', function(event) {
            // handle your progress event
        });
        return xhr;
    }
});
```

Supported browsers
------------------

| Browser         | ArrayBuffer | Blob |
| --------------- | ----------- | ---- |
| Chrome          | 10+         | 19+  |
| Chrome Android  | Yes         | Yes  |
| Firefox         | 3.5+        | 6.0+ |
| Firefox Android | Yes         | Yes  |
| IE              | 10+         | 10+  |
| Edge            | Yes         | Yes  |
| Opera           | 11.60+      | 12+  |
| Opera mini      | No          | No   |
| Opera Mobile    | Yes         | Yes  |
| Safari          | 5+          | 5+   |
| Safari iOS      | 5.1+        | 5.1+ |
| Android Browser | 3+          | 4.4+ |
