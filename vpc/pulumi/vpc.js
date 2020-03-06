"use strict";
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const cidrMath = require("./utilCidr");
const envCheck = require("./envcheck.js");

// Default module values
let modConfig = {
  "cidr"       : "10.200.10.0/24",
  "subnets"    : 2,
  "prefix"     : "qe",
  "subnetCidrs" : []
};
let rsrcPulumiNetwork = {};
const azList = pulumi.output(aws.getAvailabilityZones({}));

// ****************************************************************************
// Configure module
// ****************************************************************************
function setModuleConfig(parm) {
  if (parm !== undefined) {
    if (parm.cidr !== undefined) {
      modConfig.cidr = parm.cidr;
    }
    if (parm.subnets !== undefined) {
      modConfig.subnets = parm.subnets;
    }
    if (parm.prefix !== undefined) {
      modConfig.prefix = parm.prefix;
    }
    let targetSubnetSize = parseInt(modConfig.cidr.split("/")[1])+Math.ceil(Math.log2(modConfig.subnets));
    modConfig.subnetCidrs = cidrMath.getSubnetCidrs(targetSubnetSize, modConfig.cidr);        
  }
}

// ****************************************************************************
// Create resources
// ****************************************************************************
function rsrcPulumiCreate() {
  rsrcPulumiNetwork.vpc = new aws.ec2.Vpc(modConfig.prefix+"NetworkVPC", {
    cidrBlock: modConfig.cidr,
    tags: {Name: modConfig.prefix+"NetworkVPC"}
  });
  
  rsrcPulumiNetwork.gw = new aws.ec2.InternetGateway(modConfig.prefix+"NetworkIGW", {
    tags:{Name:modConfig.prefix+"NetworkIGW"},
    vpcId: rsrcPulumiNetwork.vpc.id
  });
  
  rsrcPulumiNetwork.routeTable = new aws.ec2.RouteTable(modConfig.prefix+"NetworkRouteTable",{
    vpcId:rsrcPulumiNetwork.vpc.id,
    tags:{Name:modConfig.prefix+"NetworkRouteTable"}
  });
  
  rsrcPulumiNetwork.route = new aws.ec2.Route(modConfig.prefix+"NetworkRoute", {
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: rsrcPulumiNetwork.gw.id,
    routeTableId: rsrcPulumiNetwork.routeTable.id
  });
  
  for (let i=0; i<modConfig.subnets; i++) {
    rsrcPulumiNetwork["subnet"+i] = new aws.ec2.Subnet(modConfig.prefix+"NetworkSubnet"+i, {
      cidrBlock: modConfig.subnetCidrs[i],
      availabilityZone: azList.apply(available => available.names[(i%available.names.length)]),
      tags: {Name:modConfig.prefix+"NetworkSubnet"+i},
      vpcId: rsrcPulumiNetwork.vpc.id
    });

    rsrcPulumiNetwork.routeTableAssociation = new aws.ec2.RouteTableAssociation(modConfig.prefix+"NetworkRouteTableAssoc"+i, {
      routeTableId: rsrcPulumiNetwork.routeTable.id,
      subnetId: rsrcPulumiNetwork["subnet"+i].id,
    });
  }
}

// ****************************************************************************
// API into this module
// ****************************************************************************
function ddStart(params) {
  setModuleConfig(params);
  envCheck.cidrUsed(params.cidr).then((used) => {
    if (!used) {
      rsrcPulumiCreate();
    } else {
      console.log("cidr already in use");
    }
  });
  // rsrcPulumiCreate();
}

module.exports.ddStart = ddStart;
module.exports.pulumiResources = rsrcPulumiNetwork;
module.exports.allRsrcs = pulumi.all;
