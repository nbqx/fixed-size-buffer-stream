## fixed size buffer stream

pushing fixed size buffer transform stream

## usage

```js
var fs = require('fs');
var fsb = require(__dirname);
var through2 = require('through2');

var inp = fs.createReadStream(__dirname+'/test.dat');

// each 10000 bytes
var push = fsb(10000);
inp.pipe(push)
  .pipe(through2(function(buf,enc,next){
    console.log(buf.length); // each size buffer and the rest
    next();
  }));
```

output:

```
10000
10000
10000
10000
...
7730
```

see also example.js
