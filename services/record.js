
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

  friendlyName(code){
    let name
    switch(code){
      case 'mobility_entrance1' : name = "Unobstructed access"; break;
      case 'mobility_ramp1' : name = "Accessible ramp available"; break;
      case 'mobility_entrance2' : name = "Entrance accessible with button"; break;
      case 'mobility_restroom1' : name = "Restroom same floor as entrance"; break;
      default: name = code;
    }

    return name;
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
                JSON.stringify({payload:"RECORD_SAVE", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                ),
                Response.genPostbackButton("Check Accessibility", 
                JSON.stringify({payload:"RECORD_CHECK", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                )
              ]
            )
          ]
        }

        break;
 

      case "RECORD_SAVE":
          
          console.log('[STEP 64.1]:', payload);
          console.log('[STEP 64.2]:', details);
          console.log('[STEP 64.3]:', parsed);

          

          if(parsed.item == 2){
           //TODO: DYNAMICALLY LOAD HELP
            response = [
              Response.genText("Based on the following diagram:"),
              Response.genImageById(`259136198695181`),
              Response.genQuickReply(parsed.question, [
                {
                  title:`Yes`,
                  payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.question, value:"true", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId, displayName:parsed.question})
                },
                {
                  title:`No`,
                  payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.question, value:"false", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId, displayName:parsed.question})
                },
                // {
                //   title:`Help me`,
                //   payload: JSON.stringify({payload:"RECORD_HELP", help:2, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                // }
              ]),
              
            ]
          }else{
            response = [
              Response.genQuickReply(parsed.question, [
                {
                  title:`Yes`,
                  payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.question, value:"true", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId, displayName:parsed.question})
                },
                {
                  title:`No`,
                  payload: JSON.stringify({payload:parsed.payload, item:parsed.item, review:parsed.question, value:"false", placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId, displayName:parsed.question})
                },
                // {
                //   title:`Help me`,
                //   payload: JSON.stringify({payload:"RECORD_HELP", help:2, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                // }
              ]),
              
            ]
          };
        

      break;

      case "RECORD_EXAMPLE":
          
          response = [
            Response.genText("To be sure"),
            Response.genImageById(`2728490717387755`),
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

      case "RECORD_THANKS":
          
          response = [
            Response.genText("Thanks for your answers"),
            Response.genImageById(`2728490717387755`),
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

      case "RECORD_QUESTION_SAVED":
        response = [
          //TODO: This should be an utterance by the user, not a hardwired QuickReply
          Response.genText("Ok, thanks for your question"),
          Response.genImageById(`597521124473428`),
          Response.genText(`Do you have another question?`),
        ];
        break;

      case "RECORD_CHECK":

          console.log("+++RECORD_CHECK :", this.apiResponse.data.listReviews.items)
          let items = this.apiResponse.data.listReviews.items;
          
          
          let amenities;

          if(items.length >=1){
            amenities =[
              Response.genText(`This is what we found about "${parsed.placeName}" located at ${parsed.placeAddress}`),
            ];

            items.map((keyName, i) => {
              amenities.push(Response.genText(`${keyName.value == 'true'? '✅' : '❌'} ${this.friendlyName(keyName.review)}`))
            });
            
  
            amenities.push(
            Response.genQuickReply("You can also check some photos or find nearby places.", [
              {
                title:"Show Restroom",
                payload: "LOCATION_GALLERY"
              },
              {
                title:"Directions",
                payload: "LOCATION_MAP"
              },
              {
                title:"Nearby places",
                payload: "LOCATION_NEARBY"
              },
              
            ]))

          }else{
            amenities =[
              Response.genText(`We couldn't find any accessibility information`),
              Response.genQuickReply(`Do you want to review accessibility for "${parsed.placeName}"`, [
                {
                  title: "Yes, let's do this",
                  payload: JSON.stringify({payload:"RECORD_SAVE", item:0, placeName:parsed.placeName, placeAddress:parsed.placeAddress, placeId:parsed.placeId})
                },
                {
                  title:"No",
                  payload: "LOCATION_START"
                }
              ]),
            ]
          }
          
          
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
