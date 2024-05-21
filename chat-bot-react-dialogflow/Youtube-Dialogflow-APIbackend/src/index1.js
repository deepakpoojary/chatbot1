// Imports the Dialogflow client library
const dialogflow = require('@google-cloud/dialogflow').v2;

// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const projectId = 'ID of GCP project associated with your Dialogflow agent';
// const sessionId = 'Some unique identifier for the session';
// const knowledgeBaseName = 'projects/your-project-id/knowledgeBases/your-knowledge-base-id';
// const query = 'what is the difference between mountain and river';

// The path to identify the agent that owns the created intent.
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: 'en-US',
    },
  },
  queryParams: {
    knowledgeBaseNames: [knowledgeBaseName],
  },
};

// Send request and log result
sessionClient.detectIntent(request).then(responses => {
  const result = responses[0].queryResult;
  console.log(`Query: ${result.queryText}`);
  console.log(`Response: ${result.fulfillmentText}`);
}).catch(err => {
  console.error('ERROR:', err);
});
