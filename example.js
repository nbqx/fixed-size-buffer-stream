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

// each 10000 bytes, when processed buffer size is over 50000 bytes then push each 15000 bytes 
var push2 = fsb(10000,function(total,size){
  // total is total buffer size
  // size is the callback function to change reading buffer size
  if(total>50000) size(15000);
  // or
  // if(this._total>50000) this._len = 15000;
});

inp
  .pipe(push2)
  .pipe(through2(function(buf,enc,next){
    console.log(buf.length); // each size buffer and the rest
    next();
  }));

