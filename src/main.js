//@program
var MAX_LETTUCE = 2;
var MAX_WATER = 1000;
var MAX_HAY = 5;
var blackSkin = new Skin( { fill:"black" } );
var labelStyle = new Style( { font: "bold 30px", color:"white",  horizontal: 'center' } );
var resourceLabelStyle = new Style( { font: "bold 20px", color:"white" } );
var updateLabelStyle = new Style({font:"bold 20px", color:"white", horizontal: 'center', vertical: 'middle'});
var lettuceSkin = new Skin({width: 48,
						   height: 48,
						   fill:"white",
						   texture: new Texture('lettuce.png')
						   });
var waterSkin = new Skin({width: 48,
						   height: 48,
						   fill:"white",
						   texture: new Texture('water.png')
						   });
var haySkin = new Skin({width: 48,
						   height: 48,
						   fill:"white",
						   texture: new Texture('hay.png')
						   });
Handler.bind("/getStatus", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify( { status: statusLabel.string } );
		message.status = 200;
	}
}));

Handler.bind("/reset", Behavior({
	onInvoke: function(handler, message){
		pictureCount = 0;
		updateLabel.string = "delete pictures";
		message.responseText = JSON.stringify( { pictureCount: "0" } );
		message.status = 200;
	}
}));

Handler.bind("/addWater", Behavior({
	onInvoke: function(handler, message){
		updateLabel.string = "Water Added";
		if(waterDisplay.behavior.getValue() == MAX_WATER)
			message.responseText = JSON.stringify( { resource: "Max Water Level" } );
		else
			message.responseText = JSON.stringify( { resource: "+ 100ml Water" } );
		message.status = 200;
	}
}));
Handler.bind("/addLettuce", Behavior({
	onInvoke: function(handler, message){
		updateLabel.string = "Lettuce Added";
		if(lettuceDisplay.behavior.getValue() == MAX_LETTUCE)
			message.responseText = JSON.stringify( { resource: "Max Lettuce Level" } );
		else
			message.responseText = JSON.stringify( { resource: "+ 1 Lettuce Head" } );
		message.status = 200;
	}
}));
Handler.bind("/addHay", Behavior({
	onInvoke: function(handler, message){
		updateLabel.string = "Hay Added";
		if(hayDisplay.behavior.getValue() == MAX_HAY)
			message.responseText = JSON.stringify( { resource: "Max Hay Level" } );
		else
		message.responseText = JSON.stringify( { resource: "+1 Hay Bush" } );
		message.status = 200;
	}
}));

Handler.bind("/takePicture", Behavior({
	onInvoke: function(handler, message){
		updateLabel.string = "new pic!";
		pictureCount++;
		if(statusLabel.behavior.getValue() == "Asleep"){
			message.responseText = JSON.stringify( { url: "rabbit-sleep.png", warning: (pictureCount > 2) } );
			message.status = 200;
		}
		else{
			pictureIndex ++;
			if(pictureIndex > 4)
				pictureIndex = 2;
			message.responseText = JSON.stringify( { url: "rabbit-" + pictureIndex + "-Copy2.jpg", warning: false } );
			message.status = 200;
		}
		
	}
}));

Handler.bind("/getResources", Behavior({
	onInvoke: function(handler, message){
		//handler.wait(1000); //will call onComplete after 1 seconds
		message.responseText = JSON.stringify( { water: waterDisplay.string, lettuce: lettuceDisplay.string, hay: hayDisplay.string } );
		message.status = 200;
	}
}));


Handler.bind("/gotStatusResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
        		var result = message.requestObject;  
        		application.distribute( "onStatusValueChanged", result ); 		
        	}}
}));

Handler.bind("/gotResourcesResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				//trace('inside gotResourcesResult!\n');		
           		var result = message.requestObject; 
        		application.distribute( "onResourcesValueChanged", result ); 		
        	}}
}));


var ResourceLabelBehavior = Behavior.template({
	
}); 

var resourceLabelTemplate = Label.template(function($) {return {editable:true,left:0, right: 0, height: 40, string: "---", style: labelStyle, 
behavior: Object.create(Behavior.prototype,{
	onCreate: { value: function(content,data){
		this.data = data;
		var self = content;
		this.getValue = function() {return self.string;};
		this.update = function(result) { self.string = result.toString().substring( 0, 6 );};
		//trace('inside onCreate of ResourceLabelBehavior\n')
	}},
})
}});

