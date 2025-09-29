output "alb_tg_arn" {
  value = aws_lb_target_group.web_tg.arn
}

output "elb_security_groups_id" {
  value = [aws_security_group.allow_http.id, aws_security_group.allow_https.id]
}
