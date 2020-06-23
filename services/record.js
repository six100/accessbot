
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  fetch = require("node-fetch");
  

module.exports = class Record {
  constructor(user, webhookEvent, apiResponse) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.apiResponse = apiResponse;
    
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
                JSON.stringify({payload:"RECORD_SAVE", item:0, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                ),
                Response.genPostbackButton("Check Accessibility", 
                JSON.stringify({payload:"RECORD_CHECK", item:0, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                )
              ]
            )
          ]
        }

        break;
 

      case "RECORD_SAVE":
          
          // response = [
          //   Response.genText("Record Saved"),
          // ]

          response = [
            Response.genQuickReply(parsed.question, [
              {
                title:`Yes`,
                payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.review, value:"true", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              },
              {
                title:`No`,
                payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.review, value:"false", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              },
              {
                title:`Help me`,
                payload: JSON.stringify({payload:"RECORD_HELP", help:2, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
              }
            ])
          ]
          
        //action:"list"
        //placeId: 123

      break;

      case "RECORD_THANKS":
          
          response = [
            Response.genText("Thanks for your answers"),
            Response.genQuickReply("Next steps:", [
              {
                title:"Review different place",
                payload: "LOCATION_DEFAULT"
              },
              {
                title:"Change Review of this place",
                payload: "LOCATION_DEFAULT"
              }
            ])
          ]

      break;

      case "RECORD_CHECK":

          
          console.log("+++RECORD_CHECK :", this.apiResponse.data.listReviews.items)
          let items = this.apiResponse.data.listReviews.items;
          
          const amenities =[
            Response.genText(`This is what we found about "${parsed.placeName}"`),
          ];
          //1. TO DISPLAY QUICK BUTTONS

          
          // items.map((keyName, i) => (
          //   amenities.push({"title": `${keyName.value == 'true'? '✅' : '❌'} ${keyName.review}`, "payload": "RECORD-XYZ"}
          // )));
          // response = [
          //   Response.genText("This is what we found"),
          //   Response.genQuickReply("in this place", amenities)
          // ]


          //2. TO DISPLAY REGULAR MESSAGES 

          items.map((keyName, i) => (
            amenities.push(Response.genText(`${keyName.value == 'true'? '✅' : '❌'} ${keyName.review}`))
          ));
          
          response = amenities;

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