var updateLabel = new Label({left:0, right:0, height:30, string:"---", style: updateLabelStyle});
var statusLabel = new resourceLabelTemplate({name: "statusLabel"});
var waterDisplay = new resourceLabelTemplate({skin: new Skin({fill: "blue"}),name: "waterDisplay"});
var hayDisplay = new resourceLabelTemplate({skin: new Skin({fill: "red"}),name: "hayDisplay"});
var lettuceDisplay = new resourceLabelTemplate({skin: new Skin({fill: "green"}),name: "lettuceDisplay"});
	
var MainContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blackSkin,
 						contents: [
 								new Line(({left: 0, right:0, top:0, bottom:150, name: "updateLine",
									contents:[
										new Label({left:0, right:0, height:30, string:"Updates:", style: labelStyle}),
										updateLabel
									]})),
								new Line(({left: 0, right:0, top:0, bottom:100, name: "statusLine",
									contents:[
										new Label({left:0, right:0, height:30, string:"Status:", style: labelStyle}),
										statusLabel
									]})),
								new Line(({left: 0, right:0, top:100, bottom:0, name: "ResourcesLine",
									contents:[
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Content({left:0, right:0, top:0, bottom:0, skin: waterSkin}),
											new Label({left:0, right:0, height:30, width: 100, string:"Water", style: resourceLabelStyle}),
											waterDisplay,
											new Label({left:0, right:0, height:30, width: 100, string:"ml", style: resourceLabelStyle}),
										]})),
						
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Content({left:0, right:0, top:0, bottom:0, skin: lettuceSkin}),
											new Label({left:0, right:0, height:30, width: 100, string:"Lettuce", style: resourceLabelStyle}),
											lettuceDisplay,
											new Label({left:0, right:0, height:30, width: 100, string:"heads", style: resourceLabelStyle}),
										]})),
										new Column(({left: 0, right:0, top:0, bottom:0, contents:[
											new Content({left:0, right:0, top:0, bottom:0, skin: haySkin}),
											new Label({left:0, right:0, height:30, width: 100, string:"Hay", style: resourceLabelStyle}),
											hayDisplay,
											new Label({left:0, right:0, height:30, width: 100, string:"bushes", style: resourceLabelStyle}),
										]}))
										
										
									]}))
								
								
						],
						behavior: Object.create((MainContainer.behaviors[0]).prototype),
								  
						
				 }});


MainContainer.behaviors = new Array(1);

//update resource labels and set up values
MainContainer.behaviors[0] = Behavior.template({

	onCreate: function(content, data) {
	//trace('inside MainContainer onCreate!\n');
		this.data = data;
		this.lastWaterLevel = false;
		
	},
	onStatusValueChanged: function(content, result) {
		var status = "Asleep";
		if(result)
			status = "Active";
		if(status != statusLabel.behavior.getValue()){	
			pictureCount = 0; //reset picture pictureCount everytime 
			statusLabel.behavior.update(status);
		}
	},

	onResourcesValueChanged: function(content, data) {
		//trace('inside onResourcesValueChanged!\n');
		var threshold = .001; 
        if ( this.lastWaterLevel === false ) {
			this.lastWaterLevel = data.water;
        	this.lastHayCount = data.hay;
        	this.lastLettuceCount = data.lettuce;
        }
        else if ( ( Math.abs( data.water - this.lastWaterLevel ) > threshold )){
        	waterDisplay.behavior.update(data.water);
        }
       	else if ( Math.abs( data.hay - this.lastHayCount ) > threshold ){
       		hayDisplay.behavior.update(data.hay);
       	}
       	else if ( Math.abs( data.lettuce - this.lastLettuceCount ) > threshold ) {
       		lettuceDisplay.behavior.update(data.lettuce);
       	}
        this.lastWaterLevel = data.water;
    	this.lastHayCount = data.hay;
    	this.lastLettuceCount = data.lettuce;
	},
})

MainContainer.behaviors[1] = Behavior.template({

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

pictureIndex=1;
pictureCount = 0;
application.invoke( new MessageWithObject( "pins:configure", {
        	statusSensor: {
                require: "status",
                pins: {
                    status: { pin: 4 }
                }
            },
            resourceSensors: {
                require: "resources",
                pins: {
                    water: { pin: 1 }, 
					lettuce: { pin: 2 },
					hay: { pin: 3 } 
                }
            }
            
        }));
    	
/* Use the initialized statusSensor object and repeatedly 
   call its read method with a given interval.  */
application.invoke( new MessageWithObject( "pins:/statusSensor/read?" + 
			serializeQuery( {
				repeat: "on",
				interval: 20,
				callback: "/gotStatusResult"
			} ) ) );
			
application.invoke( new MessageWithObject( "pins:/resourceSensors/read?" + 
			serializeQuery( {
				repeat: "on",
				interval: 50,
				callback: "/gotResourcesResult"
			} ) ) );
			
application.add(new MainContainer());
application.behavior = new ApplicationBehavior();