const awsNetwork = require("./vpc");
const envCheck = require("./envcheck.js");

// Define and Deploy networking
var netParams = {
  "cidr": "10.100.0.0/24",
  "subnets": 4,
  "prefix": "qews"
};

envCheck.cidrUsed(netParams.cidr).then((used) => {
  if (!used) {
    console.log("cidr available");
  } else {
    console.log("cidr already in use");
  }
});

awsNetwork.ddStart(netParams);

// Exporting modules is a very awkward way to implement the OUTPUTs feature
module.exports.vpcId = awsNetwork.pulumiResources.vpc.id
module.exports.subnet0Id = awsNetwork.pulumiResources.subnet0.id
