
"use strict";

const i18n = require("../i18n.config");

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    
    console.log("+++STEP3:",quickReplies);

    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      console.log("++++STEP4:",quickReply)
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genListTemplate(elements) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "list",
          top_element_style: "COMPACT",
          elements: elements
        }
      }
    };

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplateTEST(image) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "media",
          elements: [
            //WORKS1
            // {
            //   title: title,
            //   subtitle: subtitle,
            //   image_url: image
            // },
            //WORKS2
            {
              media_type:"image",
              attachment_id: image,
              
            },
            //WORKS3
            // {
            //   media_type:"image",
            //   url: image
            // }
            
          ]
        }
      }
    };

    return response;
  }

  static genImageById(image) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "media",
          elements: [
            {
              media_type:"image",
              attachment_id: image
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageGallery(image) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: type,
          elements: {
            media_type:"image",
            attachment_id: image
          }
        }
      }
    };

    return response;
  }

  static genImageTemplateById(image_id, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "media",
          elements: [
            {
              media_type:"image",
              attachment_id: image_id,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genGalleryTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            //WORKS1
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            },
           
          ]
        }
      }
    };

    return response;
  }


  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true
    };

    return response;
  }

  static genNuxMessage(user) {
    let welcome = this.genText(
      i18n.__("get_started.welcome", {
        userFirstName: user.firstName
      })
    );

    let guide = this.genText(i18n.__("get_started.guidance"));

    let curation = this.genQuickReply(i18n.__("get_started.help"), [
      {
        title: "Show me an example",
        payload: "LOCATION_START_EXAMPLE"
      }
    ]);

    

    return [welcome, guide, curation];
  }
};
