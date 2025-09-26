output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "security_group_id" {
  value = aws_security_group.allow_from_alb.id
}
