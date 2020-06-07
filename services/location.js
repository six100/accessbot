
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Location {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    console.log(payload);

    switch (payload) {

      case "LOCATION_REVIEW":
        response = Response.genQuickReply("Can you confirm this is your current location", [
            {
              //TODO: This address needs to come from the device.
              title:"122 Broadway Ave.",
              payload: "LOCATION_SEARCH"
            },
            {
              title:"Different Address",
              payload: "LOCATION_UNKNOWN"
            }
          ]);
        break;

      case "LOCATION_UNKNOWN":
        response = [
          //TODO: This should be an utterance by the user, not a hardwired QuickReply
          Response.genQuickReply("Where are you located now?", [
            {
              title:"123 Broadway Ave.",
              payload: "LOCATION_SEARCH"
            }
          ])
        ];
        break;

      case "LOCATION_SEARCH":
        response = [
          // TODO: HERE IMPLEMENT LOGIC
          // 1. CONNECT TO YELP API, GET PLACES CLOSE TO ADDRESS PROVIDED
          // 2. ATTEMPT TO MATCH RESULTS WITH ACCESS-BOT DB.
          // 3. ASSEMBLE NEW PAYLOAD ONLY WITH MATCHED RESULTS.

          //TODO: This should be an actual Payload
          Response.genQuickReply("This is what I found", [
            {
              title:"Show Results",
              payload: "LOCATION_NEARBY"
            }
          ])
        ];
        break;

      case "LOCATION_NEARBY":
        response = [
          Response.genText("There are 2 nearby accessible places"),
          Response.genQuickReply("Please choose one", [
            {
              //TODO: This address needs to come directly from the device.
              title:"The Lunch, 120 10th St.",
              payload: "LOCATION_CHOSEN"
            },
            {
              title:"Happy Fries, 124 10th St.",
              payload: "LOCATION_CHOSEN"
            }
          ])
        ];
        break;
      
      case "LOCATION_CHOSEN":
        response =[
          Response.genText("Happy Fries is an American Dinner with traditional Menu, famous for their Cajun Fries."),
          //TODO: Add A template for Restaurants  
        ];
        break;

      case "LOCATION_AMENITIES":
        //TODO: Replace this for DB information
        response = [
          Response.genText("This place has a ramp in the entrance"),
          Response.genText("Braile Menu is available"),
          Response.genText("Do you want to see photos of the place?"),
        ];
        break;

      case "LOCATION_GALLERY":
        response =[
          //TODO: Replace this for a Photo Gallery
          Response.genText("This is the Photo Gallery"),
          
          //Next steps
          Response.genQuickReply("What else can I help you with?", [
            {
              title:"Ask question",
              payload: "LOCATION_NEW_QUESTION"
            },
            {
              title:"Nearby places",
              payload: "LOCATION_NEARBY"
            },
            {
              title:"New Search",
              payload: "LOCATION_REVIEW"
            }
          ])
        ];
        break;

        case "LOCATION_NEW_QUESTION":
        //TODO: Replace this for a logic that captures and write the new Question in a DB
        response = [
          Response.genText("What is your question for Happy Fries?"),
          Response.genText("End of Demo"),
          //Next steps
          Response.genQuickReply("What else can I help you with?", [
            {
              title:"Ask question",
              payload: "LOCATION_NEW_QUESTION"
            },
            {
              title:"Nearby places",
              payload: "LOCATION_NEARBY"
            },
            {
              title:"New Search",
              payload: "LOCATION_REVIEW"
            }
          ])

        ];
        break;

        default : response = [ Response.genText("default response")]
      
    }

    return response;
  }
};
