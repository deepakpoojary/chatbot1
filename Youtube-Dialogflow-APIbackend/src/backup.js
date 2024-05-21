const projectId = "krishi-bot-tsoy";
const location = "global";
const agentId = "2ae58a80-79bc-4124-804a-c4dee5e9c60e";
// const audioFileName = "/path/to/audio.raw";
const encoding = "AUDIO_ENCODING_LINEAR_16";
const sampleRateHertz = 16000;
const languageCode = "en";
const express = require("express");
require("dotenv").config();

// Imports the Google Cloud Some API library
const { SessionsClient } = require("@google-cloud/dialogflow-cx").v3; //
/**
 * Example for regional endpoint:
 *   const location = 'us-central1'
 *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
 */
const client = new SessionsClient(); //
// {
//   projectId: "krishi-bot-tsoy",
// }

// const fs = require("fs");
// const util = require("util");
// Assumes uuid module has been installed from npm,
// npm i uuid:
const { v4 } = require("uuid");

async function detectIntent(languageCode, queryText, sessionId) {
  const sessionId = v4();
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
        text: "carpenter tools",
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
  console.log("Hello");
  const [response] = await client.detectIntent(request);
  console.log(`User Query: ${response.queryResult.transcript}`);
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
}

detectIntent("en", "hi  ");

const webApp = express();

// Webapp settings
webApp.use(
  express.urlencoded({
    extended: true,
  })
);
webApp.use(express.json());

// Server Port
const PORT = process.env.PORT || 5000;

// Home route
webApp.get("/", (req, res) => {
  res.send(`Hello World.!`);
});

// Dialogflow route
webApp.post("/dialogflow", async (req, res) => {
  let languageCode = req.body.languageCode;
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId;

  let responseData = await detectIntent(languageCode, queryText, sessionId);

  res.send(responseData.response);
});

// Start the server
webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
