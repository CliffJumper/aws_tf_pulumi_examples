const AWS = require('aws-sdk');
const unittest = false;

if (unittest) {
  process.env['AWS_SDK_LOAD_CONFIG'] = "true"
  process.env['AWS_PROFILE'] = "assume-role-profile"
  var credentials = new AWS.SharedIniFileCredentials({ profile: "admin" });
  AWS.config.credentials = credentials;
  AWS.config.region = "us-east-2";
}

const ec2 = new AWS.EC2();

async function cidrUsed(cidrstr) {
  let checkDone = false;
  try {
    vpcList = await ec2.describeVpcs({}).promise();
    vpcList.Vpcs.forEach((vpc) => {
      if (!checkDone) {
        if (vpc.CidrBlock == cidrstr) {
          checkDone = true;
          console.log("found", checkDone, vpc.CidrBlock);
        }
      }
    });
    console.log("done looping");
  } catch (err) {
    console.error("Ugh - getting vpc info didn't work", err);
  }
  return (checkDone);
}

if (unittest) {
  cidrUsed("172.131.0.0/16").then(x => {
    console.log("return value", x);
  });
}
module.exports.cidrUsed = cidrUsed;

