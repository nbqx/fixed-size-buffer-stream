var test = require('tape'),
    fsb = require(__dirname+'/../.');
var Readable = require('stream').Readable;

var buf = new Buffer('abcdefghijklmn'); // length = 14

function testStream(d){
  var stream = new Readable;
  stream.push(d);
  stream.push(null);
  return stream
};

test('pushing each 3bytes',function(t){
  var blen = [3,3,3,3,2];
  var res = [];
  var push = fsb(3);
  testStream(buf).pipe(push).on('data',function(data){
    res.push(data.length);
  }).on('finish',function(){
    t.deepEqual(res,blen,'should be equal');
    t.end();
  });
});

test('pushing each 3bytes, when total is over 6 bytes pushing 2 bytes',function(t){
  var blen = [3,3,2,2,2,2];
  var res = [];
  var push = fsb(3,function(total,size){
    if(total===6) size(2);
  });
  testStream(buf).pipe(push).on('data',function(data){
    res.push(data.length);
  }).on('finish',function(){
    t.deepEqual(res,blen,'should be equal');
    t.end();
  });
});
