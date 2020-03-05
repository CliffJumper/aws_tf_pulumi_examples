const awsInstance = require("./ec2");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

let keyMaterial;
const keyFile = "./generic-keypair.pub";
try {
  // check to see if we have a PEM key to log into the instance; if not, create one
  if (fs.existsSync(keyFile) === false) {
    const { stdout, stderr } = await exec('ssh-keygen -f generic-keypair');
  }

  // Read key material
  keyMaterial = fs.readFileSync(keyFile, "utf8");

  // Define and Deploy ec2 instance
  var ec2Params = {
    //  "amiId"   : "ami-0e38b48473ea57778",
    "amiId": "",
    "keyMaterial": keyMaterial,
    "size": "t3.nano",
    "ports": [80, 22],
    "prefix": "qews",
    "userData":
      `#!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    usermod -a -G apache ec2-user
    chown -R ec2-user:apache /var/www
    chmod 2775 /var/www
    find /var/www -type d -exec chmod 2775 {} \;
    find /var/www -type f -exec chmod 0664 {} \;
    echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php
    `
  };
  awsInstance.ddStart(ec2Params);
} catch (err) {
  console.error(err);
}


