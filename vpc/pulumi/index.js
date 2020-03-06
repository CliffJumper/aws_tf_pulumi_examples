const awsNetwork = require("./vpc");

// Define and Deploy networking
var netParams = {
  "cidr": "10.101.0.0/24",
  "subnets": 4,
  "prefix": "qews"
};

awsNetwork.ddStart(netParams);
if (awsNetwork.pulumiResources.vpc == undefined) {
  console.log("resources not created");
} else {
  module.exports.vpcId = awsNetwork.pulumiResources.vpc.id
  module.exports.subnet0Id = awsNetwork.pulumiResources.subnet0.id
}

