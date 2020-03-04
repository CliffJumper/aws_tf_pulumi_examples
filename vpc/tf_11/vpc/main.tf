resource "aws_vpc" "main" {
  cidr_block = "${var.vpc_cidr}"

  tags = {
    Name = "main"
  }
}

resource "aws_subnet" "public_subnet" {
  count = "${length(var.subnets)}"

  vpc_id                  = "${aws_vpc.main.id}"
  cidr_block              = "${element(values(var.subnets), count.index)}"
  map_public_ip_on_launch = true
  availability_zone       = "${element(keys(var.subnets), count.index)}"
}
