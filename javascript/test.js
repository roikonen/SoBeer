var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
        id: "1",
        name: "Beer",
        children: [{
        	id: "1_1",
        	name: "Ale",
        	children: [{
        		id: "1_1_1",
        		name: "Lambic",
        		children: [],
        		data: {type: "category"}
    		},
		{
        		id: "1_1_2",
        		name: "Pale Ale",
        		children: [],
        		data: {type: "category"}
    		},
		{
        		id: "1_1_3",
        		name: "Stout / Porter",
        		children: [{
        			id: "1_2_3",
        			name: "Baltic Porter",
        			children: [{
        				id: "1_2_3_1",
        				name: "Koff Porter",
        				children: [],
        				data: {type: "brand"}
    				}],
        			data: {type: "category"}
    			}],
        		data: {type: "category"}
    		}],
        	data: {type: "category"}
    	},
	{
        	id: "1_2",
        	name: "Lager",
        	children: [
		{
        		id: "1_2_1",
        		name: "Pilsner",
        		children: [],
        		data: {type: "category"}
    		},
		{
        		id: "1_2_2",
        		name: "German Lager",
        		children: [
			{
        			id: "1_2_2_1",
        			name: "Munich Lager",
        			children: [
				{
        				id: "1_2_2_1_1",
        				name: "Munich Dunkel",
        				children: [
					{
        					id: "1_2_2_1_1_1",
        					name: "Negra Modelo",
        					children: [],
        					data: {type: "brand"}
    					},
					{
        					id: "1_2_2_1_1_2",
        					name: "Warsteiner Premium Dunkel",
        					children: [],
        					data: {
							type: "brand",
							note: "Pretty damn good..."
						}
    					}],
        				data: {type: "category"}
    				},
				{
        				id: "1_2_2_1_2",
        				name: "Munich Helles",
        				children: [
					{
        					id: "1_2_2_1_2_1",
        					name: "Lövenbräu Original",
        					children: [],
        					data: {type: "brand"}
    					},
					{
        					id: "1_2_2_1_2_2",
        					name: "Mythos Hellenic Lager",
        					children: [],
        					data: {type: "brand"}
    					},
					{
        					id: "1_2_2_1_2_3",
        					name: "Weihensiephaner Original",
        					children: [],
        					data: {type: "brand"}
    					}],
        				data: {type: "category"}
    				}],
        			data: {type: "category"}
    			},
			{
        			id: "1_2_2_2",
        			name: "Bock",
        			children: [],
        			data: {
					type: "category"
				}
    			}],
        		data: {type: "category"}
    		},
		{
        		id: "1_2_3",
        		name: "Baltic Porter",
        		children: [],
        		data: {type: "category"}
    		}],
        	data: {type: "category"}
    	}],
        data: {type: "category"}
    };
    //end
    
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',

	levelDistance: 100,

        //Optional: create a background canvas that plots
        //concentric circles.
        background: {
          CanvasStyles: {
            strokeStyle: '#000',
	    lineWidth: 0  
          }
        },
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: true,
          zooming: 100
        },
        //Set Node and Edge styles.
        Node: {
            color: '#ddeeff'
        },
        
        Edge: {
          color: '#C17878',
          lineWidth:1.5
        },

        onBeforeCompute: function(node){
            Log.write("centering " + node.name + "...");
            //Add the relation list in the right column.
            //This list is taken from the data property of each JSON node.
            $jit.id('inner-details').innerHTML = node.data.note;
        },
        
        onAfterCompute: function(){
            Log.write("done");
        },
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id);
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

	    style.color = "#ccc";

            if (node._depth <= 1) {
                style.fontSize = "0.8em";
            
            } else if(node._depth == 2){
                style.fontSize = "0.7em";
            
            } else {
                style.fontSize = "0.5em";
            }

	    if (node.data.type == "brand") {
                style.color = "#ff0";
	    }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    });

    rgraph.canvas.scale(0.5, 0.5); 

    //load JSON data
    rgraph.loadJSON(json);
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    //end
    //append information about the root relations in the right column
    $jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.relation;
}