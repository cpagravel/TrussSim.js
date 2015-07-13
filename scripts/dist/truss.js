(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Controlls the current mode
var mode='move'; //starts up as the defualt node

$('#eraser-button').on('click',function(){
	mode='erase';
	console.log(mode);
});

$('#move-button').on('click',function(){
	mode='move';
	console.log(mode);
});

$('#add-member-button').on('click',function(){
	mode='add_member';
	console.log(mode);
});

$('#add-node-button').on('click',function(){
	mode='add_node';
	console.log(mode);
});

module.exports.mode=mode;

},{}],2:[function(require,module,exports){
function Node(left, top,canv){
	this.circle = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666',
      selectable: true
    });


    this.circle.hasControls = this.circle.hasBorders = false;
    this.circle.connected_members=[];

    if(canv){
		Node.canvas=canv;
		Node.canvas.add(this.circle);
	}

    return this;
}
Node.prototype.addMember=function(x1,y1,x2,y2){
	var line=new fabric.Line([this.circle.left,this.circle.top,x1,y1],{
	  fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false
	});

	this.circle.connected_members.push(line);
	Node.canvas.add(line);
};
module.exports=Node;
},{}],3:[function(require,module,exports){
module.exports=function createGrid(canvas,grid_size){
	//create the harizontal lines of the grid
  for(i=0;i<canvas.width;i+=grid_size){
    canvas.add(new fabric.Line([i,0,i,canvas.height*2],{ 
      stroke: '#ccc', 
      selectable: false
    }));
  }

  //create the vertical lines of the grid
  for(i=0;i<canvas.height;i+=grid_size){
    canvas.add(new fabric.Line([0,i,canvas.width*2,i],{ 
      stroke: '#ccc', 
      selectable: false
    }));
  }
};
},{}],4:[function(require,module,exports){
  var createGrid=require('./createGrid');
  var ModeController=require('./ModeController');

  var Node=require('./Node');
  var grid_size = 50;//pixels per square
  var mode='move';
  var canvas = new fabric.Canvas('truss-canvas', { 
    selection: true 
  });


  //Resizes the canvas to the window's full width
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.setHeight($(window).height()-120);
    canvas.setWidth(window.innerWidth-2);
    canvas.renderAll();
  }

  // resize on init
  resizeCanvas();

  createGrid(canvas,grid_size);

  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

  var node=new Node(50,50,canvas);
  node.addMember(5,6,8,11);
 
  // function makeCircle(left, top, line1, line2, line3, line4) {
  //   var c = new fabric.Circle({
  //     left: left,
  //     top: top,
  //     strokeWidth: 5,
  //     radius: 12,
  //     fill: '#fff',
  //     stroke: '#666',
  //     selectable: true
  //   });
  //   c.hasControls = c.hasBorders = false;

  //   c.line1 = line1;
  //   c.line2 = line2;
  //   c.line3 = line3;
  //   c.line4 = line4;

  //   return c;
  // }

  // function makeLine(coords) {
  //   return new fabric.Line(coords, {
  //     fill: 'red',
  //     stroke: 'blue',
  //     strokeWidth: 5,
  //     selectable: false
  //   });
  // }

  // var line = makeLine([ 250, 125, 250, 175 ]),
  //     line2 = makeLine([ 250, 175, 250, 250 ]),
  //     line3 = makeLine([ 250, 250, 300, 350]),
  //     line4 = makeLine([ 250, 250, 200, 350]),
  //     line5 = makeLine([ 250, 175, 175, 225 ]),
  //     line6 = makeLine([ 250, 175, 325, 225 ]);

  // canvas.add(line, line2, line3, line4, line5, line6);
  // canvas.add(Node(5,5));
  // canvas.add(
  //   makeCircle(line.get('x1'), line.get('y1'), null, line),
  //   makeCircle(line.get('x2'), line.get('y2'), line, line2, line5, line6),
  //   makeCircle(line2.get('x2'), line2.get('y2'), line2, line3, line4),
  //   makeCircle(line3.get('x2'), line3.get('y2'), line3),
  //   makeCircle(line4.get('x2'), line4.get('y2'), line4),
  //   makeCircle(line5.get('x2'), line5.get('y2'), line5),
  //   makeCircle(line6.get('x2'), line6.get('y2'), line6)
  // );
  canvas.on('object:moving', function(e) {
    var target = e.target;
    
    if(target.type==='circle'){
    	for (var i=0;i<target.connected_members.length;i++){
    		target.connected_members[i].set({'x1':target.left,'y1':target.top});
    	} 
    }
    // if(p.line1){
    // 	p.line1.set({ 'x2': p.left, 'y2': p.top });
    // }
    // if(p.line2){
    // 	p.line2.set({ 'x1': p.left, 'y1': p.top });
    // }
    // if(p.line3){
    // 	p.line3.set({ 'x1': p.left, 'y1': p.top });
    // }
    // if(p.line4){
    // 	p.line4.set({ 'x1': p.left, 'y1': p.top });
    // }
    canvas.renderAll();
  });

  function startSimulation(){
    return false;
  }
},{"./ModeController":1,"./Node":2,"./createGrid":3}]},{},[4]);
