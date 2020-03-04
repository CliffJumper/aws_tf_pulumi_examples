provider "aws" {
  region = "us-east-2"
}

module "vpc" {
  source = "./vpc"

  vpc_cidr = "10.0.0.0/16"

  subnets = {
    us-east-2a = "10.0.1.0/24"
    us-east-2b = "10.0.2.0/24"
    us-east-2c = "10.0.3.0/24"
  }
}
