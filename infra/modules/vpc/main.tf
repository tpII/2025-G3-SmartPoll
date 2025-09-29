resource "aws_vpc" "smartpoll_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "smartpoll-vpc"
  }
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id     = aws_vpc.smartpoll_vpc.id
  cidr_block = var.private_subnets_cidr[0]

  availability_zone = var.vpc_az[0]
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id     = aws_vpc.smartpoll_vpc.id
  cidr_block = var.private_subnets_cidr[1]

  availability_zone = var.vpc_az[1]
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id     = aws_vpc.smartpoll_vpc.id
  cidr_block = var.public_subnets_cidr[0]

  availability_zone = var.vpc_az[0]
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id     = aws_vpc.smartpoll_vpc.id
  cidr_block = var.public_subnets_cidr[1]

  availability_zone = var.vpc_az[1]
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.smartpoll_vpc.id

  tags = {
    Name = "smartpoll_igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.smartpoll_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public_rt"
  }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.smartpoll_vpc.id

  tags = {
    Name = "private_rt"
  }
}

resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "private_subnet_1_association" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_subnet_2_association" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_rt.id
}

