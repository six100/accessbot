
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
      case "LOCATION":
        response = [
          Response.genQuickReply(i18n.__("location.prompt"), [
            {
              title: i18n.__("location.userlocation"),
              payload: "USER_LOCATION"
            },
            {
              title: i18n.__("location.newlocation"),
              payload: "NEW_LOCATION"
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
