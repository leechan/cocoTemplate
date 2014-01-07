/* lichen, http://leechan.me, chen.ican@gmail.com, 2012-11-18, MIT */
(function() {
  var cache = {}, keywords = {};

  (function(keys) {
    var len = keys.length;
    while(len--) {
      keywords[keys[len]] = true;
    }
  })(('break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if'
    + ',in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with'
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto'
    + ',implements,import,int,interface,long,native,package,private,protected,public,short'
    + ',static,super,synchronized,throws,transient,volatile,arguments,let,yield').split(','));

  var isKeywords = function(key) {
    return keywords[key];
  }
  this.cocoTemplate = function (str, data) {
    if(cache[str]) {
      return data ? cache[str](data) : cache[str];
    }
    //去/**/注释
    var regStr = str.replace(/\/\*.*?\*\/|\/\/.*?[\n\r\t]/g, "").replace(/[\r\t\n]/g, "");
    
    var variables = {}, declare = 'var ',
    //提取变量名
    all_vars = regStr.match(/<%(.*?)%>/g).join(',').match(/[\_\$a-zA-Z]+[0-9]*/g);
    //去关键字去重
    (function(arr) {
      var len = arr.length, val;
      while(len--) {
        val = arr[len];
        if(val && !isKeywords(val)) {
            if(!variables.hasOwnProperty(val)) {
              declare += (val + '= __data.' + val + ',');
              variables[val] = true;
            }
        }
      }
    })(all_vars);

    var fn = cache[str] = new Function("__data",
        declare + "__s=''; __s += '" +
        regStr
           .replace(/%>\s*<%/g, "")
           .replace(/<%=(.*?)%>/g, "'+($1)+'")
           .replace(/<%/g, "';")
           .replace(/%>/g, "__s += '")
        + "';return __s;");
    return data ? fn(data) : fn;
  };
})();