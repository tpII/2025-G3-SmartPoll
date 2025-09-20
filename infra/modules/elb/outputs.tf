output "alb_tg_arn" {
  value = aws_lb_target_group.web_tg.arn
}

output "elb_security_group_id" {
  value = aws_lb.web_lb.security_groups
}
