
"use strict";

const Curation = require("./curation"),
  Location = require("./location"),  
  Order = require("./order"),
  Response = require("./response"),
  Care = require("./care"),
  Survey = require("./survey"),
  GraphAPi = require("./graph-api"),
  i18n = require("../i18n.config");

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;
    console.log('EVENT:',event);
    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          //Hit when its a user utterance
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      console.log('thisss')
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );


    let nlpIntent = this.searchNLP(this.webhookEvent.message.nlp,'intent')
    let nlpLocation = this.searchNLP(this.webhookEvent.message.nlp,'location')
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

    //this.showAllResponse(this.webhookEvent.message.nlp);
   

    let message = this.webhookEvent.message.text.trim().toLowerCase();
    let response;

    //GREETINGS
    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (Number(message)) {
      response = Order.handlePayload("ORDER_NUMBER");
    } else if (message.includes("#")) {
      response = Survey.handlePayload("CSAT_SUGGESTION");
    } else if (message.includes(i18n.__("care.help").toLowerCase())) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload("CARE_HELP");
    } else if((nlpIntent ==='test_me' && nlpIntent.confidence > 0.8) || this.webhookEvent.message.text.includes("test")){
      let location = new Location(this.user, this.webhookEvent);
      //THE PAYLOAD TO TEST
      response = location.handlePayload("LOCATION_TESTMAP");
    } else if((nlpIntent ==='request_accessibility_info' && nlpIntent.confidence > 0.8) || this.webhookEvent.message.text.includes("access")){
      let location = new Location(this.user, this.webhookEvent);
      response = location.handlePayload("ACCESSIBILITY_REQUEST");
    } else if((nlpIntent ==='declare_location' && nlpIntent.confidence > 0.8) || this.webhookEvent.message.text.includes("loca")){
      console.log('CODE:001')
      let location = new Location(this.user, this.webhookEvent);
      response = location.handlePayload("LOCATION_SEARCH");
    }else if((nlpLocation.suggested && nlpLocation.confidence > 0.8)){
      console.log('CODE:002')
      let location = new Location(this.user, this.webhookEvent);
      response = location.handlePayload("LOCATION_SEARCH");
    }else {
      console.log('CODE:010')
      response = [
        Response.genText(
          i18n.__("fallback.any", {
            message: this.webhookEvent.message.text
          })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("menu.review"),
            payload: "LOCATION_REVIEW"
          },
          {
            title: i18n.__("menu.check"),
            payload: "LOCATION_CHECK"
          },
          {
            title:"X",
            payload: "LOCATION_CLEAR"
          }
          //,
          // {
          //   title: "suggestion",
          //   payload: "CURATION"
          // },
          // {
          //   title: i18n.__("menu.help"),
          //   payload: "CARE_HELP"
          // }
        ])
      ];
    }

    return response;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    let response;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
      let curation = new Curation(this.user, this.webhookEvent);
      response = curation.handlePayload(payload);
    } else if (payload.includes("LOCATION")) {
      let location = new Location(this.user, this.webhookEvent);
      response = location.handlePayload(payload);
    } else if (payload.includes("CARE")) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload(payload);
    } else if (payload.includes("ORDER")) {
      response = Order.handlePayload(payload);
    } else if (payload.includes("CSAT")) {
      response = Survey.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        Response.genText(i18n.__("chat_plugin.prompt")),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("care.order"),
            payload: "CARE_ORDER"
          },
          {
            title: i18n.__("care.billing"),
            payload: "CARE_BILLING"
          },
          {
            title: i18n.__("care.other"),
            payload: "CARE_OTHER"
          }
        ])
      ];
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
      i18n.__("get_started.guidance") + ". " +
      i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.review"),
        payload: "LOCATION_REVIEW"
      },
      {
        title: i18n.__("menu.check"),
        payload: "LOCATION_CHECK"
      }
      // ,
      // {
      //   title: "curation",
      //   payload: "CURATION"
      // },
      // {
      //   title: i18n.__("menu.help"),
      //   payload: "CARE_HELP"
      // }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    console.log("sendMessageHere:",response)
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {

    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];

  }

  searchNLP(nlp, name) {
    if (nlp.entities[name]) {
        console.log(`++++++++ this is '${name}': `);
        console.log(nlp.entities[name][0]);
        return nlp.entities[name][0];
    } else {
        console.log(`${name} entity not found `)
    }
  }

  showAllResponse(nlp){
    console.log(`/////////////////// ALL RESPONSE`);
    console.log(nlp)
  }

};
