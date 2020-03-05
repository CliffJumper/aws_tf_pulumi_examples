provider "aws" {
    region = "us-east-2"
}

# Find the latest AMI fitting our parameters
data "aws_ami" "latest_ubuntu" {
    most_recent = true 
    owners = ["099720109477"] # Canonical's ID

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
      name = "name"
      values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }

}

# Create an instance, and launch a web server via the User Data
resource "aws_instance" "webserver" {
    ami = data.aws_ami.latest_ubuntu.id

    instance_type = "t2.micro"

    vpc_security_group_ids = [aws_security_group.instance.id]

    user_data = <<-EOF
        #!/bin/bash
        echo "Hello, world" >> index.html
        nohup busybox httpd -f -p 8080 &
        EOF

    tags = {
      Name = "terraform-example"
    }
}

# SG for the instance
resource "aws_security_group" "instance" {
    name = "terraform-example-instance-sg"

    ingress {
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # FROM https://www.terraform.io/docs/providers/aws/r/security_group.html
    # NOTE on Egress rules: By default, AWS creates an ALLOW ALL egress rule 
    # when creating a new Security Group inside of a VPC. When creating a new 
    # Security Group inside a VPC, Terraform will remove this default rule, and 
    # require you specifically re-create it if you desire that rule. We feel 
    # this leads to fewer surprises in terms of controlling your egress rules. 
    # If you desire this rule to be in place, you can use this egress block:
    egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    }
}