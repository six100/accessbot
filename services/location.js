
"use strict";

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  fetch = require("node-fetch");


module.exports = class Location {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    let placeName;
    let placeDescription;

    let message = this.webhookEvent.message.text.trim().toLowerCase();

    console.log(this.webhookEvent);

    switch (payload) {
      
      case "LOCATION_TESTMAP":
        var userLocation = `Museum%20of%20Contemporary%20Art%20Australia`;
        var locationUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${userLocation}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${config.geoKey}`;

        /// QUERY
        const getLocation = async url => {
          try {
            const response = await fetch(
              url, 
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            const json = await response.json();
            console.log('GEO ANSWER',JSON.stringify(json));

            return json;
            
          } catch (error) {
            console.log(error);
          }
        };
        getLocation(locationUrl);


        break;

      case "LOCATION_TEST":
          
          var crudUrl = config.crudUrl;
          var crudKey = config.crudKey;
          var qid = 9714;
          var query = `query AllMessageConnection($qid: ID!){allMessageConnection(conversationId: $qid) {
              messages {
                id
                conversationId
                content
                createdAt
              }
          }}`;

          console.log('query QUERY', JSON.stringify({
            query,
            //variables: { dice, sides },
            variables:{qid},
          }))

            /// QUERY
            const getData = async url => {
              try {
                const response = await fetch(
                  url, 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key':crudKey,
                      //'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                      query,
                      //variables: { dice, sides },
                      variables:{qid},
                    })
                  }
                );
                const json = await response.json();
                console.log('API ANSWER',JSON.stringify(json));

                return json;
                
              } catch (error) {
                console.log(error);
              }
            };
            const apiResponse = getData(crudUrl);


          var mid = 9720;
          var content = message;


          var mutation = `mutation CreateMessage($mid: ID!, $content: String ){createMessage(id: $mid, content: $content, conversationId: "9714", createdAt:"12345" ) {
                content
                createdAt
              }
            }`;

            console.log('mutation QUERY', JSON.stringify({
              query: mutation,
              variables:{mid, content},
            }))

            const writeData = async url => {
              try {
                const response = await fetch(
                  url, 
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key':crudKey,
                      //'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                      query: mutation,
                      variables:{mid, content},
                    })
                  }
                );
                const json = await response.json();
                console.log('WRITE API ANSWER',JSON.stringify(json))

                return json;
                
              } catch (error) {
                console.log('WRITE API ERROR',error);
              }
            };

            writeData(crudUrl);

            

        
        response = [
          Response.genText("test HERE"),
        ]
      break;
        //TEST ENDS


      case "ACCESSIBILITY_REQUEST":
        
        response = [
          Response.genText("I can help with that!"),
          Response.genQuickReply("Is 13 Elm Street your current location?", [
            {
              //TODO: This address needs to come from the device.
              title:"Yes it is",
              payload: "LOCATION_NEARBY"
            },
            {
              title:"No, is different",
              payload: "LOCATION_UNKNOWN"
            }
          ])];
        break;

      case "LOCATION_REVIEW":
        response = Response.genQuickReply("Can you confirm this is your current location", [
            {
              //TODO: This address needs to come from the device.
              title:"122 Broadway Ave.",
              payload: "LOCATION_NEARBY"
            },
            {
              title:"No, is different",
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
              title:`Joe's Dinner`,
              payload: "LOCATION_CHOSEN"
            },
            {
              title:"Thai Bistro",
              payload: "LOCATION_CHOSEN"
            }
            
          ])
        ];
        break;
        

      case "LOCATION_IMAGE_TEST":
        response = [
          Response.genText("Restroom photos"),

          //WORKS 1
          // Response.genImageTemplate(
          //   `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
          //   i18n.__("demo.name"),
          //   i18n.__("demo.description")
          // ),

          //WORKS 2
          Response.genImageTemplate(
            `1664694220378585`
          ),

          //WORKS 3
          // Response.genImageTemplate(
          //   `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
          // )
          
          Response.genGalleryTemplate(
            `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
            i18n.__("demo.name"),
            i18n.__("demo.description")
          ),

        ];
        break;


      case "LOCATION_IMAGE":
        response = [
          Response.genText(
            i18n.__("leadgen.promo", {
              userFirstName: this.user.firstName
            })
          ),
          Response.genImageById(`1664694220378585`),
          Response.genImageById(`187406175933687`),
          Response.genImageById(`285796509456205`),

          Response.genImageTemplateById(
            `1664694220378585`,
            [Response.genPostbackButton(i18n.__("location.showAmenities"), "LOCATION_AMENITIES"),
            Response.genPostbackButton("Directions", "LOCATION_MAP")]
          )
        ];
        break;


      case "LOCATION_CHOSEN":
        response = [
          // Response.genText(
          //   i18n.__("leadgen.promo", {
          //     userFirstName: this.user.firstName
          //   })
          // ),
          Response.genGenericTemplate(
            `${config.shopUrl}/images/demo/${i18n.__("demo.image")}`,
            i18n.__("demo.name"),
            i18n.__("demo.description"),
            [Response.genPostbackButton(i18n.__("location.showAmenities"), "LOCATION_AMENITIES"),
            Response.genPostbackButton("Show Restroom", "LOCATION_AMENITIES"),
            Response.genPostbackButton("Take me there!", "LOCATION_AMENITIES"),
          ]
          )
        ];
        break;

      case "LOCATION_AMENITIES":
        //TODO: Replace this for DB information
        response = [
          Response.genText("This place has a ramp in the entrance"),
          Response.genText("Braile Menu is available"),
          Response.genText("Restroom is wheelchair accessible"),
          //Next steps
          Response.genQuickReply("Please choose one", [
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
            
          ])

        ];
        break;

      case "LOCATION_GALLERY":
        response =[
          //TODO: Replace For Place photos
          Response.genImageById(`662033577684034`),
          Response.genImageById(`257285178883552`),
          
          //Next steps
          Response.genQuickReply("What else can I help you with?", [
            {
              title:"Show Accessibility",
              payload: "LOCATION_AMENITIES"
            },
            {
              title:"Show Map",
              payload: "LOCATION_MAP"
            },
            {
              title:"Nearby places",
              payload: "LOCATION_NEARBY"
            },
            // {
            //   title:"Ask question",
            //   payload: "LOCATION_NEW_QUESTION"
            // },
          ])
        ];
        break;

        case "LOCATION_MAP":
        response = [
          // Response.genText(
          //   i18n.__("leadgen.promo", {
          //     userFirstName: this.user.firstName
          //   })
          // ),
          Response.genGenericTemplate(
            `${config.shopUrl}/images/demo/map1.png`,
            i18n.__("demo.name"),
            i18n.__("demo.description"),
            [Response.genPostbackButton(i18n.__("location.showAmenities"), "LOCATION_AMENITIES"),
            Response.genPostbackButton("Show Restroom", "LOCATION_AMENITIES")]
          )
        ];
        break;

        case "LOCATION_CLEAR":
        response = [
          Response.genGenericTemplate(
            `${config.shopUrl}/images/demo/black.png`,
            `-`,
            `-`,
            [Response.genPostbackButton("-", "LOCATION_AMENITIES"),]
          )
        ];
        break;

        case "LOCATION_NEW_QUESTION":
        //TODO: Replace this for a logic that captures and write the new Question in a DB
        response = [
          Response.genText("What is your question for Joe's Dinner?"),
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

        case "LOCATION_CHECK":
        response = Response.genQuickReply("This flow is not ready yet", [
            {
              //TODO: This address needs to come from the device.
              title:"Start all over again",
              payload: "LOCATION_REVIEW"
            }
          ]);
        break;


        default : response = [ 
          Response.genQuickReply("Available information", [
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
      
    }

    return response;
  }
};
