var express = require("express");
var router = express.Router();
var graphql_request = require("graphql-request");

router.get("/", async function (req, res, next) {

  const query = graphql_request.gql`
  {
    events (first: 1, filter: {method: {equalTo:  "Notify"}}, orderBy: TIMESTAMP_DESC ) {
        nodes {
            id
            module
            method
            data
            timestamp
        }
    } 
  } 
  `

  let data = await graphql_request.request('https://api.subquery.network/sq/OAK-Foundation/turing-staging-subql', query);
  
  let last_event = data.events.nodes[0];
  console.log(last_event);

  const dt = Date.parse(last_event.timestamp);

  last_event.message = last_event.data.message;
  last_event.timestampnumber = dt;

  res.status(200);

  res.send(last_event);
  //表示结束
  res.end();
});

module.exports = router;