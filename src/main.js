//@program
var blackSkin = new Skin( { fill:"black" } );
var labelStyle = new Style( { font: "bold 30px", color:"white" } );
var resourceLabelStyle = new Style( { font: "bold 20px", color:"white" } );
Handler.bind("/getCount", Behavior({
	onInvoke: function(handler, message){
		count++;
		counterLabel.string = count;
		message.responseText = JSON.stringify( { count: count } );
		message.status = 200;
	}
}));

Handler.bind("/reset", Behavior({
	onInvoke: function(handler, message){
		count = 0;
		counterLabel.string = "0";
		message.responseText = JSON.stringify( { count: "0" } );
		message.status = 200;
	}
}));

Handler.bind("/takePicture", Behavior({
	onInvoke: function(handler, message){
		counterLabel.string = "picture taken";
		pictureIndex ++;
		if(pictureIndex > 4)
			pictureIndex = 2;
		message.responseText = JSON.stringify( { url: "rabbit-" + pictureIndex + ".jpg" } );
		message.status = 200;
	}
}));


Handler.bind("/gotAnalogResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
        		var result = message.requestObject;  
        		application.distribute( "onAnalogValueChanged", result ); 		
        	}}
}));

Handler.bind("/gotResourcesResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				//trace('inside gotResourcesResult!\n');
        		var result = message.requestObject; 
        		application.distribute( "onResourcesValueChanged", result ); 		
        	}}
}));

var counterLabel = new Label({left:0, right:0, height:30, string:"0", style: labelStyle});
var ResourceLabelBehavior = Behavior.template({
	
}); 

var resourceLabelTemplate = Label.template(function($) {return {editable:true,left:0, right: 0, height: 40, string: "---", style: labelStyle, 
behavior: Object.create(Behavior.prototype,{
	onCreate: { value: function(content,data){
		this.data = data;
		var self = content;
		this.update = function(result) { self.string = result.toString().substring( 0, 5 );};
		//trace('inside onCreate of ResourceLabelBehavior\n')
	}},
})
}});
	
var waterDisplay = new resourceLabelTemplate({skin: new Skin({fill: "blue"}),name: "waterDisplay"});
var pelletDisplay = new resourceLabelTemplate({skin: new Skin({fill: "red"}),name: "pelletDisplay"});
var lettuceDisplay = new resourceLabelTemplate({skin: new Skin({fill: "green"}),name: "lettuceDisplay"});
	
var MainContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blackSkin,
 						contents: [
 								new Line(({left: 0, right:0, top:0, bottom:100, name: "counterLine",
									contents:[
										new Label({left:0, right:0, height:30, string:"Counter:", style: labelStyle}),
										counterLabel
									]})),
								new Line(({left: 0, right:0, top:30, bottom:0, name: "analogLine",
									contents:[
										new Label({left:0, right:0, height:30, string:"Weight:", style: labelStyle}),
										Label($,{left:0, right:0, height: 30, string:"---", style: labelStyle,  behavior: Object.create((MainContainer.behaviors[0]).prototype)})
									]})),
								new Line(({left: 0, right:0, top:160, bottom:0, name: "ResourcesLine",
									contents:[
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Label({left:0, right:0, height:30, width: 100, string:"Water Level", style: resourceLabelStyle}),
											waterDisplay
										]})),
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Label({left:0, right:0, height:30, width: 100, string:"# Pellets", style: resourceLabelStyle}),
											pelletDisplay
										]})),
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Label({left:0, right:0, height:30, width: 100, string:"# Lettuces", style: resourceLabelStyle}),
											lettuceDisplay
										]}))
										
										
									]}))
								
								
						],
						behavior: Object.create((MainContainer.behaviors[1]).prototype),
								  
						
				 }});


MainContainer.behaviors = new Array(1);
MainContainer.behaviors[0] = Behavior.template({

	onAnalogValueChanged: function(content, result) {
		content.string = result.toString().substring( 0, 5 );
	},
})

//update resource labels and set up values
MainContainer.behaviors[1] = Behavior.template({

	onCreate: function(content, data) {
	//trace('inside MainContainer onCreate!\n');
		this.data = data;
		this.lastWaterLevel = false;
		this.lastPelletCount = false;
    	this.lastLettuceCount = false;
		
	},

	onResourcesValueChanged: function(content, data) {
		//trace('inside onResourcesValueChanged!\n');
		var threshold = .001; 
        if ( this.lastWaterLevel === false ) {
			this.lastWaterLevel = data.water;
        	this.lastPelletCount = data.pellet;
        	this.lastLettuceCount = data.lettuce;
        }
        else if ( ( Math.abs( data.water - this.lastWaterLevel ) > threshold )){
        	waterDisplay.behavior.update(data.water);
        }
       	else if ( Math.abs( data.pellet - this.lastPelletCount ) > threshold ){
       		pelletDisplay.behavior.update(data.pellet);
       	}
       	else if ( Math.abs( data.lettuce - this.lastLettuceCount ) > threshold ) {
       		lettuceDisplay.behavior.update(data.lettuce);
       	}
        this.lastWaterLevel = data.water;
    	this.lastPelletCount = data.pellet;
    	this.lastLettuceCount = data.lettuce;
	},
})

MainContainer.behaviors[2] = Behavior.template({

	update: function(content, result) {
		content.string = result.toString().substring( 0, 5 );
	},
})


var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onQuit: function(application) {
		application.shared = false;
	},
})

pictureIndex=0;
count = 0;
application.invoke( new MessageWithObject( "pins:configure", {
        	analogSensor: {
                require: "analog",
                pins: {
                    analog: { pin: 52 }
                }
            },
            resourceSensors: {
                require: "resources",
                pins: {
                    water: { pin: 1 }, 
					pellet: { pin: 2 }, 
					lettuce: { pin: 3 } 
                }
            }
            
        }));
    	
/* Use the initialized analogSensor object and repeatedly 
   call its read method with a given interval.  */
application.invoke( new MessageWithObject( "pins:/analogSensor/read?" + 
			serializeQuery( {
				repeat: "on",
				interval: 20,
				callback: "/gotAnalogResult"
			} ) ) );
			
application.invoke( new MessageWithObject( "pins:/resourceSensors/read?" + 
			serializeQuery( {
				repeat: "on",
				interval: 50,
				callback: "/gotResourcesResult"
			} ) ) );
			
application.add(new MainContainer());
application.behavior = new ApplicationBehavior();