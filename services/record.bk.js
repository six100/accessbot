
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  fetch = require("node-fetch");
  

module.exports = class Record {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.stringPayload = stringPayload;
    
  }


  async unpackPayload(payload){

    //The function that turns a stringified payload to an object
    let parseInfo = function(payload){
      let parsed = JSON.parse(payload); 
      return parsed;
    }

    let parsedReady = await parseInfo(payload);
    return parsedReady

  }

  handlePayload(payloadToParse){
    
     let parsed = this.unpackPayload(payloadToParse);
     
     if(parsed.payload){
      return this.handleCases(parsed);
     }
     
  }

  handleCases(parsed){
    let response;
    console.log("+++handleCases",parsed);
    //let message = this.webhookEvent.message.text.trim().toLowerCase();

    //Check Business G-Places type
    let checkType = (a, toCheck)=>{
      let f = a.find(e => e === toCheck);
      return f == toCheck;
    };

    //1. READY Define location and acquire place ID (READY)
        //1.2 READY A new component called 'record' that handle the SWITCH statement a little different.(it unpacks payload, extract action)
        //2. 'QuickReply' displays the option for : REVIEW | SHOW ACCESSIBILITY (carry ID)
        //2.1 Create logic to choose between 3 possible Accessibility Reports: Ramp, Braile, Restroom (QuickReply) (carry ID)
        //2.2 Choose if True or False (QuickReply) (carry ID)
        //3. Selection will trigger payload record.handlePayload() and will receive the stringified Payload
        //4. After unpacking stringified payload, select Action (REPORT)
        //5. Extract Name, id, and thing to report and trigger mutation.
        //6. Get Callback (or await) for it and show final message "Your info was recorded", show initial Menu
        

    switch (parsed.payload) {

      case "RECORD_WELCOME":
          console.log("+++++ THIS IS RECORD_VISIT FROM record.js");

          if(parsed.name){response = [
            Response.genGenericTemplate(
              `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
              `${parsed.name ? parsed.name : 'Bonitaa Restaurant'}`,
              `${parsed.address  ? parsed.address : '123 2nd Ave.'}`,
              [Response.genPostbackButton(i18n.__("location.showAmenities"), "LOCATION_AMENITIES"),
              Response.genPostbackButton("REPORT ACCESSIBILITY", "LOCATION_AMENITIES"),
              Response.genPostbackButton("CHECK ACCESSIBILITY", "LOCATION_AMENITIES"),
            ]
            )
          ]
        }

        break;

      case "RECORD_REPORT":

          console.log("++++RECORD_REPORT",parsed);
          
          response = [
            Response.genText("Let's"),
            Response.genText("Want to continue reviewing La Superior?"),
          ]
      break;

      case "RECORD_CHECK":

          console.log("++++RECORD_CHECK",parsed);
          response = [
            Response.genText("LIST Queried"),
          ]
          
        //action:"list"
        //placeId: 123

      break;

      
      default: 

          console.log("++++RECORD_DEFAULT",parsed);
       
          response = [ 
            Response.genQuickReply("This is Record Default", [
              {
                title:"General",
                payload: "LOCATION_CHOSEN"
              },
              {
                title:"Accessibility",
                payload: "LOCATION_AMENITIES"
              },
              {
                title:"Photos",
                payload: "LOCATION_GALLERY"
              },
              {
                title:"X",
                payload: "LOCATION_CLEAR"
              }
            ])
          ]

        
      break;
        
      
    }

    return response;
  }
};
