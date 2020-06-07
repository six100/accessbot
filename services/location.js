
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "LOCATION_CONFIRMATION":
        response = [
          Response.genQuickReply("Can you confirm this is your current location", [
            {
              //TODO: This address needs to come from the device.
              title:"122 Broadway Ave.",
              payload: "LOCATION_SEARCH"
            },
            {
              title:"Different Address",
              payload: "LOCATION_UNKNOWN"
            }
          ])
        ];
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
          Response.genText(i18n.__("Checking")),
          // TODO: HERE IMPLEMENT LOGIC
          // 1. CONNECT TO YELP API, GET PLACES CLOSE TO ADDRESS PROVIDED
          // 2. ATTEMPT TO MATCH RESULTS WITH ACCESS-BOT DB.
          // 3. ASSEMBLE NEW PAYLOAD ONLY WITH MATCHED RESULTS.

          //TODO: This should be an actual Payload
          Response.genQuickReply("Where are you located now?", [
            {
              title:"Show Results",
              payload: "LOCATION_REFINE"
            }
          ])
        ];
        break;
      
      case "USER_LOCATION":
      case "NEW_LOCATION":
        response =[
          Response.genText(i18n.__("location.current")),
          Response.genQuickReply(i18n.__("location.nearby"), [
          {
            title: "fake address 1",
            payload: "LOCATION1"
          },
          {
            title: "fake address 2",
            payload: "LOCATION2"
          },
          
        ])];
        break;
      
    }

    return response;
  }
};
