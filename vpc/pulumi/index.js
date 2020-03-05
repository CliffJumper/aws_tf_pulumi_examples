const awsNetwork = require("./vpc");

// Define and Deploy networking
var netParams = {
  "cidr": "10.100.0.0/24",
  "subnets": 4,
  "prefix": "qews"
};
awsNetwork.ddStart(netParams);

