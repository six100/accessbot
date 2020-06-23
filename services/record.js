
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
      console.log("[STEP 59]:",details, parsed);
      //action = parsed.payload;

    } catch (ex) {
      console.log("[STEP 59 ERROR]:");
      console.error(ex);
    }

    switch (payload) {

      case "RECORD_WELCOME":
          console.log("[STEP 60]", payload);
          console.log("[STEP 60B]", parsed);


          if(parsed.placeName){response = [
            Response.genGenericTemplate(
              `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
              `${parsed.placeName ? parsed.placeName : 'unknown'}`,
              `${parsed.placeAddress  ? parsed.placeAddress : 'unknown'}`,
              [Response.genPostbackButton("Report Accessibility", 
                JSON.stringify({payload:"RECORD_QUESTION", question:"1", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                ),
                Response.genPostbackButton("Check Accessibility", 
                JSON.stringify({payload:"RECORD_CHECK", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                )
              ]
            )
          ]
        }

        break;

      case "RECORD_QUESTION":

          console.log("[STEP 63]", parsed);

          response = [
            Response.genQuickReply("Do you see a Ramp at the entrance?", [
              {
                title:`Yes I do`,
                payload: JSON.stringify({payload:"RECORD_SAVE", question:2, review:"ramp_entrance", value:"true", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              },
              {
                title:`No I don't`,
                payload: JSON.stringify({payload:"RECORD_SAVE", question:2, review:"ramp_entrance", value:"false", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              },
              {
                title:`Help me`,
                payload: JSON.stringify({payload:"RECORD_HELP", help:1, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              }
            ])
          ]

          // response = [
          //   Response.genQuickReply("Do you see a Ramp at the entrance?", [
          //     {
          //       title:`Yes I do`,
          //       payload:'RECORD_SAVE'
          //     },
          //     {
          //       title:`No I don't`,
          //       payload:'RECORD_SAVE2'
          //     },
          //     {
          //       title:`Help me`,
          //       payload: 'RECORD_SAVE3'
          //     }
          //   ])
          // ]
          // response = [ 
          //   Response.genQuickReply("This is Record Default", [
          //     {
          //       title:"General",
          //       payload: "LOCATION_CHOSEN"
          //     },
          //     {
          //       title:"Accessibility",
          //       payload: "LOCATION_AMENITIES"
          //     },
          //     {
          //       title:"Photos",
          //       payload: "LOCATION_GALLERY"
          //     },
          //     {
          //       title:"X",
          //       payload: "LOCATION_CLEAR"
          //     }
          //   ])
          // ]
        
      break;

      case "RECORD_SAVE":
          
          response = [
            Response.genText("Record Saved"),
          ]
          
        //action:"list"
        //placeId: 123

      break;

      case "RECORD_CHECK":

          console.log("++++RECORD_CHECK",parsed);
          response = [
            Response.genText("Record Check"),
          ]
          
        //action:"list"
        //placeId: 123

      break;

      case "RECORD_HELP":

          console.log("++++RECORD_HELP",parsed);
          response = [
            Response.genText("Record Help"),
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
