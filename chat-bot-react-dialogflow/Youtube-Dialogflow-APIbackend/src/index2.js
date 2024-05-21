const projectId = "krishi-bot-tsoy";
const location = "global";
const agentId = "2ae58a80-79bc-4124-804a-c4dee5e9c60e";
// const audioFileName = "/path/to/audio.raw";
const encoding = "AUDIO_ENCODING_LINEAR_16";
const sampleRateHertz = 16000;
const languageCode = "en";
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://poojarydeepak15:yashmith@cluster0.0rohejj.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

// Define MongoDB schema and model
const PDF = new mongoose.Schema({
  name: String,
  data: Buffer, // Binary data for the PDF
  phone: String,
});

const Pdf = mongoose.model("Pdf", PDF);

// Imports the Google Cloud Some API library
const { SessionsClient } = require("@google-cloud/dialogflow-cx").v3;
/**
 * Example for regional endpoint:
 *   const location = 'us-central1'
 *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
 */
const client = new SessionsClient();
// {
//   projectId: "krishi-bot-tsoy",
// }

const fs = require("fs");
const util = require("util");
// Assumes uuid module has been installed from npm,
// npm i uuid:
const { v4 } = require("uuid");

async function detectIntent(languageCode, queryText, sessionId) {
  // const sessionId = v4();
  // console.log(sessionId);
  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );

  // Read the content of the audio file and send it as part of the request.
  //   const readFile = util.promisify(fs.readFile);
  //   const inputAudio = await readFile(audioFileName);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
      //   audio: {
      //     config: {
      //       audioEncoding: encoding,
      //       sampleRateHertz: sampleRateHertz,
      //     },
      //     audio: inputAudio,
      //   },
      languageCode,
    },
  };
  // console.log("Hello");
  // console.log("Hello");
  const [response] = await client.detectIntent(request);
  // console.log(response.queryResult.text);
  console.log(`User Query: ${response.queryResult.text}`);
  //see how many messages
  for (const message of response.queryResult.responseMessages) {
    if (message.text) {
      console.log(`Agent Response: ${message.text.text}`);
    }
  }
  if (response.queryResult.match.intent) {
    console.log(
      `Matched Intent: ${response.queryResult.match.intent.displayName}`
    );
  }
  console.log(`Current Page: ${response.queryResult.currentPage.displayName}`);
  //here is the problem
  // console.log(response.queryResult.responseMessages[1].text.text);
  // return response.queryResult.responseMessages[0].text.text[0];
  return response.queryResult.responseMessages[0].text.text[0];
}

// detectIntent("en", "hi  ", "abcd1234");

const webApp = express();
webApp.use(cors()); // Allows all origins

// Webapp settings
webApp.use(
  express.urlencoded({
    extended: true,
  })
);
webApp.use(express.json());
webApp.use(bodyParser.json());

// Server Port
const PORT = process.env.PORT || 5000;

// Home route
webApp.get("/", (req, res) => {
  res.send("Hello Wor");
});

// Dialogflow route
webApp.post("/dialogflow", async (req, res) => {
  let languageCode = req.body.languageCode;
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId;

  let responseData = await detectIntent(languageCode, queryText, sessionId);
  console.log(responseData);
  console.log("DF");
  res.send(responseData);
});

webApp.post("/webhook", async (req, res) => {
  // const datamod = req.body.sessionInfo.parameters.phonenos;
  // console.log(datamod);
  // const { phoneno } = req.body.queryResult.parameters.phoneno;
  // console.log(phoneno);
  // console.log(req.body.fulfillmentInfo.tag);
  // console.log(req.body.fulfillmentInfo);

  // const phone = req.body.sessionInfo.parameters.phonenos1;
  // console.log(phone);

  // console.log(req.body.sessionInfo.parameters);
  const phonenos1 = req.body.sessionInfo.parameters.phnos2;
  // const nos ;
  console.log(req.body.sessionInfo.parameters);
  try {
    console.log(phonenos1);
    // Query MongoDB to find the document associated with the phone number
    const customer = await Pdf.findOne({ phone: phonenos1 });
    console.log(customer);
    console.log(`${customer.data}`);
    if (!customer) {
      // If no document found, send a response indicating it

      const jsonResponse = {
        fulfillment_response: {
          messages: [
            {
              text: {
                //fulfillment text response to be sent to the agent
                text: [
                  `Phone number ${phoneNumber} not found in the database.`,
                ],
              },
            },
          ],
        },
      };
      // res.status(200).send(jsonResponse);
      // res.send("no document ");
    } else {
      // If document found, send it back as part of the response
      // res.send("${customer.data}");
      const jsonResponse = {
        fulfillment_response: {
          messages: [
            {
              text: {
                //fulfillment text response to be sent to the agent
                text: [
                  `document found for the provided phone number  and contents are ${customer.data}`,
                ],
              },
            },
          ],
        },
      };
      // res.status(200).send(jsonResponse);
      res.send(jsonResponse);

      // res.json({
      //   fulfillmentResponse: `document found for the provided phone number  and contents are ${customer.data}`,
      //     // fulfillmentMessages: [
      //     //   {
      //     //     card: {
      //     //       title: "Soil health report card",
      //     //       // "subtitle": "Card Subtitle",
      //     //       // "imageUri": "https://example.com/images/example.png",
      //     //       buttons: [
      //     //         {
      //     //           text: "Download PDF",
      //     //           postback: "https://example.com/button1",
      //     //         },
      //     //         // "text":[
      //     //         //   "text":here is a text for you
      //     //         // ]
      //     //         // {
      //     //         //   "text": "Button 2",
      //     //         //   "postback": "https://example.com/button2"
      //     //         // }
      //     //       ],
      //     //       // "text":[
      //     //       //   "text": "Download PDF"

      //     //       // ],
      //     //     },
      //     //   },
      //     // ],
      //     //here
      //     // "fulfillmentMessages": [
      //     //   {
      //     //   "card": {
      //     // "title": "Card Title",
      //     //     "subtitle": "Card Subtitle",
      //     //     "imageUri": "https://example.com/images/example.png",
      //     //     "buttons": [
      //     //       {
      //     //         "text": "Button 1",
      //     //         "postback": "https://example.com/button1"
      //     //       },
      //     //       {
      //     //         "text": "Button 2",
      //     //         "postback": "https://example.com/button2"
      //     //       }
      //     //     ]
      //     //   }]

      //     //   {
      //     //     "card": {
      //     //       "title": "Card Title",
      //     //       "subtitle": "Card Subtitle",
      //     //       "imageUri": "https://example.com/images/example.png",
      //     //       "buttons": [
      //     //         {
      //     //           "text": "Button 1",
      //     //           "postback": "https://example.com/button1"
      //     //         },
      //     //         {
      //     //           "text": "Button 2",
      //     //           "postback": "https://example.com/button2"
      //     //         }
      //     //       ]
      //     //     }
      //     //   }
      //     // "payload": {
      //     //   "buttons": [
      //     //     {
      //     //       "text": "Button Text",
      //     //       "postback": "https://example.com/button_action"
      //     //     }
      //     //   ]
      //     // },
      //     // "text": {
      //     //   "text": [
      //     //     "Here is a button for you."
      //     //   ]
      //     // },
      //     // "buttons": [
      //     //   {
      //     //     "text": "Button 1",
      //     //     "postback": "https://example.com/button1"
      //     //   }]
      //     //   }
      // }); // here
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
