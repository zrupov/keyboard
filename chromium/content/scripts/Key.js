var Key, KeyLetter, KeyFunctional;

Key = function(kb, code){
  this.kb = kb;
  this.code = code ? code : 0;
}

KeyLetter = function(kb, physicalKeyCode, symbols){
  Key.apply(this,[kb, physicalKeyCode]);
  /*    example of symbols array
	symbols = [
	  {
	    lowerCase: 'q',
	    upperCase: 'Q',
	    lowerAdd: '&',
	    upperAdd: '*'
	  },{
	    lowerCase: 'й',
	    upperCase: 'Й',
	    lowerAdd: '',
	    upperAdd: ''
	  }
	]                         */
  for (var i = 0; i < symbols.length; i++) {
    symbols[i].options = $.extend({
      caps: true
    },symbols[i].options);
	}

  this.symbols = symbols;
  this.currentLayout = 0;
  this.status = 'lowerCase';
  this.currentSymbol = this.symbols[this.currentLayout].lowerCase;
}

KeyLetter.prototype.changeStatus = function(options){
  if(this.symbols[this.currentLayout].options.caps){
    if(!options.shift ^ !options.caps){// shift XOR caps
	    this.status = options.addit ? "upperAdd" : "upperCase" ;
    }else{
	    this.status = options.addit ? "lowerAdd" : "lowerCase" ;
    };
	}else{
    if(options.shift){// shift XOR caps
      this.status = options.addit ? "upperAdd" : "upperCase" ;
    }else{
      this.status = options.addit ? "lowerAdd" : "lowerCase" ;
    };
  }
  switch (this.status) {
    case "lowerCase":
      this.currentSymbol = this.symbols[this.currentLayout].lowerCase;
      break;
    case "upperCase":
      this.currentSymbol = this.symbols[this.currentLayout].upperCase;
      break;
    case "lowerAdd":
      this.currentSymbol = this.symbols[this.currentLayout].lowerAdd;
      break;
    case "upperAdd":
      this.currentSymbol = this.symbols[this.currentLayout].upperAdd;
      break;
    }

  if(this.kb.visual.toShowOption != 'newer')
    this.visual.setDisplayKeyText(this.currentSymbol);
}

KeyLetter.prototype.changeLayout = function(num, status){
  this.currentLayout = num;
  this.changeStatus(status);
}

KeyLetter.prototype.action = function(){
	if(this.currentSymbol == "")
		return;
  this.kb.addLetter(this);
}

KeyLetter.prototype.createVisual = function(){
  var params = {};
  params.title = this.currentSymbol;
  this.visual = new VirtualKeyLetter(this, params);
  return this.visual.visual;
}

KeyFunctional = function(kb, options){
  Key.apply(this,[kb, options.code]);
  this.func = options.func;
  this.action = function(){
    this.kb.keyFunctionalAction(this.func, {from:"visual"});
  }
}

KeyFunctional.prototype = Object.create(Key.prototype);

KeyFunctional.prototype.createVisual = function(params){
  this.visual = new VirtualKeyFuncts(this, this.func, params);
  return this.visual.visual;
}
