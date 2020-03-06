provider "aws" {
  region = "us-east-2"
}

locals {
  cidr = "10.0.0.0/16"
}

module "vpc" {
  source = "./vpc"

  vpc_cidr = local.cidr

  subnets = {
    us-east-2a = cidrsubnet(local.cidr, 8, 1)
    us-east-2b = cidrsubnet(local.cidr, 8, 1)
    us-east-2c = cidrsubnet(local.cidr, 8, 1)
  }
}
