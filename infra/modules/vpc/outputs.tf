output "vpc_id" {
  value = aws_vpc.smartpoll_vpc.id
}

output "public_subnets_id" {
  value = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

output "private_subnets_id" {
  value = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

output "security_groups_id" {
  value = [aws_security_group.allow_http.id]
}
