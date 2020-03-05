const awsInstance = require("./ec2");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function newInstance() {
  let keyMaterial;
  const keyFile = "./generic-keypair.pub";
  try {
    // check to see if we have a PEM key to log into the instance; if not, create one
    if (fs.existsSync(keyFile) === false) {
      const { stdout, stderr } = await exec('/usr/bin/ssh-keygen -N "" -f generic-keypair');
    }

    // Read key material
    keyMaterial = fs.readFileSync(keyFile, "utf8");

    // Define and Deploy ec2 instance
    var ec2Params = {
      // "amiId"   : "ami-0e38b48473ea57778",
      "keyMaterial": keyMaterial,
      "size": "t3.nano",
      "ports": [80, 22],
      "prefix": "qews",
    };
    awsInstance.ddStart(ec2Params);
  } catch (err) {
    console.error(err);
  }
}

newInstance();
module.exports.ec2Id = awsInstance.pulumiResources.server.id;
module.exports.ec2PublicIp = awsInstance.pulumiResources.server.publicIp;
module.exports.ec2KeyPair = awsInstance.pulumiResources.keypair.keyName;


