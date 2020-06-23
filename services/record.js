
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  fetch = require("node-fetch");
  

module.exports = class Record {
  constructor(user, webhookEvent, details) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    
  }


  handlePayload(payload, details){
     
    let parsed;
    let response;

    try {
      parsed = JSON.parse(details);  
      console.log("[STEP 59]:",details);
      //action = parsed.payload;

    } catch (ex) {
      console.log("[STEP 59 ERROR]:");
      console.error(ex);
    }
    

    switch (payload) {

      case "RECORD_WELCOME":
          console.log("+++++ THIS IS RECORD_VISIT FROM record.js");

          if(parsed.placeName){response = [
            Response.genGenericTemplate(
              `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
              `${parsed.placeName ? parsed.placeName : 'unknown'}`,
              `${parsed.placeAddress  ? parsed.placeAddress : 'unknown'}`,
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
