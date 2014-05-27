var Transform = require('stream').Transform || require('readable-stream').Transform,
    util = require('util');

function FixedSizeBufferStream(size,fn){
  if(!(this instanceof FixedSizeBufferStream)) return new FixedSizeBufferStream(size,fn);
  Transform.call(this);
  
  this._len = size;
  this._leftover = null;
  this._total = 0;
  this._fn = fn;
};

util.inherits(FixedSizeBufferStream,Transform);

FixedSizeBufferStream.prototype._transform = function recur(buf,enc,next){
  var self = this;

  if(this._fn) this._fn(this._total,function(n){
    self._len = n;
  });

  if(this._leftover){
    buf = Buffer.concat([this._leftover,buf]);
    this._leftover = null;
  }

  if(buf.length < this._len){
    this._leftover = buf;
    return next();
  }

  var ch = buf.slice(0,this._len);
  this.push(ch);
  this._total = this._total + ch.length;
  recur.call(this,buf.slice(this._len),enc,next);

};

FixedSizeBufferStream.prototype._flush = function(next){
  if(this._leftover){
    this.push(this._leftover);
    this._total = this._total + this._leftover.length;
    this._leftover = null;
  }
  next();
};

module.exports = function(size,fn){
  return FixedSizeBufferStream(size,fn);
};
