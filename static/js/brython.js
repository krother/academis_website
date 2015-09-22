// brython.js www.brython.info
// version 1.0.20121222-100603
// version compiled from commented, indented source files at http://code.google.com/p/brython/
function abs(obj){
if(isinstance(obj,int)){return int(Math.abs(obj))}
else if(isinstance(obj,float)){return int(Math.abs(obj.value))}
else{$raise('TypeError',"Bad operand type for abs(): '"+str(obj.__class__)+"'")}
}
function $alert(src){alert(str(src))}
function all(iterable){
while(true){
try{
var elt=next(iterable)
if(!bool(elt)){return False}
}catch(err){return True}
}
}
function any(iterable){
while(true){
try{
var elt=next(iterable)
if(bool(elt)){return True}
}catch(err){return False}
}
}
function bool(obj){
if(isinstance(obj,dict)){return obj.keys.length>0}
else if(isinstance(obj,tuple)){return obj.items.length>0}
else if(typeof obj==="boolean"){return obj}
else if(typeof obj==="number" || typeof obj==="string"){
if(obj){return true}else{return false}
}else if('__bool__' in obj){return obj.__bool__()}
else if('__len__' in obj){return obj.__len__()>0}
return true
}
function $confirm(src){return confirm(src)}
function $DictClass($keys,$values){
var x=null
var i=null
this.iter=null
this.__class__=dict
this.$keys=$keys 
this.$values=$values 
}
$DictClass.prototype.toString=function(){
if(this.$keys.length==0){return '{}'}
var res="{",key=null,value=null,i=null
for(i=0;i<this.$keys.length;i++){
if(typeof this.$keys[i]==="string"){key="'"+this.$keys[i]+"'"}
else{key=str(this.$keys[i])}
if(typeof this.$values[i]==="string"){value="'"+this.$values[i]+"'"}
else{value=str(this.$values[i])}
res +=key+':'+value+','
}
return res.substr(0,res.length-1)+'}'
}
$DictClass.prototype.__add__=function(other){
var msg="unsupported operand types for +:'dict' and "
$raise('TypeError',msg+"'"+(str(other.__class__)|| typeof other)+"'")
}
$DictClass.prototype.__contains__=function(item){
return this.$keys.__contains__(item)
}
$DictClass.prototype.__delitem__=function(arg){
for(var i=0;i<this.$keys.length;i++){
if(arg.__eq__(this.$keys[i])){
this.$keys.splice(i,1)
this.$values.splice(i,1)
return
}
}
$raise('KeyError',str(arg))
}
$DictClass.prototype.__eq__=function(other){
if(!isinstance(other,dict)){return False}
if(!other.$keys.length==this.$keys.length){return False}
for(var i=0;i<this.$keys.length;i++){
var key=this.$keys[i]
for(j=0;j<other.$keys.length;j++){
try{
if(other.$keys[j].__eq__(key)){
if(!other.$values[j].__eq__(this.$values[i])){
return False
}
}
}catch(err){void(0)}
}
}
return True
}
$DictClass.prototype.__getattr__=function(attr){
return getattr(this,attr)
}
$DictClass.prototype.__getitem__=function(arg){
for(var i=0;i<this.$keys.length;i++){
if(arg.__eq__(this.$keys[i])){return this.$values[i]}
}
$raise('KeyError',str(arg))
}
$DictClass.prototype.__in__=function(item){return item.__contains__(this)}
$DictClass.prototype.__item__=function(i){return this.$keys[i]}
$DictClass.prototype.__len__=function(){return this.$keys.length}
$DictClass.prototype.__ne__=function(other){return !this.__eq__(other)}
$DictClass.prototype.__next__=function(){
if(this.iter==null){this.iter==0}
if(this.iter<this.$keys.length){
this.iter++
return this.$keys[this.iter-1]
}else{
this.iter=null
$raise('StopIteration')
}
}
$DictClass.prototype.__not_in__=function(item){return !(item.__contains__(this))}
$DictClass.prototype.__setitem__=function(key,value){
for(var i=0;i<this.$keys.length;i++){
try{
if(key.__eq__(this.$keys[i])){
this.$values[i]=value
return
}
}catch(err){
void(0)
}
}
this.$keys.push(key)
this.$values.push(value)
}
$DictClass.prototype.items=function(){
var res=[]
for(var i=0;i<this.$keys.length;i++){
res.push([this.$keys[i],this.$values[i]])
}
return res
}
$DictClass.prototype.keys=function(){return this.$keys}
$DictClass.prototype.values=function(){return this.$values}
function dict(){
if(arguments.length==0){return new $DictClass([],[])}
var iterable=arguments[0]
var obj=new $DictClass([],[])
for(var i=0;i<iterable.__len__();i++){
var elt=iterable.__item__(i)
obj.__setitem__(elt.__item__(0),elt.__item__(1))
}
return obj
}
function enumerate(iterator){
var res=[]
for(var i=0;i<iterator.__len__();i++){
res.push([i,iterator.__item__(i)])
}
return res
}
function filter(){
if(arguments.length!=2){$raise('TypeError',
"filter expected 2 arguments, got "+arguments.length)}
var func=arguments[0],iterable=arguments[1]
var res=[]
for(var i=0;i<iterable.__len__();i++){
if(func(iterable.__item__(i))){
res.push(iterable.__item__(i))
}
}
return res
}
function $FloatClass(value){
this.value=value
this.__class__=float
}
$FloatClass.prototype.toString=function(){
var res=this.value+'' 
if(res.indexOf('.')==-1){res+='.0'}
return str(res)
}
$FloatClass.prototype.__bool__=function(){return bool(this.value)}
$FloatClass.prototype.__floordiv__=function(other){
if(isinstance(other,int)){return float(Math.floor(this.value/other))}
else if(isinstance(other,float)){return float(Math.floor(this.value/other.value))}
else{$raise('TypeError',
"unsupported operand type(s) for //: 'int' and '"+other.__class__+"'")
}
}
$FloatClass.prototype.__in__=function(item){return item.__contains__(this)}
$FloatClass.prototype.__not_in__=function(item){return !(item.__contains__(this))}
var $op_func=function(other){
if(isinstance(other,int)){return float(this.value-other)}
else if(isinstance(other,float)){return float(this.value-other.value)}
else{$raise('TypeError',
"unsupported operand type(s) for -: "+this.value+" (float) and '"+other.__class__+"'")
}
}
$op_func +='' 
var $ops={'+':'add','-':'sub','*':'mul','/':'truediv','%':'mod'}
for($op in $ops){
eval('$FloatClass.prototype.__'+$ops[$op]+'__ = '+$op_func.replace(/-/gm,$op))
}
var $comp_func=function(other){
if(isinstance(other,int)){return this.value > other.valueOf()}
else if(isinstance(other,float)){return this.value > other.value}
else{$raise('TypeError',
"unorderable types: "+this.__class__+'() > '+other.__class__+"()")
}
}
$comp_func +='' 
var $comps={'>':'gt','>=':'ge','<':'lt','<=':'le','==':'eq','!=':'ne'}
for($op in $comps){
eval("$FloatClass.prototype.__"+$comps[$op]+'__ = '+$comp_func.replace(/>/gm,$op))
}
var $notimplemented=function(other){
$raise('TypeError',
"unsupported operand types for OPERATOR: '"+this.__class__+"' and '"+other.__class__+"'")
}
$notimplemented +='' 
for($op in $operators){
var $opfunc='__'+$operators[$op]+'__'
if(!($opfunc in $FloatClass.prototype)){
eval('$FloatClass.prototype.'+$opfunc+"="+$notimplemented.replace(/OPERATOR/gm,$op))
}
}
function float(value){
if(typeof value=="number" ||(
typeof value=="string" && parseFloat(value)!=NaN)){
return new $FloatClass(parseFloat(value))
}else if(isinstance(value,float)){return value}
else{$raise('ValueError',"Could not convert to float(): '"+str(value)+"'")}
}
function $bind(func, thisValue){
return function(){return func.apply(thisValue, arguments)}
}
function getattr(obj,attr,_default){
if(attr in obj){
var res=obj[attr]
if(typeof res==="function"){
res=$bind(res, obj)
}
return $JS2Py(res)
}
else if(_default !==undefined){return _default}
else{$raise('AttributeError',
"'"+str(obj.__class__)+"' object has no attribute '"+attr+"'")}
}
function hasattr(obj,attr){
try{getattr(obj,attr);return True}
catch(err){return False}
}
function $import(){
var js_modules=$List2Dict('time','datetime','math','random','sys')
var calling={'line':document.line_num,'context':document.$context}
for(var i=0;i<arguments.length;i++){
module=arguments[i]
if(!isinstance(module,str)){$raise('SyntaxError',"invalid syntax")}
var res=''
var is_js=module in js_modules
if(window.XMLHttpRequest){
var $xmlhttp=new XMLHttpRequest()
}else{
var $xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
}
$xmlhttp.onreadystatechange=function(){
if($xmlhttp.readyState==4){
window.clearTimeout(timer)
if($xmlhttp.status==200){res=$xmlhttp.responseText}
else{
document.$context=calling.context
document.line_num=calling.line
$raise('ImportError',"No module named '"+module+"'")
}
}
}
var fake_qs='?foo='+Math.random().toString(36).substr(2,8)
if(is_js){$xmlhttp.open('GET','/'+module+'.js'+fake_qs,false)}
else{$xmlhttp.open('GET',module+'.py'+fake_qs,false)}
var timer=setTimeout(function(){
$xmlhttp.abort()
document.$context=calling.context
document.line_num=calling.line
$raise('ImportError',"No module named '"+module+"'")}, 5000)
$xmlhttp.send()
if(is_js){
try{eval(res)}catch(err){$raise('ImportError',err.message)}
}else{
var stack=$py2js(res,module)
stack.list.splice(0,0,['code',module+'= new object()'],['newline','\n'])
var $pos=0 
while(true){
var $mlname_pos=stack.find_next_at_same_level($pos,"keyword","function")
if($mlname_pos===null){break}
var $func_name=stack.list[$mlname_pos+1][1]
stack.list.splice($mlname_pos,2,['code',module+'.'+$func_name+"=function"])
var br_pos=stack.find_next($mlname_pos,'bracket','{')
var br_end=stack.find_next_matching(br_pos)
var $fend=stack.find_next(br_end,"func_end")
var $fend_code=stack.list[$fend][1]
$fend_code=module+'.'+$fend_code.substr(1)
$pv_pos=$fend_code.search(';')
$fend_code=";"+$fend_code.substr(0,$pv_pos)
stack.list[$fend][1]=$fend_code
$pos=$mlname_pos+1
}
var $pos=0 
while(true){
var $mlname_pos=stack.find_next_at_same_level($pos,"assign_id")
if($mlname_pos===null){break}
stack.list[$mlname_pos][1]=module+'.'+stack.list[$mlname_pos][1]
$pos=$mlname_pos+1
}
eval(stack.to_js())
}
}
}
function $getNumClass(obj){
return "int"
}
Number.prototype.__class__=$getNumClass(this)
Number.prototype.__floordiv__=function(other){
if(isinstance(other,int)){return Math.floor(this/other)}
else if(isinstance(other,float)){return float(Math.floor(this/other.value))}
else{$UnsupportedOpType("//","int",other.__class__)}
}
Number.prototype.__getattr__=function(attr){$raise('AttributeError',
"'int' object has no attribute '"+attr+"'")}
Number.prototype.__in__=function(item){return item.__contains__(this)}
Number.prototype.__int__=function(){return this}
Number.prototype.__mul__=function(other){
var val=this.valueOf()
if(isinstance(other,int)){return this*other}
else if(isinstance(other,float)){return float(this*other.value)}
else if(typeof other==="string"){
var res=''
for(var i=0;i<val;i++){res+=other}
return res
}else if(isinstance(other,list)){
var res=[]
var $temp=other.slice(0,other.length)
for(var i=0;i<val-1;i++){res=res.concat($temp)}
return res
}else{$UnsupportedOpType("*",int,other)}
}
Number.prototype.__not_in__=function(item){
res=item.__contains__(this)
return !res
}
Number.prototype.__pow__=function(other){
if(typeof other==="number"){return int(Math.pow(this.valueOf(),other.valueOf()))}
else{$UnsupportedOpType("//",int,other.__class__)}
}
Number.prototype.__setattr__=function(attr,value){$raise('AttributeError',
"'int' object has no attribute "+attr+"'")}
Number.prototype.__str__=function(){return this.toString()}
var $op_func=function(other){
if(isinstance(other,int)){
var res=this.valueOf()-other.valueOf()
if(isinstance(res,int)){return res}
else{return float(res)}
}
else if(isinstance(other,float)){return float(this.valueOf()-other.value)}
else{$raise('TypeError',
"unsupported operand type(s) for -: "+this.value+" (float) and '"+str(other.__class__)+"'")
}
}
$op_func +='' 
var $ops={'+':'add','-':'sub','/':'truediv','%':'mod'}
for($op in $ops){
eval('Number.prototype.__'+$ops[$op]+'__ = '+$op_func.replace(/-/gm,$op))
}
var $comp_func=function(other){
if(isinstance(other,int)){return this.valueOf()> other.valueOf()}
else if(isinstance(other,float)){return this.valueOf()> other.value}
else{$raise('TypeError',
"unorderable types: "+str(this.__class__)+'() > '+str(other.__class__)+"()")}
}
$comp_func +='' 
var $comps={'>':'gt','>=':'ge','<':'lt','<=':'le','==':'eq','!=':'ne'}
for($op in $comps){
eval("Number.prototype.__"+$comps[$op]+'__ = '+$comp_func.replace(/>/gm,$op))
}
var $notimplemented=function(other){
$raise('TypeError',
"unsupported operand types for OPERATOR: '"+str(this.__class__)+"' and '"+str(other.__class__)+"'")
}
$notimplemented +='' 
for($op in $operators){
var $opfunc='__'+$operators[$op]+'__'
if(!($opfunc in Number.prototype)){
eval('Number.prototype.'+$opfunc+"="+$notimplemented.replace(/OPERATOR/gm,$op))
}
}
function int(value){
if(typeof value=="number" ||
(typeof value=="string" && parseInt(value)!=NaN)){
return parseInt(value)
}else if(isinstance(value,float)){
return parseInt(value.value)
}else{$raise('ValueError',
"Invalid literal for int() with base 10: '"+str(value)+"'")
}
}
function isinstance(obj,arg){
if(obj===null){return arg===None}
if(arg.constructor===Array){
for(var i=0;i<arg.length;i++){
if(isinstance(obj,arg[i])){return true}
}
return false
}else{
if(arg===int){
return(typeof obj=="number"||obj.constructor===Number)&&(obj.valueOf()%1===0)
}
if(arg===float){
return((typeof obj=="number")&&(obj.valueOf()%1!==0))||
(obj.__class__===float)}
if(arg===str){return(typeof obj=="string")}
if(arg===list){return(obj.constructor===Array)}
if(obj.__class__!==undefined){return obj.__class__===arg}
return obj.constructor===arg
}
}
function iter(obj){
if('__item__' in obj){
obj.__counter__=0 
return obj
}
$raise('TypeError',"'"+str(obj.__class__)+"' object is not iterable")
}
function len(obj){
try{return obj.__len__()}
catch(err){$raise('TypeError',"object of type "+str(obj.__class__)+" has no len()")}
}
function log(){
$ns=$MakeArgs('log',arguments,[],{},'args')
if(!('end' in $ns)){$ns['end']='\n'}
for(var i=0;i<$ns['args'].length;i++){
console.log(str($ns['args'][i])+str($ns['end']))
}
}
function map(){
var func=arguments[0],res=[],rank=0
while(true){
var args=[],flag=true
for(var i=1;i<arguments.length;i++){
var x=arguments[i].__item__(rank)
if(x===undefined){flag=false;break}
args.push(x)
}
if(!flag){break}
res.push(func.apply(null,args))
rank++
}
return res
}
function $extreme(args,op){
if(op==='__gt__'){var $op_name="max"}
else{var $op_name="min"}
if(args.length==0){$raise('TypeError',$op_name+" expected 1 argument, got 0")}
var last_arg=args[args.length-1]
var last_i=args.length-1
var has_key=false
if(isinstance(last_arg,$Kw)){
if(last_arg.name==='key'){
var func=last_arg.value
has_key=true
last_i--
}else{$raise('TypeError',$op_name+"() got an unexpected keyword argument")}
}else{var func=function(x){return x}}
if((has_key && args.length==2)||(!has_key && args.length==1)){
var arg=args[0]
var $iter=iter(arg)
var res=null
while(true){
try{
var x=next($iter)
if(res===null || bool(func(x)[op](func(res)))){res=x}
}catch(err){
if(err.name=="StopIteration"){return res}
throw err
}
}
}else{
var res=null
for(var i=0;i<=last_i;i++){
var x=args[i]
if(res===null || bool(func(x)[op](func(res)))){res=x}
}
return res
}
}
function max(){
var args=[]
for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
return $extreme(args,'__gt__')
}
function min(){
var args=[]
for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
return $extreme(args,'__lt__')
}
function next(obj){
if('__item__' in obj){
if(obj.__counter__===undefined){obj.__counter__=0}
var res=obj.__item__(obj.__counter__)
if(res!==undefined){obj.__counter__++;return res}
$raise('StopIteration')
}
$raise('TypeError',"'"+str(obj.__class__)+"' object is not iterable")
}
function $not(obj){return !bool(obj)}
function $ObjectClass(){
}
$ObjectClass.prototype.__getattr__=function(attr){
if(attr in this){return this[attr]}
else{$raise('AttributeError',"object has no attribute '"+attr+"'")}
}
$ObjectClass.prototype.__delattr__=function(attr){delete this[attr]}
$ObjectClass.prototype.__setattr__=function(attr,value){this[attr]=value}
function object(){
return new $ObjectClass()
}
function $prompt(src){return str(prompt(src))}
function range(){
var $ns=$MakeArgs('range',arguments,[],{},'args',null)
var args=$ns['args']
if(args.length>3){$raise('TypeError',
"range expected at most 3 arguments, got "+args.length)
}
var start=0
var stop=0
var step=1
if(args.length==1){stop=args[0]}
else if(args.length>=2){
start=args[0]
stop=args[1]
}
if(args.length>=3){step=args[2]}
if(step==0){$raise('ValueError',"range() arg 3 must not be zero")}
var res=[]
if(step>0){
for(var i=start;i<stop;i+=step){res.push(i)}
}else if(step<0){
for(var i=start;i>stop;i+=step){res.push(i)}
}
return res
}
function repr(obj){return obj.toString()}
function reversed(seq){
if(isinstance(seq,list)){seq.reverse();return seq}
else if(isinstance(seq,str)){
var res=''
for(var i=seq.length-1;i>=0;i--){res+=seq.charAt(i)}
return res
}else{$raise('TypeError',
"argument to reversed() must be a sequence")}
}
function round(arg,n){
if(!isinstance(arg,[int,float])){
$raise('TypeError',"type "+str(arg.__class__)+" doesn't define __round__ method")
}
if(n===undefined){n=0}
if(!isinstance(n,int)){$raise('TypeError',
"'"+n.__class__+"' object cannot be interpreted as an integer")}
var mult=Math.pow(10,n)
return Number(Math.round(arg*mult)).__truediv__(mult)
}
function $SetClass(){
var x=null
var i=null
this.iter=null
this.__class__=set
this.items=[]
}
$SetClass.prototype.toString=function(){
var res="["
for(var i=0;i<this.items.length;i++){
var x=this.items[i]
if(isinstance(x,str)){res +="'"+x+"'"}
else{res +=x.toString()}
if(i<this.items.length-1){res +=','}
}
return res+']'
}
$SetClass.prototype.__add__=function(other){
return set(this.items.concat(other.items))
}
$SetClass.prototype.__contains__=function(item){
for(var i=0;i<this.items.length;i++){
try{if(this.items[i].__eq__(item)){return True}
}catch(err){void(0)}
}
return False
}
$SetClass.prototype.__eq__=function(other){
if(isinstance(other,set)){
if(other.items.length==this.items.length){
for(var i=0;i<this.items.length;i++){
if(this.__contains__(other.items[i])===False){
return False
}
}
return True
}
}
return False
}
$SetClass.prototype.__in__=function(item){return item.__contains__(this)}
$SetClass.prototype.__len__=function(){return int(this.items.length)}
$SetClass.prototype.__ne__=function(other){return !(this.__eq__(other))}
$SetClass.prototype.__item__=function(i){return this.items[i]}
$SetClass.prototype.__not_in__=function(item){return !(item.__contains__(this))}
$SetClass.prototype.add=function(item){
var i=0
for(i=0;i<this.items.length;i++){
try{if(item.__eq__(this.items[i])){return}}
catch(err){void(0)}
}
this.items.push(item)
}
function set(){
var i=0
if(arguments.length==0){return new $SetClass()}
else if(arguments.length==1){
var arg=arguments[0]
if(isinstance(arg,set)){return arg}
var obj=new $SetClass()
try{
for(var i=0;i<arg.__len__();i++){
obj.items.push(arg.__getitem__(i))
}
return obj
}catch(err){
$raise('TypeError',"'"+str(args[0].__class__)+"' object is not iterable")
}
}else{
$raise('TypeError',"set expected at most 1 argument, got "+arguments.length)
}
}
function setattr(obj,attr,value){
if(!isinstance(attr,str)){$raise('TypeError',"setattr(): attribute name must be string")}
obj[attr]=value
}
function $SliceClass(start,stop,step){
this.__class__=slice
this.start=start
this.stop=stop
this.step=step
}
function slice(){
var $ns=$MakeArgs('slice',arguments,[],{},'args',null)
var args=$ns['args']
if(args.length>3){$raise('TypeError',
"slice expected at most 3 arguments, got "+args.length)
}
var start=0
var stop=0
var step=1
if(args.length==1){stop=args[0]}
else if(args.length>=2){
if(args[0]===None){start=0}
else{start=args[0]}
stop=args[1]
}
if(args.length>=3){step=args[2]}
if(step==0){$raise('ValueError',"slice step must not be zero")}
return new $SliceClass(start,stop,step)
}
function sum(iterable,start){
if(start===undefined){start=0}
var res=0
for(var i=start;i<iterable.__len__();i++){
res +=iterable.__item__(i)
}
return res
}
function $tuple(arg){return arg}
function tuple(){
var args=new Array(),i=0
for(i=0;i<arguments.length;i++){args.push(arguments[i])}
var obj=list(args)
obj.__class__=tuple
return obj
}
function zip(){
var rank=0,res=[]
while(true){
var line=[],flag=true
for(var i=0;i<arguments.length;i++){
var x=arguments[i].__item__(rank)
if(x===undefined){flag=false;break}
line.push(x)
}
if(!flag){return res}
res.push(line)
rank++
}
}
True=true 
False=false 
Boolean.prototype.toString=function(){
if(this.valueOf()){return "True"}else{return "False"}
}
function $NoneClass(){
this.__class__="None"
this.value=null
this.__bool__=function(){return False}
this.__eq__=function(other){return other.__class__=="None"}
this.__str__=function(){return str('None')}
}
None=new $NoneClass()
function $ListClass(items){
var x=null,i=null
this.iter=null
this.__class__=list
this.items=items 
}
Array.prototype.__add__=function(other){
return this.valueOf().concat(other.valueOf())
}
Array.prototype.__contains__=function(item){
for(var i=0;i<this.length;i++){
try{if(this[i].__eq__(item)){return true}
}catch(err){void(0)}
}
return false
}
Array.prototype.__delitem__=function(arg){
if(isinstance(arg,int)){
var pos=arg
if(arg<0){pos=this.length+pos}
if(pos>=0 && pos<this.length){
this.splice(pos,1)
return
}
else{$raise('IndexError','list index out of range')}
}else if(isinstance(arg,slice)){
var start=arg.start || 0
var stop=arg.stop || this.length
var step=arg.step || 1
if(start<0){start=this.length+start}
if(stop<0){stop=this.length+stop}
var res=[],i=null
if(step>0){
if(stop>start){
for(i=start;i<stop;i+=step){
if(this[i]!==undefined){res.push(i)}
}
}
}else{
if(stop<start){
for(i=start;i>stop;i+=step.value){
if(this[i]!==undefined){res.push(i)}
}
res.reverse()
}
}
for(var i=res.length-1;i>=0;i--){
this.splice(res[i],1)
}
return
}else{
$raise('TypeError','list indices must be integer, not '+str(arg.__class__))
}
}
Array.prototype.__eq__=function(other){
if(isinstance(other,list)){
if(other.length==this.length){
for(var i=0;i<this.length;i++){
if(!this[i].__eq__(other[i])){return False}
}
return True
}
}
return False
}
Array.prototype.__getattr__=function(attr){
obj=this
switch(attr){
case 'append':
return function(other){
if(isinstance(other,list)){obj.push(list(other))}
else{obj.push(other)}
}
case 'count':
return $list_count(obj)
case 'extend':
return $list_extend(obj)
case 'index':
return $list_index(obj)
case 'reverse':
return function(){$list_reverse(obj)}
case 'sort':
return function(arg){$list_sort(obj,arg)}
default:
return this[attr]
}
}
Array.prototype.__getitem__=function(arg){
if(isinstance(arg,int)){
var items=this.valueOf()
var pos=arg
if(arg<0){pos=items.length+pos}
if(pos>=0 && pos<items.length){return items[pos]}
else{$raise('IndexError','list index out of range')}
}else if(isinstance(arg,slice)){
var start=arg.start || 0
var stop=arg.stop || this.length
var step=arg.step || 1
if(start<0){start=int(this.length+start)}
if(stop<0){stop=this.length+stop}
var res=[],i=null,items=this.valueOf()
if(step>0){
if(stop<=start){return res}
else{
for(i=start;i<stop;i+=step){
if(items[i]!==undefined){res.push(items[i])}
}
return res
}
}else{
if(stop>=start){return res}
else{
for(i=start;i>stop;i+=step){
if(items[i]!==undefined){res.push(items[i])}
}
return res
}
}
}else{
$raise('TypeError','list indices must be integer, not '+str(arg.__class__))
}
}
Array.prototype.__init__=function(){
this.splice(0,this.length)
if(arguments.length===0){return}
var arg=arguments[0]
for(var i=0;i<arg.__len__();i++){
this.push(arg.__item__(i))
}
}
Array.prototype.__item__=function(i){return this[i]}
Array.prototype.__in__=function(item){return item.__contains__(this)}
Array.prototype.__len__=function(){return this.length}
Array.prototype.__ne__=function(other){return !this.__eq__(other)}
Array.prototype.__next__=function(){
if(this.iter===null){this.iter=0}
if(this.iter<this.valueOf().length){
this.iter++
return this.valueOf()[this.iter-1]
}else{
this.iter=null
$raise('StopIteration')
}
}
Array.prototype.__not_in__=function(item){return !item.__contains__(this)}
Array.prototype.__setitem__=function(arg,value){
if(isinstance(arg,int)){
var pos=arg
if(arg<0){pos=this.length+pos}
if(pos>=0 && pos<this.length){this[pos]=value}
else{$raise('IndexError','list index out of range')}
}else if(isinstance(arg,slice)){
console.log('slice')
var start=arg.start || 0
if(arg.stop===null){stop=this.__len__()}else{stop=arg.stop}
var step=arg.step || 1
if(start<0){start=this.length+start}
if(stop<0){stop=this.length+stop}
this.splice(start,stop-start)
if(hasattr(value,'__item__')){
var $temp=list(value)
for(var i=$temp.length-1;i>=0;i--){
this.splice(start,0,$temp[i])
}
}else{
this.splice(start,0,value)
}
}else{
$raise('TypeError','list indices must be integer, not '+str(arg.__class__))
}
}
Array.prototype.toString=function(){
var res="[",i=null,items=this.valueOf()
for(i=0;i<items.length;i++){
var x=items[i]
if(isinstance(x,str)){res +="'"+x+"'"}
else{res +=x.toString()}
if(i<items.length-1){res +=','}
}
return res+']'
}
function $list_count(obj){
return function(elt){
var res=0
for(var i=0;i<obj.length;i++){
if(obj[i].__eq__(elt)){res++}
}
return res
}
}
function $list_extend(obj){
return function(other){
if(arguments.length!=1){$raise('TypeError',
"extend() takes exactly one argument ("+arguments.length+" given)")}
try{
for(var i=0;i<other.__len__();i++){
obj.push(other.__item__(i))
}
}catch(err){
$raise('TypeError',"object is not iterable")
}
}
}
function $list_index(obj){
return function(elt){
for(var i=0;i<obj.length;i++){
if(obj[i].__eq__(elt)){return i}
}
$raise('ValueError',str(elt)+" is not in list")
}
}
function $list_reverse(obj){
for(var i=0;i<parseInt(obj.length/2);i++){
buf=obj[i]
obj[i]=obj[obj.length-i-1]
obj[obj.length-i-1]=buf
}
}
function $partition(arg,array,begin,end,pivot)
{
var piv=array[pivot]
array.swap(pivot, end-1)
var store=begin
var ix
for(ix=begin;ix<end-1;++ix){
if(arg(array[ix]).__le__(arg(piv))){
array.swap(store, ix)
++store
}
}
array.swap(end-1, store)
return store
}
Array.prototype.swap=function(a, b)
{
var tmp=this[a]
this[a]=this[b]
this[b]=tmp
}
function $qsort(arg,array, begin, end)
{
if(end-1>begin){
var pivot=begin+Math.floor(Math.random()*(end-begin))
pivot=$partition(arg,array, begin, end, pivot)
$qsort(arg,array, begin, pivot)
$qsort(arg,array, pivot+1, end)
}
}
function $list_sort(obj,arg){
if(!arg){arg=function(x){return x}}
else if(typeof arg==="string"){arg=function(x){return x.__getitem__(arg)}}
if(obj.length==0){return}
$qsort(arg,obj,0,obj.length)
}
function $list(){
var args=new Array(),i=0
for(i=0;i<arguments.length;i++){args.push(arguments[i])}
return new $ListClass(args)
}
function list(){
if(arguments.length===0){return[]}
else if(arguments.length>1){
$raise('TypeError',"list() takes at most 1 argument ("+args.length+" given)")
}
var res=[]
console.log('init list with '+arguments[0])
res.__init__(arguments[0])
return res
}
String.prototype.__add__=function(other){
if(!(typeof other==="string")){
try{return other.__radd__(this)}
catch(err){$raise('TypeError',
"Can't convert "+other.__class__+" to str implicitely")}
}else{
return this+other
}
}
String.prototype.__contains__=function(item){
if(!(typeof item==="string")){$raise('TypeError',
"'in <string>' requires string as left operand, not "+item.__class__)}
var nbcar=item.length
for(var i=0;i<this.length;i++){
if(this.substr(i,nbcar)==item){return True}
}
return False
}
String.prototype.__getattr__=function(attr){
obj=this
switch(attr){
case 'capitalize':
return $string_capitalize(obj)
case 'center': 
return $string_center(obj)
case 'count': 
return $string_count(obj)
case 'endswith': 
return $string_endswith(obj)
case 'find': 
return $string_find(obj)
case 'index': 
return $string_index(obj)
case 'join':
return $string_join(obj)
case 'lower':
return $string_lower(obj)
case 'lstrip': 
return $string_lstrip(obj)
case 'replace': 
return $string_replace(obj)
case 'rfind': 
return $string_rfind(obj)
case 'rindex': 
return $string_rindex(obj)
case 'rstrip': 
return $string_rstrip(obj)
case 'split': 
return $string_split(obj)
case 'startswith': 
return $string_startswith(obj)
case 'strip':
return $string_strip(obj)
case 'upper':
return $string_upper(obj)
default:
return this[attr]
}
}
String.prototype.__getitem__=function(arg){
if(isinstance(arg,int)){
var pos=arg
if(arg<0){pos=this.length+pos}
if(pos>=0 && pos<this.length){return this.charAt(pos)}
else{$raise('IndexError','string index out of range')}
}else if(isinstance(arg,slice)){
var start=arg.start || 0
if(arg.stop===null){stop=this.__len__()}else{stop=arg.stop}
var step=arg.step || 1
if(start<0){start=this.length+start}
if(stop<0){stop=this.length+stop}
var res='',i=null
if(step>0){
if(stop<=start){return ''}
else{
for(i=start;i<stop;i+=step){
res +=this.charAt(i)
}
}
}else{
if(stop>=start){return ''}
else{
for(i=start;i>stop;i+=step){
res +=this.charAt(i)
}
}
}
return res
}
}
String.prototype.__in__=function(item){return item.__contains__(this.valueOf())}
String.prototype.__item__=function(i){return this.charAt(i)}
String.prototype.__len__=function(){return this.length}
String.prototype.__mod__=function(args){
var flags=$List2Dict('#','0','-',' ','+')
var ph=[]
function format(s){
var conv_flags='([#\\+\\- 0])*'
var conv_types='[diouxXeEfFgGcrsa%]'
var re=new RegExp('\\%(\\(.+\\))*'+conv_flags+'(\\*|\\d*)(\\.\\*|\\.\\d*)*(h|l|L)*('+conv_types+'){1}')
var res=re.exec(s)
this.is_format=true
if(res===undefined){this.is_format=false;return}
this.src=res[0]
if(res[1]){this.mapping_key=str(res[1].substr(1,res[1].length-2))}
else{this.mapping_key=null}
this.flag=res[2]
this.min_width=res[3]
this.precision=res[4]
this.length_modifier=res[5]
this.type=res[6]
this.toString=function(){
var res='type '+this.type+' key '+this.mapping_key+' min width '+this.min_width
res +=' precision '+this.precision
return res
}
this.format=function(src){
if(this.mapping_key!==null){
if(!isinstance(src,dict)){$raise('TypeError',"format requires a mapping")}
src=src.__getitem__(this.mapping_key)
}
if(this.type=="s"){return str(src)}
else if(this.type=="i" || this.type=="d"){
if(!isinstance(src,[int,float])){$raise('TypeError',
"%"+this.type+" format : a number is required, not "+str(src.__class__))}
return str(int(src))
}else if(this.type=="f" || this.type=="F"){
if(!isinstance(src,[int,float])){$raise('TypeError',
"%"+this.type+" format : a number is required, not "+str(src.__class__))}
return str(float(src))
}
}
}
var elts=[]
var pos=0, start=0, nb_repl=0
var val=this.valueOf()
while(pos<val.length){
if(val.charAt(pos)=='%'){
var f=new format(val.substr(pos))
if(f.is_format){
elts.push(val.substring(start,pos))
elts.push(f)
start=pos+f.src.length
pos=start
nb_repl++
}else{pos++}
}else{pos++}
}
elts.push(val.substr(start))
if(!isinstance(args,tuple)){
if(nb_repl>1){$raise('TypeError','not enough arguments for format string')}
else{elts[1]=elts[1].format(args)}
}else{
if(nb_repl==args.length){
for(var i=0;i<args.length;i++){
var fmt=elts[1+2*i]
elts[1+2*i]=fmt.format(args[i])
}
}else if(nb_repl<args.length){$raise('TypeError',
"not all arguments converted during string formatting")
}else{$raise('TypeError','not enough arguments for format string')}
}
var res=''
for(var i=0;i<elts.length;i++){res+=elts[i]}
return str(res)
}
String.prototype.__mul__=function(other){
if(!isinstance(other,int)){$raise('TypeError',
"Can't multiply sequence by non-int of type '"+str(other.__class__)+"'")}
$res=''
for(var i=0;i<other;i++){$res+=this.valueOf()}
return $res
}
String.prototype.__next__=function(){
if(this.iter==null){this.iter==0}
if(this.iter<this.value.length){
this.iter++
return str(this.value.charAt(this.iter-1))
}else{
this.iter=null
$raise('StopIteration')
}
}
String.prototype.__not_in__=function(item){return !item.__contains__(this.valueOf())}
String.prototype.__setattr__=function(attr,value){setattr(this,attr,value)}
String.prototype.__setitem__=function(attr,value){
$raise('TypeError',"'str' object does not support item assignment")
}
var $comp_func=function(other){
if(typeof other !=="string"){$raise('TypeError',
"unorderable types: 'str' > "+other.__class__+"()")}
return this > other
}
$comp_func +='' 
var $comps={'>':'gt','>=':'ge','<':'lt','<=':'le','==':'eq','!=':'ne'}
for($op in $comps){
eval("String.prototype.__"+$comps[$op]+'__ = '+$comp_func.replace(/>/gm,$op))
}
var $notimplemented=function(other){
$raise('TypeError',
"unsupported operand types for OPERATOR: '"+str(this.__class__)+"' and '"+str(other.__class__)+"'")
}
$notimplemented +='' 
for($op in $operators){
var $opfunc='__'+$operators[$op]+'__'
if(!($opfunc in String.prototype)){
eval('String.prototype.'+$opfunc+"="+$notimplemented.replace(/OPERATOR/gm,$op))
}
}
function $string_capitalize(obj){
if(obj.length==0){return ''}
return obj.charAt(0).toUpperCase()+obj.substr(1).toLowerCase()
}
function $string_center(obj){
return function(width,fillchar){
if(fillchar===undefined){fillchar=' '}else{fillchar=fillchar}
if(width<=obj.length){return obj}
else{
var pad=parseInt((width-obj.length)/2)
res=''
for(var i=0;i<pad;i++){res+=fillchar}
res +=obj
for(var i=0;i<pad;i++){res+=fillchar}
if(res.length<width){res +=fillchar}
return res
}
}
}
function $string_count(obj){
return function(elt){
if(!(typeof elt==="string")){$raise('TypeError',
"Can't convert '"+str(elt.__class__)+"' object to str implicitly")}
var res=0
for(var i=0;i<obj.length-elt.length+1;i++){
if(obj.substr(i,elt.length)===elt){res++}
}
return res
}
}
function $string_endswith(obj){
return function(){
var $ns=$MakeArgs("str.endswith",arguments,['suffix'],
{'start':null,'end':null},null,null)
var suffixes=$ns['suffix']
if(!isinstance(suffixes,tuple)){suffixes=[suffixes]}
var start=$ns['start']|| 0
var end=$ns['end']|| obj.length-1
var s=obj.substr(start,end+1)
for(var i=0;i<suffixes.length;i++){
suffix=suffixes[i]
if(suffix.length<=s.length &&
s.substr(s.length-suffix.length)==suffix){return True}
}
return False
}
}
function $string_find(obj){
return function(){
var $ns=$MakeArgs("str.find",arguments,['sub'],
{'start':0,'end':obj.length},null,null)
var sub=$ns['sub'],start=$ns['start'],end=$ns['end']
if(!isinstance(sub,str)){$raise('TypeError',
"Can't convert '"+str(sub.__class__)+"' object to str implicitly")}
if(!isinstance(start,int)||!isinstance(end,int)){$raise('TypeError',
"slice indices must be integers or None or have an __index__ method")}
var s=obj.substring(start,end)
var res=s.search(sub)
if(res==-1){return -1}
else{return start+res}
}
}
function $string_index(obj){
return function(){
var args=[]
for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
var res=$string_find(obj).apply(obj,args)
if(res===-1){$raise('ValueError',"substring not found")}
else{return res}
}
}
function $string_join(obj){
return function(iterable){
if(!'__next__' in iterable){$raise('TypeError',
"'"+str(iterable.__class__)+"' object is not iterable")}
var res='',count=0
while(true){
try{
var obj2=next(iterable)
if(!isinstance(obj2,str)){$raise('TypeError',
"sequence item "+count+": expected str instance, "+str(obj2.__class__)+"found")}
res +=obj2+obj
count++
}catch(err){
if(err.name=='StopIteration'){break}
throw err
}
}
if(count==0){return str('')}
res=res.substr(0,res.length-obj.length)
return res
}
}
function $string_lower(obj){
return function(){return obj.toLowerCase()}
}
function $string_lstrip(obj){
return function(x){
var pattern=null
if(x==undefined){pattern="\\s*"}
else{pattern="["+x+"]*"}
var sp=new RegExp("^"+pattern)
return obj.replace(sp,"")
}
}
function $string_replace(obj){
return function(old,_new,count){
if(count!==undefined){
if(!isinstance(count,[int,float])){$raise('TypeError',
"'"+str(count.__class__)+"' object cannot be interpreted as an integer")}
var re=new RegExp(old)
var res=obj.valueOf()
while(count>0){
if(obj.search(re)==-1){return res}
res=res.replace(re,_new)
count--
}
return res
}else{
var re=new RegExp(old,"g")
return obj.replace(re,_new)
}
}
}
function $string_rfind(obj){
return function(){
var $ns=$MakeArgs("str.find",arguments,['sub'],
{'start':0,'end':obj.length},null,null)
var sub=$ns['sub'],start=$ns['start'],end=$ns['end']
if(!isinstance(sub,str)){$raise('TypeError',
"Can't convert '"+str(sub.__class__)+"' object to str implicitly")}
if(!isinstance(start,int)||!isinstance(end,int)){$raise('TypeError',
"slice indices must be integers or None or have an __index__ method")}
var s=obj.substring(start,end)
var reversed=''
for(var i=s.length-1;i>=0;i--){reversed +=s.charAt(i)}
var res=reversed.search(sub)
if(res==-1){return -1}
else{return start+s.length-1-res}
}
}
function $string_rindex(obj){
return function(){
var args=[]
for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
var res=$string_rfind(obj).apply(obj,args)
if(res==-1){$raise('ValueError',"substring not found")}
else{return res}
}
}
function $string_rstrip(x){
if(x==undefined){pattern="\\s*"}
else{pattern="["+x.value+"]*"}
sp=new RegExp(pattern+'$')
return str(this.value.replace(sp,""))
}
function $string_split(obj){
return function(){
var $ns=$MakeArgs("str.split",arguments,['sep'],
{'maxsplit':-1},null,null)
var sep=$ns['sep'],maxsplit=$ns['maxsplit']
var res=[],pos=0,spos=0
if(isinstance(sep,str)){
while(true){
spos=obj.substr(pos).search(sep)
if(spos==-1){break}
res.push(obj.substr(pos,spos))
pos +=spos+sep.length
if(maxsplit !=-1 && res.length==maxsplit){break}
}
res.push(obj.substr(pos))
return res
}
}
}
function $string_startswith(obj){
return function(){
$ns=$MakeArgs("str.startswith",arguments,['prefix'],
{'start':null,'end':null},null,null)
var prefixes=$ns['prefix']
if(!isinstance(prefixes,tuple)){prefixes=[prefixes]}
var start=$ns['start']|| 0
var end=$ns['end']|| obj.length-1
var s=obj.substr(start,end+1)
for(var i=0;i<prefixes.length;i++){
prefix=prefixes[i]
if(prefix.length<=s.length &&
s.substr(0,prefix.length)==prefix){return True}
}
return False
}
}
function $string_strip(obj){
return function(x){
if(x==undefined){x="\\s"}
pattern="["+x+"]"
sp=new RegExp("^"+pattern+"+|"+pattern+"+$","g")
return obj.replace(sp,"")
}
}
function $string_upper(obj){return function(){return obj.toUpperCase()}}
function str(arg){return arg.toString()}
function $MakeArgs($fname,$args,$required,$defaults,$other_args,$other_kw){
var i=null,$PyVars={},$def_names=[],$ns={}
for(var k in $defaults){$def_names.push(k);$ns[k]=$defaults[k]}
if($other_args !=null){$ns[$other_args]=[]}
if($other_kw !=null){$dict_items=[]}
var upargs=[]
for(var i=0;i<$args.length;i++){
if($args[i]===null){upargs.push(null)}
else if(isinstance($args[i],$ptuple)){
for(var j=0;j<$args[i].arg.length;j++){
upargs.push($args[i].arg[j])
}
}else if(isinstance($args[i],$pdict)){
for(var j=0;j<$args[i].arg.$keys.length;j++){
upargs.push($Kw($args[i].arg.$keys[j],$args[i].arg.$values[j]))
}
}else{
upargs.push($args[i])
}
}
for(i=0;i<upargs.length;i++){
$arg=upargs[i]
$PyVar=$JS2Py($arg)
if(isinstance($arg,$Kw)){
$PyVar=$arg.value
if($arg.name in $PyVars){
throw new TypeError($fname+"() got multiple values for argument '"+$arg.name+"'")
}else if($required.indexOf($arg.name)>-1){
var ix=$required.indexOf($arg.name)
eval($required[ix]+"=$PyVar")
$ns[$required[ix]]=$PyVar
}else if($arg.name in $defaults){
$ns[$arg.name]=$PyVar
}else if($other_kw!=null){
$dict_items.push([$arg.name,$PyVar])
}else{
throw new TypeError($fname+"() got an unexpected keyword argument '"+$arg.name+"'")
}
if($arg.name in $defaults){delete $defaults[$arg.name]}
}else{
if(i<$required.length){
eval($required[i]+"=$PyVar")
$ns[$required[i]]=$PyVar
}else if(i<$required.length+$def_names.length){
$ns[$def_names[i-$required.length]]=$PyVar
}else if($other_args!=null){
eval('$ns["'+$other_args+'"].push($PyVar)')
}else{
msg=$fname+"() takes "+$required.length+' positional arguments '
msg +='but more were given'
throw TypeError(msg)
}
}
}
if($other_kw!=null){$ns[$other_kw]=dict($dict_items)}
return $ns
}
function $list_comp(loops,expr,cond){
var py='res = []\n'
for(i=0;i<loops.length;i++){
for(j=0;j<4*i;j++){py +=' '}
py +='for '+loops[i][0]+' in '+loops[i][1]+':\n'
}
if(cond){
for(j=0;j<4*i;j++){py +=' '}
py +='if '+cond+':\n'
i++
}
for(j=0;j<4*i;j++){py +=' '}
py +='tvar = '+expr+'\n'
for(j=0;j<4*i;j++){py +=' '}
py +='res.append(tvar)'
var js=$py2js(py).to_js()
eval(js)
return res
}
function $multiple_assign(indent,targets,right_expr,assign_pos){
var i=0,target=null
for(var i=0;i<targets.list;i++){
var left=targets[i]
if(left.list[0][3]==="local"){left.list[0][1]="var "+left.list[0][1]}
}
var rlist=right_expr.list
if(rlist[0][0]=="bracket"){rlist=rlist.slice(1,rlist.length-1)}
var rs=new Stack(rlist)
var rs_items=rs.split(',')
var seq=[]
if(rs_items.length>1){
if(rs_items.length>targets.length){
$raise("ValueError","Too many values to unpack (expected "+targets.length+")")
}else if(rs_items.length<targets.length){
$raise("ValueError","Need more than "+rs_items.length+" values to unpack")
}else{
var seq=[['code','var $temp=[]'],['newline','\n']]
for(i=0;i<targets.length;i++){
seq.push(['indent',indent],['code','$temp.push'],['bracket','('])
seq=seq.concat(rs_items[i].list)
seq.push(['bracket',')'],['newline','\n',assign_pos])
}
for(i=0;i<targets.length;i++){
seq.push(['indent',indent])
seq=seq.concat(targets[i].list)
seq.push(['assign','=',assign_pos],
['code','$temp['+i+']'],['newline','\n',assign_pos])
}
}
}else{
seq.push(['code',"var $var",assign_pos],['assign','='])
seq=seq.concat(right_expr.list)
seq.push(['newline','\n',assign_pos])
for(var i=0;i<targets.length;i++){
target=targets[i]
seq.push(['indent',indent])
seq=seq.concat(target.list)
seq.push(['assign','='],['code','$var.__item__('+i+')'],
['newline','\n'])
}
}
return seq
}
var $OpeningBrackets=$List2Dict('(','[','{')
var $ClosingBrackets=$List2Dict(')',']','}')
function $py2js(src,context,debug){
document.$debug=debug
var i=0
src=src.replace(/\r\n/gm,'\n')
while(src.length>0 &&(src.charAt(0)=="\n" || src.charAt(0)=="\r")){
src=src.substr(1)
}
if(src.charAt(src.length-1)!="\n"){src+='\n'}
if(!context){context='__main__';document.$py_src={'__main__':src}}
else{document.$py_src[context]=src}
document.$context=context
var pos2line={}
var lnum=1
for(i=0;i<src.length;i++){
pos2line[i]=lnum
if(src.charAt(i)=='\n'){lnum+=1}
}
var dobj=new Date()
var t0=dobj.getTime()
var times={}
tokens=$tokenize(src)
stack=new Stack(tokens)
var $err_num=0
if(debug){
var pos=0
var s_nl=0
while(true){
var nl=stack.find_next(pos,'newline')
if(nl==null){break}
var indent_pos=stack.find_previous(nl,'indent')
if(!stack.list[indent_pos+1].match(['keyword','else'])&&
!stack.list[indent_pos+1].match(['keyword','elif'])&&
!stack.list[indent_pos+1].match(['keyword','except'])){
stack.list.splice(s_nl,0,stack.list[indent_pos],
['code','document.line_num='+stack.list[nl][1],stack.list[nl][2]],
['newline','\n'])
s_nl=nl+4
pos=nl+5
}else{
s_nl=nl+1
pos=nl+2
}
}
}
var dobj=new Date()
times['add line nums']=dobj.getTime()-t0
var repl=[['not','in'],['is','not']]
for(i=0;i<repl.length;i++){
var seq=repl[i]
var pos=stack.list.length-1
while(pos>0){
var op_pos=stack.find_previous(pos,"operator",seq[1])
if(op_pos==null){break}
if(op_pos>1 && stack.list[op_pos-1].match(["operator",seq[0]])){
stack.list.splice(op_pos-1,2,['operator',seq[0]+'_'+seq[1],stack.list[op_pos][2]])
}
pos=op_pos-2
}
}
var pos=0
while(true){
var br_pos=stack.find_next(pos,'bracket','[')
if(br_pos===null){break}
var end=stack.find_next_matching(br_pos)
if(end-br_pos<5){pos=br_pos+1;continue}
var for_pos=stack.find_next_at_same_level(br_pos+1,'keyword','for')
if(for_pos===null){pos=br_pos+1;continue}
var expr=stack.list.slice(br_pos+1,for_pos)
var in_pos=stack.find_next_at_same_level(for_pos+1,'operator','in')
if(in_pos===null){$raise('SyntaxError',"missing 'in' in list comprehension")}
var loops=[]
var lvar=stack.list[for_pos+1][1]
while(true){
for_pos=stack.find_next_at_same_level(in_pos+1,'keyword','for')
if(for_pos===null){break}
var s=new Stack(stack.list.slice(in_pos+1,for_pos))
loops.push([lvar,s.to_js()])
in_pos=stack.find_next_at_same_level(for_pos+1,'operator','in')
if(in_pos===null){$raise('SyntaxError',"missing 'in' in list comprehension")}
lvar=stack.list[for_pos+1][1]
}
var if_pos=stack.find_next_at_same_level(in_pos+2,'keyword','if')
if(if_pos===null){
var s=new Stack(stack.list.slice(in_pos+1,end))
loops.push([lvar,s.to_js()])
var cond=[]
}else{
var s=new Stack(stack.list.slice(in_pos+1,if_pos))
loops.push([lvar,s.to_js()])
var cond=stack.list.slice(if_pos+1,end)
}
seq='$list_comp(['
for(var i=0;i<loops.length;i++){
seq +='["'+loops[i][0]+'","'+loops[i][1]+'"]'
if(i<loops.length-1){seq +=','}
}
seq +='],'
s=new Stack(expr)
seq +='"'+s.to_js()+'",'
if(cond){
s=new Stack(cond)
seq +='"'+s.to_js()+'")'
}else{seq +='"")'}
var tail=stack.list.slice(end+1,stack.list.length)
stack.list=stack.list.slice(0,br_pos).concat([['code',seq]]).concat(tail)
pos=br_pos+1
}
var not_a_display={
'[':[["id"],["assign_id"],['str'],['int'],['float'],["qualifier"],["bracket",$List2Dict("]",")")]], 
'(':[["id"],["assign_id"],["qualifier"],["bracket",$List2Dict("]",")")]], 
'{':[[]]
}
var PyType={'(':'tuple','[':'$list','{':'dict'}
var br_list=['[','(','{']
for(var ibr=0;ibr<br_list.length;ibr++){
var bracket=br_list[ibr]
var pos=stack.list.length-1
while(true){
var br_elt=stack.find_previous(pos,"bracket",bracket)
if(br_elt==null){break}
if(br_elt>0){
var previous=stack.list[br_elt-1]
var is_display=true
for(var inad=0;inad<not_a_display[bracket].length;inad++){
var args=not_a_display[bracket][inad]
if(args[0]==previous[0]){
if(args.length!=2 ||(previous[1]in args[1])){
is_display=false
}
}
}
if(!is_display){pos=br_elt-1;continue}
var pyType=PyType[bracket]
var br_pos=stack.list[br_elt][2]
var sequence=[['id',pyType,br_elt[2]],['bracket','(',br_pos]]
var end=stack.find_next_matching(br_elt)
if(pyType=='dict'){
var args=new Stack(stack.list.slice(br_elt+1,end))
if(args.list.length>0){
sequence=[['id','dict'],['bracket','('],
['id','$list'],['bracket','(']]
var kvs=args.split(',')
for(var ikv=0;ikv<kvs.length;ikv++){
var kv=kvs[ikv]
var elts=kv.split(':')
if(elts.length!=2){
document.line_num=pos2line[br_pos]
$raise("SyntaxError","invalid syntax")
}
var key=elts[0]
var value=elts[1]
var key_start=kv.start+key.start
var key_end=kv.start+key.end
sequence.push(['id','$list'])
sequence.push(['bracket','('])
sequence=sequence.concat(args.list.slice(key_start,key_end+1))
sequence.push(['delimiter',',',br_pos])
var value_start=kv.start+value.start
var value_end=kv.start+value.end
sequence=sequence.concat(args.list.slice(value_start,value_end+1))
sequence.push(['bracket',')'])
sequence.push(['delimiter',',',br_pos])
}
sequence.pop()
sequence.push(['bracket',')'])
}
sequence.push(['bracket',')',stack.list[end][2]])
}else if(pyType=='tuple'){
var args=new Stack(stack.list.slice(br_elt+1,end))
var kvs=args.split(',')
if(kvs.length==1){sequence[0][1]='$tuple'}
if(kvs[kvs.length-1].list.length==0){
if(kvs.length==2){sequence[0][1]='$tuple'}
stack.list[end-1]=['code','']
}
sequence=sequence.concat(stack.list.slice(br_elt+1,end))
sequence.push(['bracket',')',stack.list[end][2]])
}else{
var args=new Stack(stack.list.slice(br_elt+1,end))
if(end > br_elt+1){
sequence=sequence.concat(stack.list.slice(br_elt+1,end))
sequence.push(['bracket',')',stack.list[end][2]])
}else{sequence.push(['bracket',')',stack.list[end][2]])}
}
tail=stack.list.slice(end+1,stack.list.length)
stack.list=stack.list.slice(0,br_elt)
stack.list=stack.list.concat(sequence)
stack.list=stack.list.concat(tail)
}
pos=br_elt - 1
}
}
var dobj=new Date()
times['displays']=dobj.getTime()-t0
var pos=stack.list.length-1
while(true){
var def_pos=stack.find_previous(pos,"keyword","def")
if(def_pos==null){break}
var func_token=stack.list[def_pos+1]
var arg_start=stack.list[def_pos+2]
var indent_pos=stack.find_next(def_pos,'indent')
var indent=stack.list[indent_pos][1]
var f_indent='\n'
while(indent>0){f_indent+=' ';indent--}
document.line_num=pos2line[func_token[2]]
if(!func_token[0]=='id'){$raise("SyntaxError","wrong type after def")}
if(arg_start[0]!='bracket' || arg_start[1]!='('){
$raise("SyntaxError","missing ( after function name")
}
if(func_token[0]=='id' && arg_start[0]=='bracket'
&& arg_start[1]=='(' && 
!(stack.list[def_pos+3].match(["bracket",")"]))){
arg_end=stack.find_next_matching(def_pos+2)
for(var i=def_pos+2;i<arg_end;i++){
if(stack.list[i][0]=='id'){stack.list[i][0]='arg_id'}
}
var s=new Stack(stack.list.slice(def_pos+3,arg_end))
var args=s.split(',')
var required=[]
var defaults=[]
var has_defaults=false
var other_args=null
var other_kw=null
for(var i=args.length-1;i>=0;i--){
arg=args[i]
var op=null
if(arg.list[0][0]=="operator" && arg.list[1][0]=="arg_id"){
if(arg.list[0][1]=="*"){op='*';other_args=arg.list[1][1]}
else if(arg.list[0][1]=='**'){op='**';other_kw=arg.list[1][1]}
if(op!=null){
if(i==0){
stack.list.splice(def_pos+2+arg.start+1,arg.end-arg.start+1)
}else{
stack.list.splice(def_pos+2+arg.start,arg.end-arg.start+2)
}
}
}
if(op==null){
var elts=arg.split("=")
if(elts.length>1){
defaults.push([elts[0].list[0][1],elts[1].to_js()])
has_defaults=true
}else{
required.push(arg.list[0][1])
}
if(i==0){
stack.list.splice(def_pos+3+arg.start,arg.end-arg.start+1)
}else{
stack.list.splice(def_pos+2+arg.start,arg.end-arg.start+2)
}
}
}
var end_def=stack.find_next_at_same_level(def_pos,"delimiter",":")
if(end_def==null){
$raise("SyntaxError","Unable to find definition end "+end_def)
}
var arg_code='"'+func_token[1]+'",arguments,'
if(required.length==0){arg_code+='[],'}
else{
arg_code +='['
required.reverse()
for(ireq=0;ireq<required.length;ireq++){
arg_code+="'"+required[ireq]+"',"
}
arg_code=arg_code.substr(0,arg_code.length-1)+"],"
}
var def_code='{'
if(has_defaults){
for($idef=0;$idef<defaults.length;$idef++){
def_code +='"'+defaults[$idef][0]+'":'+defaults[$idef][1]+','
}
def_code=def_code.substr(0,def_code.length-1)
}
def_code +='}'
arg_code +=def_code+','
if(other_args==null){arg_code+="null,"}
else{arg_code +='"'+other_args+'",'}
if(other_kw==null){arg_code+="null"}
else{arg_code +='"'+other_kw+'"'}
var fcode=f_indent+'for($var in $ns){eval("var "+$var+"=$ns[$var]")}'
stack.list.splice(end_def+1,0,
['code',f_indent+"$ns=$MakeArgs("+arg_code+")"+fcode,stack.list[end_def][2]])
}
pos=def_pos-1
}
var dobj=new Date()
times['function defs']=dobj.getTime()-t0
pos=stack.list.length-1
while(true){
var br_pos=stack.find_previous(pos,"bracket","(")
if(br_pos==null){break}
if((stack.list[br_pos-1][0]=='id' || stack.list[br_pos-1][0]=="qualifier")
&& br_pos>1 && 
!(stack.list[br_pos-2].match(["keyword",'def']))){
var end_call=stack.find_next_matching(br_pos)
var s=new Stack(stack.list.slice(br_pos+1,end_call))
var args=s.split(',')
for(i=args.length-1;i>=0;i--){
var arg=args[i]
if(arg.list.length==0){continue}
var elts=arg.split('=')
if(elts.length==2){
var src_pos=elts[0].list[0][2]
var seq=[['code','$Kw("'+elts[0].list[0][1]+'",',src_pos]]
seq=seq.concat(elts[1].list)
seq.push(['code',')',src_pos])
var code='$Kw("'+elts[0].list[0][1]+'",'
code +=elts[1].to_js()+')'
stack.list.splice(br_pos+1+arg.start,arg.end-arg.start+1)
tail=stack.list.slice(br_pos+1+arg.start,stack.list.length)
stack.list=stack.list.slice(0,br_pos+1+arg.start).concat(seq).concat(tail)
}else if(arg.list[0][0]=="operator" &&
["*","**"].indexOf(arg.list[0][1])>-1){
if(arg.list[0][1]=='*'){var uf="$ptuple"}else{var uf="$pdict"}
stack.list.splice(br_pos+2+arg.end,0,['bracket',')'])
stack.list.splice(br_pos+1+arg.start,1,
["code",uf],['bracket','('])
}
}
}
pos=br_pos-1
}
var dobj=new Date()
times['function calls']=dobj.getTime()-t0
pos=0
var sign2mult={'+':1,'-':-1}
while(true){
var sign=stack.find_next(pos,"operator","+","-")
if(sign==null){break}
var op=stack.list[sign]
var mult=sign2mult[op[1]]
while(sign<stack.list.length-1){
var next=stack.list[sign+1]
if(next[0]=="operator" && next[1]in sign2mult){
mult *=sign2mult[next[1]]
stack.list.splice(sign+1,1)
}else{break }
}
if(mult !=sign2mult[op[1]]){
if(op[1]=='+'){stack.list[sign][1]='-'}
else{stack.list[sign][1]='+'}
}
pos=sign+1
}
pos=0
while(true){
var sign=stack.find_next(pos,"operator","+","-")
if(sign==null){break}
var op=stack.list[sign]
if(sign>0 && 
(stack.list[sign-1][0]in $List2Dict("delimiter","newline","indent","assign","operator")||
(stack.list[sign-1].match(["keyword","return"]))||
(stack.list[sign-1][0]=="bracket" &&("({[".indexOf(stack.list[sign-1][1])>-1)))){
if(sign<stack.list.length-1){
var next=stack.list[sign+1]
if(next[0]=="int" || next[0]=="float"){
var value=next[1]
if(op[1]=='-'){
stack.list[sign+1][1]=-1*stack.list[sign+1][1]
}
stack.list.splice(sign,1)
}else if(next[0]=="id"){
var mult=1
if(op[1]=="-"){mult=-1}
stack.list.splice(sign,1,["int",mult,op[2]],
['operator','*',op[2]])
}
}
}
pos=sign+1
}
pos=0
while(pos<stack.list.length){
var imp_pos=stack.find_next(pos,"keyword","import")
if(imp_pos==null){break}
var imported=stack.atom_at(imp_pos+1,true)
if(imported.type !='id' && imported.type !='tuple'){
document.line_num=pos2line[stack.list[imp_pos][2]]
$raise("SyntaxError","invalid syntax")
}
for(var i=0;i<imported.list().length;i++){
if(stack.list[imported.start+i][0]=="id"){
stack.list[imported.start+i][0]='str'
stack.list[imported.start+i][1]='"'+stack.list[imported.start+i][1]+'"'
}
}
var src_pos=stack.list[imp_pos][2]
stack.list.splice(imported.end+1,0,['bracket',')'])
stack.list.splice(imp_pos,1,
['code','$import',src_pos],['bracket','(',src_pos])
pos=imp_pos+1
}
var dobj=new Date()
times['misc']=dobj.getTime()-t0
var pos=0
while(true){
var try_pos=stack.find_next(pos,"keyword","try")
if(try_pos===null){break}
var try_indent=0
if(try_pos==0){try_indent=0}
else if(stack.list[try_pos-1][0]=='indent'){try_indent=stack.list[try_pos-1][1]}
var block=stack.find_block(try_pos)
var nxt=block[1]
var exc_pos=try_pos
var clauses=[]
while(true){
exc_pos=stack.next_at_same_indent(exc_pos)
if(exc_pos===null){break}
if(stack.list[exc_pos][0]!=="keyword" &&
["except","finally","else"].indexOf(stack.list[exc_pos][1])==-1){
break
}
clauses.push(exc_pos)
}
if(clauses.length==0){$raise('SyntaxError','invalid syntax')}
var last_block=stack.find_block(clauses[clauses.length-1])
for(var i=clauses[0]-1;i<last_block[1];i++){
if(stack.list[i][0]=="indent"){
stack.list[i][1]=stack.list[i][1]+4
}
}
for(var i=clauses.length-1;i>=0;i--){
var clause=stack.list[clauses[i]]
if(clause[1]=='except'){
stack.list[clauses[i]][1]='else'
if(!stack.list[clauses[i]+1].match(['delimiter',':'])){
var excs=stack.atom_at(clauses[i]+1,true)
if(excs.type=="id"){
var exc=stack.list[clauses[i]+1]
stack.list[clauses[i]+1]=['code','if($err'+$err_num+'.name=="'+exc[1]+'")']
}else if(excs.type=="function_call"){
var exc_str=[],exc_list=excs.list()
for(var j=2;j<exc_list.length;j++){
if(exc_list[j][0]=="id"){exc_str.push('"'+exc_list[j][1]+'"')}
}
stack.list.splice(clauses[i]+1,exc_list.length,
['code','if(['+exc_str.join(',')+'].indexOf($err'+$err_num+'.name)>-1)'])
}else{$raise('SyntaxError','invalid syntax')}
}
}
}
stack.list.splice(nxt+1,0,['indent',try_indent],['keyword','catch'],
['id','$err'+$err_num],['delimiter',':'],['newline','\n'])
stack.list.splice(nxt+6,0,['indent',try_indent+4],['code','if(false){void(0)}'],
['newline','\n'])
pos=try_pos+1
$err_num++
}
var pos=stack.list.length-1
while(true){
var assert_pos=stack.find_previous(pos,"keyword","assert")
if(assert_pos===null){break}
var assert_indent=stack.indent(assert_pos)
var end=stack.line_end(assert_pos)
var cond_block=stack.list.slice(assert_pos+1,end)
stack.list[assert_pos][1]="if"
stack.list.splice(end,0,['delimiter',':'],['newline','\n'],
['indent',assert_indent+4],['keyword','pass'],['newline','\n'],
['indent',assert_indent],['keyword','else'],['delimiter',':'],['newline','\n'],
['indent',assert_indent+4],['code','$raise("AssertionError")'])
pos=assert_pos-1
}
var pos=stack.list.length-1
while(true){
var if_pos=stack.find_previous(pos,'keyword','if')
if(if_pos===null){break}
var line_end=stack.line_end(if_pos)
var else_pos=stack.find_next(if_pos+1,'keyword','else')
if(else_pos===null || else_pos>line_end){pos=if_pos-1;continue}
var r1=stack.atom_before(if_pos,true)
var cond=stack.list.slice(if_pos+1,else_pos)
var r2=stack.atom_at(else_pos+1)
var tail=stack.list.slice(r2.end+1,stack.list.length)
var seq=cond
seq.push(['delimiter','?'])
seq=seq.concat(r1.list())
seq.push(['delimiter',':'])
seq=seq.concat(r2.list())
stack.list=stack.list.slice(0,if_pos-r1.end+r1.start-1).concat(seq).concat(tail)
pos=if_pos-1
}
var kws={'if':'if','else':'else','elif':'else if',
'def':'function','for':'for','while':'while',
'try':'try','catch':'catch','finally':'finally'}
var has_parenth=$List2Dict('if','elif','while','for','catch')
var $funcs=[]
var module_level_functions=[]
var loop_id=0
for(kw in kws){
pos=0
while(pos<stack.list.length){
var kw_pos=stack.find_next(pos,"keyword",kw)
if(kw_pos==null){break}
var kw_indent=stack.indent(kw_pos)
var src_pos=stack.list[kw_pos][2]
var block=stack.find_block(kw_pos)
if(block===null){
if(kw==='if' || kw==='else'){
pos=kw_pos+1
continue
}
document.line_num=pos2line[stack.list[kw_pos][2]]
$raise('SyntaxError')
}
s=new Stack(stack.list.slice(block[0],block[1]+1))
if(block==null){console.log('anomalie '+kw);pos=kw_pos-1;continue}
var multiline=(s.find_next(0,'newline')!=null)
stack.list[kw_pos][1]=kws[kw]
stack.list[block[0]]=['bracket','{']
var end_pos=stack.list[block[1]][2]
tail=stack.list.slice(block[1],stack.list.length)
if(kw in has_parenth){
if(kw=="for"){
loop_id++
var block_indent=stack.indent(block[0]+1)
var arg_list=stack.atom_at(kw_pos+1,true)
var _in=stack.atom_at(arg_list.end+1)
var _in_list=stack.list.slice(_in.start,_in.end+1)
if(_in_list.length !=1 || 
_in_list[0][0]!="operator" || _in_list[0][1]!="in"){
$raise("SyntaxError","missing 'in' after 'for'",src,src_pos)
}
var iterable=stack.atom_at(_in.end+1,true)
seq=[['indent',kw_indent],
['code','var $iter'+loop_id],['assign','=']]
seq=seq.concat(iterable.list())
seq.push(['newline','\n'],['indent',kw_indent],['code','for'])
var $loop='(var $i'+loop_id+'=0;$i'+loop_id+'<'
$loop +='$iter'+loop_id+'.__len__();$i'+loop_id+'++){'
seq=seq.concat([['code',$loop],['newline','\n'],
['indent',block_indent]])
seq=seq.concat(arg_list.list())
seq.push(['assign','='],['id','$iter'+loop_id])
seq.push(['point','.'],['qualifier','__item__'],
['bracket','('],['id','$i'+loop_id],['bracket',')'])
seq=seq.concat(stack.list.slice(block[0]+1,block[1]))
stack.list=stack.list.slice(0,kw_pos-1)
stack.list=stack.list.concat(seq)
$err_num++
}else if(kw=='if' || kw=='elif' || kw=='while'){
var seq=[['bracket','(',src_pos]]
seq=seq.concat(stack.list.slice(kw_pos+1,block[0]))
seq.push(['bracket',')',src_pos])
seq.push(stack.list[block[0]])
seq=seq.concat(stack.list.slice(block[0]+1,block[1]))
stack.list=stack.list.slice(0,kw_pos+1)
stack.list=stack.list.concat(seq)
}else{
var seq=[['bracket','(',src_pos]]
seq=seq.concat(stack.list.slice(kw_pos+1,block[0]))
seq.push(['bracket',')',src_pos])
seq.push(stack.list[block[0]])
seq=seq.concat(stack.list.slice(block[0]+1,block[1]))
stack.list=stack.list.slice(0,kw_pos+1)
stack.list=stack.list.concat(seq)
}
}else if(kws[kw]=="function"){
var func_name=stack.list[kw_pos+1]
var i=0,parent=false
for(i=$funcs.length-1;i>=0;i--){
if(kw_pos>$funcs[i][1]&& kw_pos<$funcs[i][2]){parent=true;break}
}
$funcs.push([func_name[1],block[0],block[1],parent])
stack.list[kw_pos+1][0]="function_id"
seq=stack.list.slice(kw_pos+1,block[0]+1)
var fbody=stack.list.slice(block[0]+1,block[1])
var globals={}
var fstack=new Stack(fbody)
var global_pos=fstack.find_next(0,'keyword','global')
if(global_pos!==null){
var globs=fstack.atom_at(global_pos+1,true)
if(globs.type=="id" || globs.type=="tuple" ||
globs.type=="function_call"){
var glob_list=globs.list()
for(var i=0;i<glob_list.length;i++){
if(glob_list[i][0]=='id'){globals[glob_list[i][1]]=0}
}
}
fbody.splice(global_pos,glob_list.length+1)
}
seq=seq.concat(fbody)
for(var i=0;i<seq.length;i++){
if(seq[i][0]=="id"){
if(!(seq[i][1]in globals)){seq[i].push('local')}
}
}
stack.list=stack.list.slice(0,kw_pos+1)
stack.list=stack.list.concat(seq)
var fname=stack.list[kw_pos+1][1]
var indent=stack.indent(kw_pos)
var f_indent=''
while(indent>0){f_indent+=' ';indent--}
if(!parent){
var code='\n'+f_indent+'window.'+fname+'='+fname
module_level_functions.push(fname)
tail.splice(0,0,['func_end',code])
}
}else{
stack.list=stack.list.slice(0,block[1])
}
stack.list.push(['newline','\n',end_pos])
if(block[2]>0){
stack.list.push(['indent',block[2],end_pos])
}
stack.list.push(['bracket','}',end_pos])
stack.list=stack.list.concat(tail)
pos=kw_pos+1
}
}
var dobj=new Date()
times['if def class for']=dobj.getTime()-t0
pos=stack.list.length-1
while(true){
var op=stack.find_previous(pos,"operator","not")
if(op==null){break}
ro=stack.atom_at(op+1)
seq=[['bracket','(']]
seq=seq.concat(ro.list())
seq.push(['bracket',')'])
stack.list[op]=["id","$not",stack.list[op][2]]
var tail=stack.list.slice(ro.end+1,stack.list.length)
stack.list=stack.list.slice(0,op+1).concat(seq).concat(tail)
pos=op-1
}
pos=stack.list.length-1
while(true){
var assign=stack.find_previous(pos,"assign")
if(assign===null){break}
if(stack.list[assign][1]in $augmented_assigns){
var left=stack.atom_before(assign)
if(left.type=="id"){left.list()[0][3]="global"}
var op=stack.list[assign][1]
var simple_op=op.substr(0,op.length-1)
stack.list[assign][1]="=" 
stack.list.splice(assign+1,0,['operator',simple_op])
for(var i=left.list().length-1;i>=0;i--){
stack.list.splice(assign+1,0,left.list()[i])
}
}
pos=assign-1
}
var ops_order=["**","*","/","//","%","-","+",
"<","<=",">",">=","!=","==",
"+=","-=","*=","/=","//=","%=","**=",
"not_in","in","is_not"]
var ops=[], op=null
var lo1=$List2Dict(["id","bracket"])
var lo2=$List2Dict(["id","bracket","delimiter","operator"])
for(var i=0;i<ops_order.length;i++){
op=ops_order[i]
if(op=="+" || op=="-"){
ops.push([op,lo2])
}else{
ops.push([op,lo1])
}
}
var $lo_ok=$List2Dict('id','str','int','float','tuple')
for(var i=0;i<ops.length;i++){
operator=ops[i]
var op_sign=operator[0]
var auth_lo_types=operator[1]
var py_op='__'+$operators[op_sign]+'__'
pos=0
while(true){
var op=stack.find_next(pos,"operator",op_sign)
if(op==null){break}
var lo=stack.atom_before(op,false)
if(!lo.type in $lo_ok){
document.line_num=pos2line[stack.list[op][2]]
$raise("SyntaxError","Bad left operand type "+lo.type+" for "+op_sign)
}
var par_before_lo=false
if(lo.type!="tuple"){
var before_lo=stack.list[lo.start-1]
if(before_lo!=null){
if(before_lo[0]=="operator"){
par_before_lo=true
}
}
}
if(op==stack.list.length-1){
$raise("SyntaxError","Bad right operand ",src,stack.list[op][2])
}
var ro=stack.atom_at(op+1,false)
if(op_sign in $List2Dict("+=","-=","*=","/=","//=","%=","**=")){
ro.end=stack.find_next(op,'newline')-1
}
var ro_startswith_par=false
if(ro!=null && ro.type=="tuple"){ro_startswith_par=true}
var sequence=new Array()
if(par_before_lo){sequence.push(["bracket","(",op[2]])}
sequence=sequence.concat(stack.list.slice(lo.start,lo.end+1))
sequence.push(["point",".",op[2]])
sequence.push(["qualifier",py_op,op[2]])
if(!ro_startswith_par){sequence.push(["bracket","(",op[2]])}
sequence=sequence.concat(stack.list.slice(ro.start,ro.end+1))
if(!ro_startswith_par){sequence.push(["bracket",")",op[2]])}
if(par_before_lo){sequence.push(["bracket",")",op[2]])}
tail=stack.list.slice(ro.end+1,stack.list.length)
stack.list.splice(lo.start,ro.end-lo.start+1)
stack.list=stack.list.slice(0,lo.start).concat(sequence).concat(tail)
pos=op+1
}
}
var ops={"and":"&&","or":"||"}
for(var op in ops){
var pos=0
while(true){
var op_pos=stack.find_next(pos,'operator',op)
if(op_pos===null){break}
stack.list[op_pos][1]=ops[op]
var left=stack.atom_before(op_pos,false)
var right=stack.atom_at(op_pos+1,false)
var head=stack.list.slice(0,left.start)
var tail=stack.list.slice(right.end+1,stack.list.length)
var nb=0
if(left.list()[0].match(['bracket','('])){
left=[['id','$test_item']].concat(left.list())
nb++
}else if(!left.list()[0].match(['id','$test_item'])){
left=[['id','$test_item'],['bracket','(']].concat(left.list()).concat([['bracket',')']])
nb +=3
}else{
left=left.list()
}
if(right.list()[0].match(['bracket','('])){
right=[['id','$test_item']].concat(right.list())
nb++
}else{
right=[['id','$test_item'],['bracket','(']].concat(right.list()).concat([['bracket',')']])
nb+=3
}
stack.list=head
stack.list=stack.list.concat(left).concat([['operator',ops[op]]]).concat(right)
stack.list=stack.list.concat(tail)
pos+=nb
}
}
var pos=0
while(true){
var test_pos=stack.find_next(pos,'id','$test_item')
if(test_pos===null){break}
var test_end=stack.find_next_matching(test_pos+1)
while(test_end<stack.list.length-1 && stack.list[test_end+1][0]=='operator'
&&(stack.list[test_end+1][1]=='&&' || stack.list[test_end+1][1]=='||')){
test_end=stack.find_next_matching(test_end+3)
}
stack.list.splice(test_end,0,['bracket',')'])
stack.list.splice(test_pos,0,['code','$test_expr'],['bracket','('])
pos=test_end
}
var dobj=new Date()
times['operators']=dobj.getTime()-t0
var js2py={'pass':'void(0)'}
for(key in js2py){
pos=0
while(true){
var func_pos=stack.find_next(pos,'keyword',key)
if(func_pos==null){break}
stack.list[func_pos][1]=js2py[key]
pos=func_pos+1
}
}
var js2py={'alert':'$alert','prompt':'$prompt','confirm':'$confirm'}
for(key in js2py){
pos=0
while(true){
var func_pos=stack.find_next(pos,'id',key)
if(func_pos==null){break}
stack.list[func_pos][0]='code' 
stack.list[func_pos][1]=js2py[key]
pos=func_pos+1
}
}
var pos=stack.list.length-1
while(true){
var assign=stack.find_previous(pos,"assign","=")
if(assign===null){break}
var line_start=stack.line_start(assign)
var line_end=stack.line_end(assign)
var line_stack=new Stack(stack.list.slice(line_start,line_end))
var line_pos=line_stack.list.length-1
var assigns=[]
var nb_assigns=0
while(true){
var assign_pos=line_stack.find_previous(line_pos,'assign','=')
if(assign_pos===null){break}
nb_assigns++
var left=line_stack.atom_before(assign_pos,true)
var right=line_stack.atom_at(assign_pos+1,true)
assigns.push(stack.list[line_start])
assigns=assigns.concat(left.list())
assigns.push(["assign","="])
assigns=assigns.concat(right.list())
assigns.push(['newline','\n'])
line_pos=assign_pos-1
}
if(nb_assigns>1){
var assign_stack=new Stack(assigns)
var tail=stack.list.slice(line_end,stack.list.length)
stack.list=stack.list.slice(0,line_start).concat(assigns).concat(tail)
}
pos=line_start
}
pos=stack.list.length-1
while(true){
var assign=stack.find_previous(pos,"assign","=")
if(assign==null){break}
var left=stack.atom_before(assign,true)
var line_end=stack.line_end(assign)
var right=new Stack(stack.list.slice(assign+1,line_end))
if(left.type=="tuple" || 
(left.type=="function_call" && left.list()[0][1]=="tuple")){
var list=left.list()
if(list[0].match(["id","tuple"])){
list=list.slice(2,list.length-1)
}
var t_stack=new Stack(list)
var targets=t_stack.split(',')
document.line_num=pos2line[stack.list[assign][2]]
var indent=stack.indent(assign)
var seq=$multiple_assign(indent,targets,right,stack.list[assign][2])
var tail=stack.list.slice(line_end+1,stack.list.length)
stack.list=stack.list.slice(0,left.start).concat(seq).concat(tail)
pos=left.start+seq.length-1
}else if(left.type=='str' || left.type=='int' || left.type=='float'){
pos=left.list()[0][2]
document.line_num=pos2line[pos]
$raise("SyntaxError","can't assign to literal")
}else if(left.type=='id' && $tags.indexOf(left.list()[0][1])>-1){
$raise("SyntaxError","can't assign to reserved word "+left.list()[0][1])
}else if(left.type=='qualified_id' || left.type=='slicing' || left.type=="function_call"){
pos=assign-1
}else{
if(left.list()[0][3]==="local"){left.list()[0][1]="var "+left.list()[0][1]}
var r_elts=right.split(',')
if(r_elts.length>1){
stack.list.splice(line_end,0,['bracket',']'])
stack.list.splice(assign+1,0,['bracket','['])
assign--
}
pos=assign-1
}
}
var dobj=new Date()
times['assignments']=dobj.getTime()-t0
pos=stack.list.length-1
while(true){
br_pos=stack.find_previous(pos,'bracket','[')
if(br_pos==null){break}
if(br_pos==0){break}
var previous=stack.list[br_pos-1]
if(['id','qualifier','keyword'].indexOf(previous[0])==-1){pos=br_pos-1;continue}
src_pos=stack.list[br_pos][2]
var end=stack.find_next_matching(br_pos)
var args=stack.list.slice(br_pos+1,end)
if(args.length==0){$raise('SyntaxError','invalid syntax')}
var args1=new Stack(args)
var items=args1.split(":")
var new_args=[]
if(items.length==1){
new_args=items[0].list
}else{
new_args=[['id','slice',src_pos]]
new_args.push(['bracket','(',src_pos])
for(var i=0;i<items.length;i++){
var item=items[i]
if(item.list.length==0){
new_args.push(['keyword','null',src_pos])
}else{
new_args=new_args.concat(item.list)
}
if(i<items.length-1){
new_args.push(["delimiter",",",src_pos])
}
}
new_args.push(['bracket',')',stack.list[end][2]])
}
if(end<stack.list.length-1 && stack.list[end+1][0]=="assign"){
var sequence=[['point','.',src_pos],['qualifier','__setitem__',src_pos],
['bracket','(',src_pos]]
left=stack.atom_before(end+1)
right=stack.atom_at(end+2)
sequence=sequence.concat(new_args)
sequence.push(['delimiter',',',stack.list[end+1][2]])
sequence=sequence.concat(right.list())
sequence.push(['bracket',')',stack.list[end][2]])
tail=stack.list.slice(right.end+1,stack.list.length)
stack.list=stack.list.slice(0,br_pos)
stack.list=stack.list.concat(sequence).concat(tail)
}else{
var func='__getitem__'
var x=stack.atom_before(br_pos)
if(x.start>0){
var before=stack.list[x.start-1]
if(before[0]=='keyword' && before[1]=='del'){
var func='__delitem__'
}
}
var sequence=[['point','.',src_pos],['qualifier',func,src_pos],
['bracket','(',src_pos]]
sequence=sequence.concat(new_args)
sequence.push(['bracket',')',stack.list[end][2]])
tail=stack.list.slice(end+1,stack.list.length)
stack.list=stack.list.slice(0,br_pos)
stack.list=stack.list.concat(sequence).concat(tail)
if(func=='__delitem__'){
stack.list.splice(x.start-1,1)
}
}
pos=br_pos-1
}
var dobj=new Date()
times['slicings']=dobj.getTime()-t0
pos=stack.list.length-1
while(true){
q_pos=stack.find_previous(pos,'qualifier')
if(q_pos==null){break}
src_pos=stack.list[q_pos][2]
if(q_pos<stack.list.length-1 && stack.list[q_pos+1][0]=="assign"){
var ro=stack.atom_at(q_pos+2)
var q_name=stack.list[q_pos][1]
if(q_name.substr(0,2)=='__'){pos=q_pos-1;continue}
tail=stack.list.slice(ro.end+1,stack.list.length)
var seq=[['id','__setattr__'],['bracket','('],
['code',"'"+q_name+"'"],['delimiter',',']]
seq=seq.concat(ro.list()).concat([['bracket',')']])
stack.list=stack.list.slice(0,q_pos).concat(seq).concat(tail)
}else{
var func='__getattr__'
var x=stack.atom_before(q_pos)
if(x.start>0){
var before=stack.list[x.start-1]
if(before[0]=='keyword' && before[1]=='del'){
var func='__delattr__'
}
}
var q_name=stack.list[q_pos][1]
if(q_name.substr(0,2)=='__'){pos=q_pos-1;continue}
stack.list.splice(q_pos,1,['id',func],['bracket','('],
['code',"'"+q_name+"'"],['bracket',')'])
if(func=='__delattr__'){
stack.list.splice(x.start-1,1)
}
}
pos=q_pos-1
}
var pos=0
while(true){
var $list_pos=stack.find_next(pos,'id','$list')
if($list_pos===null){break}
stack.list.splice($list_pos,1)
var end=stack.find_next_matching($list_pos)
stack.list[$list_pos][1]='['
stack.list[end][1]=']'
pos=$list_pos
}
var pos=0
while(true){
var func_pos=stack.find_next(pos,'keyword','function')
if(func_pos===null){break}
var br_pos=stack.find_next_at_same_level(func_pos,'bracket','{')
var end_pos=stack.find_next_matching(br_pos)
var block=new Stack(stack.list.slice(br_pos+1,end_pos))
pos=func_pos+1
}
var dobj=new Date()
times['total']=dobj.getTime()-t0
return stack
}
function $run(js){
eval(js)
}
function brython(debug){
var elts=document.getElementsByTagName("script")
for($i=0;$i<elts.length;$i++){
var elt=elts[$i]
if(elt.type=="text/python"){
var src=(elt.innerHTML || elt.textContent)
js=$py2js(src,null,debug).to_js()
if(debug==2){document.write('<textarea cols=120 rows=30>'+js+'</textarea>')}
try{
$run(js)
}catch(err){$raise('ExecutionError',err.message)
if(err.py_error===undefined){$raise('ExecutionError',err.message)}
else{throw err}
}
}
}
}var $operators={
"//=":"ifloordiv",">>=":"irshift","<<=":"ilshift",
"**=":"ipow","**":"pow","//":"floordiv","<<":"lshift",">>":"rshift",
"+=":"iadd","-=":"isub","*=":"imul","/=":"itruediv",
"%=":"imod","&=":"iand","|=":"ior",
"^=":"ipow","+":"add","-":"sub","*":"mul",
"/":"truediv","%":"mod","&":"and","|":"or",
"^":"pow","<":"lt",">":"gt",
"<=":"le",">=":"ge","==":"eq","!=":"ne",
"or":"or","and":"and","in":"in","not":"not",
"in":"in","not":"not",
"not_in":"not_in","is_not":"is_not" 
}
var $augmented_assigns={
"//=":"ifloordiv",">>=":"irshift","<<=":"ilshift",
"**=":"ipow","+=":"iadd","-=":"isub","*=":"imul","/=":"itruediv",
"%=":"imod","^=":"ipow"
}
var $first_op_letter={}
for(op in $operators){$first_op_letter[op.charAt(0)]=0}
function $tokenize(src){
var delimiters=[["#","\n","comment"],['"""','"""',"triple_string"],
["'","'","string"],['"','"',"string"],
["r'","'","raw_string"],['r"','"',"raw_string"]]
var br_open={"(":0,"[":0,"{":0}
var br_close={")":"(","]":"[","}":"{"}
var br_stack=""
var br_pos=new Array()
var kwdict=["False","class","finally","is","return",
"None","continue","for","lambda","try","True","def","from",
"nonlocal","while","del","global","with",
"as","elif","if","yield","assert","else","import","pass",
"break","except","raise"]
var unsupported=["class","is","from","nonlocal","with",
"as","yield"]
var forbidden=['item','var',
'closed','defaultStatus','document','frames',
'history','innerHeight','innerWidth','length',
'location','name','navigator','opener',
'outerHeight','outerWidth','pageXOffset','pageYOffset',
'parent','screen','screenLeft','screenTop',
'screenX','screenY','self','status',
'top']
var punctuation={',':0,':':0}
var int_pattern=new RegExp("^\\d+")
var float_pattern=new RegExp("^\\d+\\.\\d*(e-?\\d+)?")
var id_pattern=new RegExp("[\\$_a-zA-Z]\\w*")
var stack=new Array()
var name=""
var _type=null
var pos=0
while(pos<src.length && src.charAt(pos)==' '){pos++}
var indent_stack=[pos]
stack.push(['indent',pos,0])
var pos2line={}
var lnum=1
for(i=0;i<src.length;i++){
pos2line[i]=lnum
if(src.charAt(i)=='\n'){lnum+=1}
}
lnum=0
while(pos<src.length){
document.line_num=pos2line[pos]
var flag=false
var car=src.charAt(pos)
if(stack.length==0 || $last(stack)[0]=='newline'){
var indent=0
while(pos<src.length && src.charAt(pos)==" "){
indent++;pos++
}
if(src.charAt(pos)=='\n'){pos++;lnum++;continue}
if(stack.length>1){
if(indent>$last(indent_stack)){
if(stack[stack.length-2][0]!="delimiter" &&
stack[stack.length-2][1]!=":"){
$raise("IndentationError","unexpected indent")
}else{
indent_stack.push(indent)
}
}else if(indent==$last(indent_stack)){
if(stack[stack.length-2][0]=="delimiter" &&
stack[stack.length-2][1]==":"){
$raise("IndentationError","expected an indented block")
}
}else if(indent<$last(indent_stack)){
indent_stack.pop()
while(true){
if(indent_stack.length==0){
$raise('IndentationError','unexpected indent')
}
if(indent>$last(indent_stack)){
$raise('IndentationError','unexpected indent')
}else if(indent==$last(indent_stack)){break}
else{indent_stack.pop()}
}
}
}else if(indent>0){
$raise("IndentationError","unexpected indent")
}
stack.push(["indent",indent,pos-indent])
continue
}
if(car=="#"){
var end=src.substr(pos+1).search('\n')
if(end==-1){end=src.length-1}
stack.push(["newline",lnum,pos+1+end])
lnum +=1
pos +=end+2;continue
}
if(car=='"' || car=="'"){
var raw=false
var end=null
if(name.length>0 && name.toLowerCase()=="r"){
raw=true;name=""
}
if(src.substr(pos,3)==car+car+car){_type="triple_string";end=pos+3}
else{_type="string";end=pos+1}
var escaped=false
var zone=car
var found=false
while(end<src.length){
if(escaped){zone+=src.charAt(end);escaped=false;end+=1}
else if(src.charAt(end)=="\\"){
if(raw){
zone +='\\\\'
end++
}else{
if(src.charAt(end+1)=='\n'){
end +=2
lnum++
}else{
zone+=src.charAt(end);escaped=true;end+=1
}
}
}else if(src.charAt(end)==car){
if(_type=="triple_string" && src.substr(end,3)!=car+car+car){
end++
}else{
found=true
if(stack.length>0 && $last(stack)[0]=="str"){
stack.push(['operator','+',end])
}
stack.push(["str",zone+car,pos])
pos=end+1
if(_type=="triple_string"){pos=end+3}
break
}
}else{
zone +=src.charAt(end)
if(src.charAt(end)=='\n'){lnum++}
end++
}
}
if(!found){
document.line_num=pos2line[pos]
$raise('SyntaxError',"String end not found ")
}
continue
}
if(name==""){
if(car.search(/[a-zA-Z_]/)!=-1){
name=car 
pos++;continue
}
}else{
if(car.search(/\w/)!=-1){
name+=car
pos++;continue
}else{
if(kwdict.indexOf(name)>-1){
if(unsupported.indexOf(name)>-1){
document.line_num=pos2line[pos]
$raise('SyntaxError',"Unsupported Python keyword '"+name+"'")
}
stack.push(["keyword",name,pos-name.length])
}else if(name in $operators){
stack.push(["operator",name,pos-name.length])
}else if(stack.length>1 && $last(stack)[0]=="point"
&&(['id','str','int','float','qualifier','bracket'].indexOf(stack[stack.length-2][0])>-1)){
stack.push(["qualifier",name,pos-name.length])
}else if(forbidden.indexOf(name)>-1){
document.line_num=pos2line[pos]
$raise('SyntaxError',"Forbidden name '"+name+"' : might conflict with Javascript variables")
}else{
stack.push(["id",name,pos-name.length])
}
name=""
continue
}
}
if(car=="."){
stack.push(["point",".",pos])
pos++;continue
}
if(car.search(/\d/)>-1){
var res=float_pattern.exec(src.substr(pos))
if(res){
if(res[0].search('e')>-1){stack.push(["float",res[0],pos])}
else{stack.push(["float",eval(res[0]),pos])}
}else{
res=int_pattern.exec(src.substr(pos))
stack.push(["int",eval(res[0]),pos])
}
pos +=res[0].length
continue
}
if(car=="\n"){
lnum++
if(br_stack.length>0){
pos++;continue
}else{
if(stack[stack.length-1][0]!="newline"){
stack.push(["newline",lnum,pos])
}else{
stack[stack.length-1][1]=lnum 
}
pos++;continue
}
}
if(car in br_open){
br_stack +=car
br_pos[br_stack.length-1]=pos
stack.push(["bracket",car,pos])
pos++;continue
}
if(car in br_close){
if(br_stack==""){
document.line_num=pos2line[pos]
$raise('SyntaxError',"Unexpected closing bracket")
}else if(br_close[car]!=$last(br_stack)){
document.line_num=pos2line[pos]
$raise('SyntaxError',"Unbalanced bracket ")
}else{
br_stack=br_stack.substr(0,br_stack.length-1)
stack.push(["bracket",car,pos])
pos++;continue
}
}
if(car=="="){
if(src.charAt(pos+1)!="="){
if(br_stack.length==0){
stack.push(["assign","=",pos])
}else{
stack.push(["delimiter","=",pos])
}
pos++;continue
}else{
stack.push(["operator","==",pos])
pos+=2;continue
}
}
if(car in punctuation){
stack.push(["delimiter",car,pos])
pos++;continue
}
if(car in $first_op_letter){
var op_match=""
for(op_sign in $operators){
if(op_sign==src.substr(pos,op_sign.length)
&& op_sign.length>op_match.length){
op_match=op_sign
}
}
if(op_match.length>0){
if(op_match in $augmented_assigns){
stack.push(["assign",op_match,pos])
}else{
stack.push(["operator",op_match,pos])
}
pos +=op_match.length
continue
}
}
if(car=='\\' && src.charAt(pos+1)=='\n'){
lnum++;pos+=2;continue
}
if(car!=' '){$raise('SyntaxError','unknown token ['+car+']')}
pos +=1
}
if(br_stack.length!=0){
pos=br_pos.pop()
document.line_num=pos2line[pos]
$raise('SyntaxError',"Unbalanced bracket "+br_stack.charAt(br_stack.length-1))
}
return stack
}
function $JS2Py(src){
if(src===null){return None}
if(src===false){return False}
if(src===true){return True}
if(isinstance(src,[str,int,float,list,dict,set])){return src}
htmlelt_pattern=new RegExp(/\[object HTML(.*)Element\]/)
if(["string","number"].indexOf(typeof src)>-1){
return src
}else if(typeof src=="object"){
if(src.constructor===Array){return src}
else if(src.tagName!==undefined && src.nodeName!==undefined){return $DomElement(src)}
else{
try{if(src.constructor==DragEvent){return new $MouseEvent(src)}}
catch(err){void(0)}
try{if(src.constructor==MouseEvent){return new $MouseEvent(src)}}
catch(err){void(0)}
try{if(src.constructor==KeyboardEvent){return new $DomWrapper(src)}}
catch(err){void(0)}
if(src.__class__!==undefined){return src}
return new $DomObject(src)
}
}else{return src}
}
function $raise(name,msg){
if(document.$debug==0){return}
if(msg===undefined){msg=''}
var lines=document.$py_src[document.$context].split('\n')
msg +='\nLine '+document.line_num+'\n'+lines[document.line_num-1]
err=new Error(name+": "+msg)
err.name=name
err.message=name+": "+msg
err.py_error=true
throw err
}
function $UnsupportedOpType(op,class1,class2){
$raise('TypeError',
"unsupported operand type(s) for "+op+": '"+class1+"' and '"+class2+"'")
}
function $KwClass(name,value){
this.__class__=$Kw
this.name=name
this.value=value
}
$KwClass.prototype.toString=function(){
return '<kw '+this.name+' : '+this.value.toString()+'>'
}
function $Kw(name,value){
return new $KwClass(name,value)
}
function $ptuple_class(arg){
this.__class__=$ptuple
this.arg=arg
}
function $ptuple(arg){return new $ptuple_class(arg)}
function $pdict_class(arg){
this.__class__=$pdict
this.arg=arg
}
function $pdict(arg){return new $pdict_class(arg)}
function $test_item(expr){
document.$test_result=expr
return bool(expr)
}
function $test_expr(){
return document.$test_result
}
Function.prototype.__eq__=function(other){
if(typeof other !=='function'){return False}
return other+''===this+''
}
Function.prototype.__class__=Function
Function.prototype.get_name=function(){
var src=this.toString()
pattern=new RegExp("function (.*?)\\(")
var res=pattern.exec(src)
value='<function '+res[1]+'>'
}
Array.prototype.match=function(other){
var $i=0
while($i<this.length && $i<other.length){
if(this[$i]!==other[$i]){return false}
$i++
}
return true
}
if(!Array.indexOf){
Array.prototype.indexOf=function(obj){
for(var i=0;i<this.length;i++){
if(this[i]==obj){
return i 
}
}
return -1 
}
}
try{console}
catch(err){
console={'log':function(data){alert(data)}}
}
function $List2Dict(){
var res={}
var i=0
if(arguments.length==1 && arguments[0].constructor==Array){
for(i=0;i<arguments[0].length;i++){
res[arguments[0][i]]=0
}
}else{
for(i=0;i<arguments.length;i++){
res[arguments[i]]=0
}
}
return res
}
function $last(item){
if(typeof item=="string"){return item.charAt(item.length-1)}
else if(typeof item=="object"){return item[item.length-1]}
}
function Atom(stack){
this.parent=stack
this.type=null
this.stack=function(){
return new Stack(this.parent.list.slice(this.start,this.end+1))
}
this.list=function(){
return this.parent.list.slice(this.start,this.end+1)
}
this.to_js=function(){return this.stack().to_js()}
}
function Stack(stack_list){
this.list=stack_list
}
Stack.prototype.find_next=function(){
var pos=arguments[0]
var _type=arguments[1]
var values=null
if(arguments.length>2){
values={}
for(i=2;i<arguments.length;i++){values[arguments[i]]=0}
}
for(i=pos;i<this.list.length;i++){
if(this.list[i][0]===_type){
if(values===null){
return i
}else if(this.list[i][1]in values){
return i
}
}
}
return null
}
Stack.prototype.find_next_at_same_level=function(){
var pos=arguments[0]
var _type=arguments[1]
var values=null
if(arguments.length>2){
values={}
for(i=2;i<arguments.length;i++){values[arguments[i]]=0}
}
while(true){
if(this.list[pos][0]==_type){
if(values==null){return pos}
else if(this.list[pos][1]in values){return pos}
}else if(this.list[pos][0]=="bracket"){
if(this.list[pos][1]in $OpeningBrackets){
pos=this.find_next_matching(pos)
}else if(this.list[pos][1]in $ClosingBrackets){
return null
}
}
pos++
if(pos>this.list.length-1){return null}
}
}
Stack.prototype.find_previous=function(){
var pos=arguments[0]
var _type=arguments[1]
var values=null
if(arguments.length>2){
values={}
for(i=2;i<arguments.length;i++){values[arguments[i]]=0}
}
for(i=pos;i>=0;i--){
if(this.list[i][0]==_type){
if(values==null){
return i
}else if(this.list[i][1]in values){
return i
}
}
}
return null
}
Stack.prototype.find_next_matching=function(pos){
var brackets={"(":")","[":"]","{":"}"}
var _item=this.list[pos]
if(_item[0]=="bracket"){
opening=_item[1]
count=0
for(i=pos;i<this.list.length;i++){
if(this.list[i][0]=="bracket"){
var value=this.list[i][1]
if(value==opening){count +=1}
else if(value==brackets[opening]){
count -=1
if(count==0){return i}
}
}
}
}
return null
}
Stack.prototype.find_previous_matching=function(pos){
var brackets={")":"(","]":"[","}":"{"}
var item=this.list[pos]
var i=0
if(item[0]=="bracket"){
closing=item[1]
count=0
for(i=pos;i>=0;i--){
if(this.list[i][0]=="bracket"){
var value=this.list[i][1]
if(value==closing){count +=1;}
else if(value==brackets[closing]){
count -=1
if(count==0){return i}
}
}
}
}
return null
}
Stack.prototype.get_atoms=function(){
var pos=0
var nb=0
var atoms=[]
while(pos<this.list.length){
atom=this.atom_at(pos,true)
atoms.push(atom)
pos +=atom.end-atom.start
}
return atoms
}
Stack.prototype.raw_atom_at=function(pos){
atom=new Atom(this)
atom.valid_type=true
atom.start=pos
if(pos>this.list.length-1){
atom.valid_type=false
atom.end=pos
return atom
}
var dict1=$List2Dict('id','assign_id','str','int','float')
var $valid_kws=$List2Dict("True","False","None")
if(this.list[pos][0]in dict1 || 
(this.list[pos][0]=="keyword" && this.list[pos][1]in $valid_kws)||
(this.list[pos][0]=="bracket" && 
(this.list[pos][1]=="(" || this.list[pos][1]=='['))){
atom.type=this.list[pos][0]
end=pos
if(this.list[pos][0]=='bracket'){
atom.type="tuple"
end=this.find_next_matching(pos)
}
while(end<this.list.length-1){
var item=this.list[end+1]
if(item[0]in dict1 && atom.type=="qualified_id"){
end +=1
}else if(item[0]=="point"||item[0]=="qualifier"){
atom.type="qualified_id"
end +=1
}else if(item[0]=="bracket" && item[1]=='('){
atom.type="function_call"
end=this.find_next_matching(end+1)
}else if(item[0]=="bracket" && item[1]=='['){
atom.type="slicing"
end=this.find_next_matching(end+1)
}else{
break
}
}
atom.end=end
return atom
}else if(this.list[pos][0]=="bracket" && 
(this.list[pos][1]=="(" || this.list[pos][1]=='[')){
atom.type="tuple"
atom.end=this.find_next_matching(pos)
return atom
}else{
atom.type=this.list[pos][0]
atom.valid_type=false
atom.end=pos
return atom
}
}
Stack.prototype.tuple_at=function(pos){
var first=this.raw_atom_at(pos)
var items=[first]
while(true){
var last=items[items.length-1]
if(last.end+1>=this.list.length){break}
var delim=this.list[last.end+1]
if(delim[0]=='delimiter' && delim[1]==','){
var next=this.raw_atom_at(last.end+2)
if(next !==null && next.valid_type){items.push(next)}
else{break}
}else{break}
}
return items
}
Stack.prototype.atom_at=function(pos,implicit_tuple){
if(!implicit_tuple){return this.raw_atom_at(pos)}
else{
var items=this.tuple_at(pos)
atom=new Atom(this)
if(items.length==1){return items[0]}
else{
atom.type="tuple"
atom.start=items[0].start
atom.end=items[items.length-1].end
return atom
}
}
}
Stack.prototype.atom_before=function(pos,implicit_tuple){
atom=new Atom(this)
if(pos==0){return null}
atom.end=pos-1
atom.start=pos-1
var atom_parts=$List2Dict("id","assign_id","str",'int','float',"point","qualifier")
var $valid_kws=$List2Dict("True","False","None")
var closing=$List2Dict(')',']')
while(true){
if(atom.start==-1){break}
var item=this.list[atom.start]
if(item[0]in atom_parts){atom.start--;continue}
else if(item[0]=="keyword" && item[1]in $valid_kws){
atom.start--;continue
}
else if(item[0]=="bracket" && item[1]in closing){
atom.start=this.find_previous_matching(atom.start)-1
continue
}
else if(implicit_tuple && item[0]=="delimiter"
&& item[1]==","){atom.start--;continue}
break
}
atom.start++
return this.atom_at(atom.start,implicit_tuple)
}
Stack.prototype.indent=function(pos){
var ipos=this.find_previous(pos,"indent")
return this.list[ipos][1]
}
Stack.prototype.line_end=function(pos){
var nl=this.find_next(pos,"newline")
if(nl==null){nl=this.list.length}
return nl
}
Stack.prototype.line_start=function(pos){
var nl=this.find_previous(pos,"newline")
if(nl==null){return 0}
return nl+1 
}
Stack.prototype.next_at_same_indent=function(pos){
var indent=this.indent(pos)
var nxt_pos=this.find_next(pos,"newline")
while(true){
if(nxt_pos===null){return null}
if(nxt_pos>=this.list.length-1){return null}
else if(this.list[nxt_pos+1][0]=="indent"){
var nxt_indent=this.list[nxt_pos+1][1]
nxt_pos++
}else{var nxt_indent=0}
if(nxt_indent==indent){return nxt_pos+1}
else if(nxt_indent<indent){return null}
nxt_pos=this.find_next(nxt_pos+1,"newline")
}
}
Stack.prototype.split=function(delimiter){
var items=new Array(), count=0,pos=0,start=0
while(pos<this.list.length){
pos=this.find_next_at_same_level(pos,'delimiter',delimiter)
if(pos==null){pos=this.list.length;break}
var s=new Stack(this.list.slice(start,pos))
s.start=start
s.end=pos-1
items.push(s)
start=pos+1
pos++
}
var s=new Stack(this.list.slice(start,pos))
s.start=start
s.end=pos-1
if(s.end<start){s.end=start}
items.push(s)
return items
}
Stack.prototype.find_block=function(pos){
var item=this.list[pos]
var closing_pos=this.find_next_at_same_level(pos+1,'delimiter',':')
if(closing_pos!=null){
var kw_indent=this.indent(pos)
var stop=closing_pos
while(true){
nl=this.find_next(stop,"newline")
if(nl==null){stop=this.list.length-1;break}
if(nl<this.list.length-1){
if(this.list[nl+1][0]=="indent"){
if(this.list[nl+1][1]<=kw_indent){
stop=nl
break
}
}else{
stop=nl
break
}
}else{
stop=this.list.length-1
break
}
stop=nl+1
}
return[closing_pos,stop,kw_indent]
}else{return null}
}
Stack.prototype.to_js=function(){
var i=0,j=0,x=null
var js="",scope_stack=[]
var t2=$List2Dict('id','assign_id','str','int','float','keyword','code')
for(i=0;i<this.list.length;i++){
x=this.list[i]
if(x[0]=="indent"){
for(j=0;j<x[1];j++){js +=" "}
}else if(x[0]in t2){
if(x[0]=='int'){js +='Number('+x[1]+')'}
else if(x[0]==='float'){js +='float('+x[1]+')'}
else if(x[0]==='str'){js+=x[1].replace(/\n/gm,'\\n')}
else{js +=x[1]}
if(i<this.list.length-1 && this.list[i+1][0]!="bracket"
&& this.list[i+1][0]!="point" && this.list[i+1][0]!="delimiter"){
js +=" "
}
}else{
if(x[0]=="newline"){js +='\r\n'}
else{js +=x[1]}
}
}
return js
}
Stack.prototype.dump=function(){
ch=''
for(var i=0;i<this.list.length;i++){
_item=this.list[i]
ch +=i+' '+_item[0]+' '+_item[1]+'\n'
}
alert(ch)
}
function $XmlHttpClass(obj){
this.__class__='XMLHttpRequest'
this.__getattr__=function(attr){
if('get_'+attr in this){return this['get_'+attr]()}
else{return getattr(obj,attr)}
}
this.get_text=function(){return str(obj.responseText)}
this.get_xml=function(){alert(obj.responseXML);return $DomElement(obj.responseXML)}
}
function $AjaxClass(){
if(window.XMLHttpRequest){
var $xmlhttp=new XMLHttpRequest()
}else{
var $xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
}
$xmlhttp.$ajax=this
$xmlhttp.$requestTimer=null
$xmlhttp.onreadystatechange=function(){
var state=this.readyState
var req=this.$ajax
var timer=this.$requestTimer
var obj=new $XmlHttpClass($xmlhttp)
if(state===0 && 'on_uninitialized' in req){req.on_uninitialized(obj)}
else if(state===1 && 'on_loading' in req){req.on_loading(obj)}
else if(state===2 && 'on_loaded' in req){req.on_loaded(obj)}
else if(state===3 && 'on_interactive' in req){req.on_interactive(obj)}
else if(state===4 && 'on_complete' in req){
if(timer !==null){window.clearTimeout(timer)}
req.on_complete(obj)
}
}
this.__getattr__=function(attr){return getattr(this,attr)}
this.__setattr__=function(attr,value){setattr(this,attr,value)}
this.open=function(method,url,async){
$xmlhttp.open(method,url,async)
}
this.set_header=function(key,value){
$xmlhttp.setRequestHeader(key,value)
}
this.send=function(params){
if(!params || params.$keys.length==0){$xmlhttp.send();return}
if(!isinstance(params,dict)){$raise('TypeError',
"send() argument must be dictonary, not '"+str(params.__class__)+"'")}
var res=''
for(i=0;i<params.$keys.length;i++){
res +=str(params.$keys[i])+'='+str(params.$values[i])+'&'
}
res=res.substr(0,res.length-1)
$xmlhttp.send(res)
}
this.set_timeout=function(seconds,func){
$xmlhttp.$requestTimer=setTimeout(
function(){$xmlhttp.abort();func()}, 
seconds*1000)
}
}
function ajax(){
return new $AjaxClass()
}
function $getMouseOffset(target, ev){
ev=ev || window.event
var docPos=$getPosition(target)
var mousePos=$mouseCoords(ev)
return{x:mousePos.x - docPos.x, y:mousePos.y - docPos.y}
}
function $getPosition(e){
var left=0
var top=0
var width=e.offsetWidth
var height=e.offsetHeight
while(e.offsetParent){
left +=e.offsetLeft
top +=e.offsetTop
e=e.offsetParent
}
left +=e.offsetLeft
top +=e.offsetTop
return{left:left, top:top, width:width, height:height}
}
function $mouseCoords(ev){
var posx=0
var posy=0
if(!ev)var ev=window.event
if(ev.pageX || ev.pageY){
posx=ev.pageX
posy=ev.pageY
}else if(ev.clientX || ev.clientY){
posx=ev.clientX + document.body.scrollLeft
+ document.documentElement.scrollLeft
posy=ev.clientY + document.body.scrollTop
+ document.documentElement.scrollTop
}
var res=object()
res.x=int(posx)
res.y=int(posy)
res.__getattr__=function(attr){return this[attr]}
res.__class__="MouseCoords"
return res
}
function $MouseEvent(ev){
this.event=ev
this.__class__="MouseEvent"
}
$MouseEvent.prototype.__getattr__=function(attr){
if(attr=="x"){return $mouseCoords(this.event).x}
if(attr=="y"){return $mouseCoords(this.event).y}
if(attr=="data"){return new $Clipboard(this.event.dataTransfer)}
return getattr(this.event,attr)
}
function $DomWrapper(js_dom){
this.value=js_dom
this.__class__="$DomWrapper"
}
$DomWrapper.prototype.__getattr__=function(attr){
if(attr in this.value){
var obj=this.value,obj_attr=this.value[attr]
if(typeof this.value[attr]=='function'){
return function(){
var args=[]
for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
var res=obj_attr.apply(obj,args)
if(typeof res=='object'){return new $DomWrapper(res)}
else if(res===undefined){return None}
else{return $JS2Py(res)}
}
}else{
return $JS2Py(this.value[attr])
}
}else{
$raise('AttributeError','object has no attribute '+attr)
}
}
$DomWrapper.prototype.__setattr__=function(attr,value){
if(isinstance(value,"$DomWrapper")){
this.value[attr]=value.value
}else{
this.value[attr]=value
}
}
function $Clipboard(data){
this.data=data
this.__class__="Clipboard"
}
$Clipboard.prototype.__getitem__=function(name){
return this.data.getData(name)
}
$Clipboard.prototype.__setitem__=function(name,value){
this.data.setData(name,value)
}
$Clipboard.prototype.__setattr__=function(attr,value){
eval("this.data."+attr+"=value")
}
function $DomObject(obj){
this.obj=obj
this.type=obj.constructor.toString()
}
$DomObject.prototype.__getattr__=function(attr){
return getattr(this.obj,attr)
}
function $OptionsClass(parent){
this.parent=parent
this.__getattr__=function(attr){
if('get_'+attr in this){return eval('this.get_'+attr)}
if(attr in this.parent.elt.options){
var obj=eval('this.parent.elt.options.'+attr)
if((typeof obj)=='function'){
$raise('AttributeError',"'options' object has no attribute '"+attr+'"')
}
return $JS2Py(obj)
}
}
this.__class__='options'
this.__getitem__=function(arg){
return $DomElement(parent.elt.options[arg])
}
this.__delitem__=function(arg){
parent.elt.options.remove(arg)
}
this.__len__=function(){return parent.elt.options.length}
this.__setattr__=function(attr,value){
eval('parent.elt.options.'+attr+'= str(value)')
}
this.__setitem__=function(attr,value){
parent.elt.options[attr]=$JS2Py(value)
}
this.get_append=function(element){
parent.elt.options.add(element.elt)
}
this.get_insert=function(index,element){
if(index===undefined){parent.elt.options.add(element.elt)}
else{parent.elt.options.add(element.elt,index)}
}
this.get_item=function(index){
return $DomElement(parent.elt.options.item(index))
}
this.get_namedItem=function(name){
return $DomElement(parent.elt.options.namedItem(name))
}
this.get_remove=function(arg){parent.elt.options.remove(arg)}
}
function $Document(){
this.elt=document
this.mouse=null
this.__delitem__=function(key){
if(typeof key==="string"){
var res=document.getElementById(key)
if(res){res.parentNode.removeChild(res)}
else{$raise("KeyError",key)}
}else{
try{
var elts=document.getElementsByTagName(key),res=list()
for(var $i=0;$i<elts.length;$i++){res.append($DomElement(elts[$i]))}
return res
}catch(err){
$raise("KeyError",key)
}
}
}
this.__getattr__=function(attr){return getattr(this.elt,attr)}
this.__getitem__=function(key){
if(typeof key==="string"){
var res=document.getElementById(key)
if(res){return $DomElement(res)}
else{$raise("KeyError",key)}
}else{
try{
var elts=document.getElementsByTagName(key.name),res=[]
for(var $i=0;$i<elts.length;$i++){res.push($DomElement(elts[$i]))}
return res
}catch(err){
$raise("KeyError",str(key))
}
}
}
this.__le__=function(other){
if(isinstance(other,$AbstractTag)){
var $i=0
for($i=0;$i<other.children.length;$i++){
document.body.appendChild(other.children[$i])
}
}else if(isinstance(other,[str,int,float,list,dict,set,tuple])){
txt=document.createTextNode(str(other))
document.body.appendChild(txt)
}else{document.body.appendChild(other.elt)}
}
this.__setattr__=function(attr,value){
if(attr in $events){document.addEventListener(attr.substr(2),value)}
else{document[attr]=value}
}
this.insert_before=function(other,ref_elt){
document.insertBefore(other.elt,ref_elt.elt)
}
}
doc=new $Document()
win={
__getattr__ : function(attr){return getattr(window,attr)},
location:{__getattr__:function(attr){return getattr(window.location,attr)}}
}
function $DomElement(elt){
var i=null
var elt_name=elt.tagName
if(elt_name===undefined && elt.nodeName=="#text"){
return str(elt.data)
}
var obj=new $TagClass()
if(elt_name===undefined && elt.nodeName=="#document"){
obj.__class__=$Document
}else if($tags.indexOf(elt_name.toUpperCase())>-1){
obj.__class__=eval(elt_name.toUpperCase())
}else if($svg_tags.indexOf(elt_name)>-1){
obj.__class__=eval('SVG.'+elt_name)
}
obj.elt=elt
return obj
}
function $AbstractTagClass(){
this.__class__=$AbstractTag
this._class_name='abstract'
this.children=[]
}
$AbstractTagClass.prototype.appendChild=function(child){
this.children.push(child)
}
$AbstractTagClass.prototype.__add__=function(other){
if(isinstance(other,$AbstractTag)){
this.children=this.children.concat(other.children)
}else if(isinstance(other,str)){
this.children=this.children.concat(document.createTextNode(other))
}else{this.children.push(other.elt)}
return this
}
$AbstractTagClass.prototype.__radd__=function(other){
var res=$AbstractTag()
res.children=this.children.concat(document.createTextNode(other))
return res
}
$AbstractTagClass.prototype.clone=function(){
var res=$AbstractTag(), $i=0
for($i=0;$i<this.children.length;$i++){
res.children.push(this.children[$i].cloneNode(true))
}
return res
}
function $AbstractTag(){
return new $AbstractTagClass()
}
$events=$List2Dict('onabort','onactivate','onafterprint','onafterupdate',
'onbeforeactivate','onbeforecopy','onbeforecut','onbeforedeactivate',
'onbeforeeditfocus','onbeforepaste','onbeforeprint','onbeforeunload',
'onbeforeupdate','onblur','onbounce','oncellchange','onchange','onclick',
'oncontextmenu','oncontrolselect','oncopy','oncut','ondataavailable',
'ondatasetchanged','ondatasetcomplete','ondblclick','ondeactivate','ondrag',
'ondragend','ondragenter','ondragleave','ondragover','ondragstart','ondrop',
'onerror','onerrorupdate','onfilterchange','onfinish','onfocus','onfocusin',
'onfocusout','onhashchange','onhelp','oninput','onkeydown','onkeypress',
'onkeyup','onload','onlosecapture','onmessage','onmousedown','onmouseenter',
'onmouseleave','onmousemove','onmouseout','onmouseover','onmouseup',
'onmousewheel','onmove','onmoveend','onmovestart','onoffline','ononline',
'onpaste','onpropertychange','onreadystatechange','onreset','onresize',
'onresizeend','onresizestart','onrowenter','onrowexit','onrowsdelete',
'onrowsinserted','onscroll','onsearch','onselect','onselectionchange',
'onselectstart','onstart','onstop','onsubmit','onunload',
'ontouchstart','ontouchmove','ontouchend'
)
function $TagClass(class_name,args){
var $i=null
var $obj=this
if(class_name!==undefined){
this.name=class_name
eval("this.__class__ ="+class_name)
this.elt=document.createElement(this.name)
this.elt.parent=this
}
if(args!=undefined && args.length>0){
$start=0
$first=args[0]
if(!isinstance($first,$Kw)){
$start=1
if(isinstance($first,[str,int,float])){
txt=document.createTextNode($first.toString())
this.elt.appendChild(txt)
}else if(isinstance($first,$AbstractTag)){
for($i=0;$i<$first.children.length;$i++){
this.elt.appendChild($first.children[$i])
}
}else{
try{this.elt.appendChild($first.elt)}
catch(err){$raise('ValueError','wrong element '+$first.elt)}
}
}
for($i=$start;$i<args.length;$i++){
$arg=args[$i]
if(isinstance($arg,$Kw)){
if($arg.name.toLowerCase()in $events){
eval('this.elt.'+$arg.name.toLowerCase()+'=function(){'+$arg.value+'}')
}else if($arg.name.toLowerCase()=="style"){
this.set_style($arg.value)
}else{
if($arg.value!==false){
this.elt.setAttribute($arg.name.toLowerCase(),$arg.value)
}
}
}
}
}
if('elt' in this && !this.elt.getAttribute('id')){
this.elt.setAttribute('id',Math.random().toString(36).substr(2, 8))
}
}
$TagClass.prototype.__add__=function(other){
var res=$AbstractTag()
res.children=[this.elt]
if(isinstance(other,$AbstractTag)){
for(var $i=0;$i<other.children.length;$i++){res.children.push(other.children[$i])}
}else if(isinstance(other,[str,int,float,list,dict,set,tuple])){
res.children.push(document.createTextNode(str(other)))
}else{res.children.push(other.elt)}
return res
}
$TagClass.prototype.__eq__=function(other){
if(!('getAttribute' in other.elt)){return False}
return this.elt.getAttribute('id')==other.elt.getAttribute('id')
}
$TagClass.prototype.__getattr__=function(attr){
if('get_'+attr in this){return this['get_'+attr]()}
return getattr(this.elt,attr)
}
$TagClass.prototype.__getitem__=function(key){
return $DomElement(this.elt.childNodes[key.value])
}
$TagClass.prototype.__le__=function(other){
if(isinstance(other,$AbstractTag)){
var $i=0
for($i=0;$i<other.children.length;$i++){
this.elt.appendChild(other.children[$i])
}
}else if(typeof other==="string" || typeof other==="number"){
var $txt=document.createTextNode(other.toString())
this.elt.appendChild($txt)
}else{
this.elt.appendChild(other.elt)
}
}
$TagClass.prototype.__ne__=function(other){return $not(this.__eq__(other))}
$TagClass.prototype.__radd__=function(other){
var res=$AbstractTag()
var txt=document.createTextNode(other)
res.children=[txt,this.elt]
return res 
}
$TagClass.prototype.__setattr__=function(attr,value){
if(attr in $events){this.elt.addEventListener(attr.substr(2),value)}
else if('set_'+attr in this){return this['set_'+attr](value)}
else if(attr in this.elt){this.elt[attr]=value}
else{$setattr(this,attr,value)}
}
$TagClass.prototype.__setitem__=function(key,value){
this.elt.childNodes[key.value]=value
}
$TagClass.prototype.get_clone=function(){
res=new $TagClass(this.name)
res.elt=this.elt.cloneNode(true)
for(var evt in $events){
if(this.elt[evt]){res.elt[evt]=this.elt[evt]}
}
var func=function(){return res}
return func
}
$TagClass.prototype.get_getContext=function(){
if(!('getContext' in this.elt)){$raise('AttributeError',
"object has no attribute 'getContext'")}
var obj=this.elt
return function(ctx){return new $DomWrapper(obj.getContext(ctx))}
}
$TagClass.prototype.get_parent=function(){
if(this.elt.parentElement){return $DomElement(this.elt.parentElement)}
else{return None}
}
$TagClass.prototype.get_options=function(){
return new $OptionsClass(this)
}
$TagClass.prototype.get_left=function(){
return int($getPosition(this.elt)["left"])
}
$TagClass.prototype.get_top=function(){
return int($getPosition(this.elt)["top"])
}
$TagClass.prototype.get_children=function(){
var res=[]
for(var i=0;i<this.elt.childNodes.length;i++){
res.push($DomElement(this.elt.childNodes[i]))
}
return res
}
$TagClass.prototype.get_reset=function(){
var $obj=this.elt
return function(){$obj.reset()}
}
$TagClass.prototype.get_style=function(){
return new $DomWrapper(this.elt.style)
}
$TagClass.prototype.set_style=function(style){
for(var i=0;i<style.$keys.length;i++){
this.elt.style[str(style.$keys[i])]=style.$values[i]
}
}
$TagClass.prototype.get_submit=function(){
var $obj=this.elt
return function(){$obj.submit()}
}
$TagClass.prototype.get_text=function(){
return str(this.elt.innerText || this.elt.textContent)
}
$TagClass.prototype.get_html=function(){return this.elt.innerHTML}
$TagClass.prototype.get_value=function(value){return this.elt.value}
$TagClass.prototype.set_html=function(value){this.elt.innerHTML=str(value)}
$TagClass.prototype.set_text=function(value){
this.elt.innerText=str(value)
this.elt.textContent=str(value)
}
$TagClass.prototype.set_value=function(value){this.elt.value=value.toString()}
function A(){return new $TagClass('A',arguments)}
var $src=A+'' 
$tags=['A', 'ABBR', 'ACRONYM', 'ADDRESS', 'APPLET',
'B', 'BDO', 'BIG', 'BLOCKQUOTE', 'BUTTON',
'CAPTION', 'CENTER', 'CITE', 'CODE',
'DEL', 'DFN', 'DIR', 'DIV', 'DL',
'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAMESET',
'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
'I', 'IFRAME', 'INS', 'KBD', 'LABEL', 'LEGEND',
'MAP', 'MENU', 'NOFRAMES', 'NOSCRIPT', 'OBJECT',
'OL', 'OPTGROUP', 'PRE', 'Q', 'S', 'SAMP',
'SCRIPT', 'SELECT', 'SMALL', 'SPAN', 'STRIKE',
'STRONG', 'STYLE', 'SUB', 'SUP', 'TABLE',
'TEXTAREA', 'TITLE', 'TT', 'U', 'UL',
'VAR', 'BODY', 'COLGROUP', 'DD', 'DT', 'HEAD',
'HTML', 'LI', 'P', 'TBODY','OPTION', 
'TD', 'TFOOT', 'TH', 'THEAD', 'TR',
'AREA', 'BASE', 'BASEFONT', 'BR', 'COL', 'FRAME',
'HR', 'IMG', 'INPUT', 'ISINDEX', 'LINK',
'META', 'PARAM']
$tags=$tags.concat(['ARTICLE','ASIDE','FIGURE','FOOTER','HEADER','NAV',
'SECTION','AUDIO','VIDEO','CANVAS','COMMAND','DATALIST',
'DETAILS','OUTPUT','PROGRESS','HGROUP','MARK','METER','TIME',
'RP','RT','RUBY'])
for($i=0;$i<$tags.length;$i++){
$code=$src.replace(/A/gm,$tags[$i])
eval($code)
}
SVG={
__getattr__:function(attr){return this[attr]}
}
$svgNS="http://www.w3.org/2000/svg"
$xlinkNS="http://www.w3.org/1999/xlink"
function $SVGTagClass(tag_name,args){
var $i=null
var $obj=this
if(tag_name!==undefined){
this.name=tag_name
this.__class__=SVG
this.elt=document.createElementNS($svgNS,this.name)
this.elt.parent=this
}
if(args!=undefined && args.length>0){
$start=0
$first=args[0]
if(!isinstance($first,$Kw)){
$start=1
if(isinstance($first,str)){
txt=document.createTextNode($first.value)
this.elt.appendChild(txt)
}else if(isinstance($first,int)|| isinstance($first,float)){
txt=document.createTextNode($first.value.toString())
this.elt.appendChild(txt)
}else if(isinstance($first,$AbstractTag)){
for($i=0;$i<$first.children.length;$i++){
this.elt.appendChild($first.children[$i])
}
}else{
try{this.elt.appendChild($first.elt)}
catch(err){$raise('ValueError','wrong element '+$first.elt)}
}
}
for($i=$start;$i<args.length;$i++){
$arg=args[$i]
if(isinstance($arg,$Kw)){
if($arg.name.toLowerCase()in $events){
eval('this.elt.'+$arg.name.toLowerCase()+'=function(){'+$arg.value.value+'}')
}else if($arg.name.toLowerCase()=="style"){
this.set_style($arg.value)
}else{
if($arg.value.value!==false){
this.elt.setAttributeNS(null,$arg.name.replace('_','-'),$arg.value.value)
}
}
}
}
}
if('elt' in this && !this.elt.getAttribute('id')){
this.elt.setAttribute('id',Math.random().toString(36).substr(2, 8))
}
}
$SVGTagClass.prototype.__add__=$TagClass.prototype.__add__
$SVGTagClass.prototype.__eq__=$TagClass.prototype.__eq__
$SVGTagClass.prototype.__getattr__=$TagClass.prototype.__getattr__
$SVGTagClass.prototype.__getitem__=$TagClass.prototype.__getitem__
$SVGTagClass.prototype.__iadd__=$TagClass.prototype.__iadd__
$SVGTagClass.prototype.__le__=$TagClass.prototype.__le__
$SVGTagClass.prototype.__ne__=$TagClass.prototype.__ne__
$SVGTagClass.prototype.__radd__=$TagClass.prototype.__radd__
$SVGTagClass.prototype.__setattr__=function(key,value){
if(key=="href"){
this.elt.setAttributeNS($xlinkNS,key.replace('_','-'),value.value)
}else{
this.elt.setAttributeNS(null,key.replace('_','-'),value.value)
}
}
$SVGTagClass.prototype.__setitem__=$TagClass.prototype.__setitem__
var $svg_tags=['a',
'altGlyph',
'altGlyphDef',
'altGlyphItem',
'animate',
'animateColor',
'animateMotion',
'animateTransform',
'circle',
'clipPath',
'color_profile', 
'cursor',
'defs',
'desc',
'ellipse',
'feBlend',
'g',
'image',
'line',
'linearGradient',
'marker',
'mask',
'path',
'pattern',
'polygon',
'polyline',
'radialGradient',
'rect',
'stop',
'svg',
'text',
'tref',
'tspan',
'use']
$svg=function(){return new $SVGTagClass('X',arguments)}
$svg +='' 
for(var i=0;i<$svg_tags.length;i++){
var tag=$svg_tags[i]
eval('SVG.'+tag+'='+$svg.replace('X',tag))
}
function $LocalStorageClass(){
this.__class__='localStorage'
this.supported=typeof(Storage)!=="undefined"
this.__delitem__=function(key){
if(this.supported){localStorage.removeItem(key)}
else{$raise('NameError',"local storage is not supported by this browser")}
}
this.__getitem__=function(key){
if(this.supported){
res=localStorage[key]
if(res===undefined){return None}
else{return $JS2Py(res)}
}
else{$raise('NameError',"local storage is not supported by this browser")}
}
this.__setitem__=function(key,value){
if(this.supported){localStorage[key]=value}
else{$raise('NameError',"local storage is not supported by this browser")}
}
}
local_storage=new $LocalStorageClass()
