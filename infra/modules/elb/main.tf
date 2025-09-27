# Target group
resource "aws_lb_target_group" "web_tg" {
  name        = "${var.elb_name}-tg"
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
  slow_start  = 60

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}


resource "aws_lb" "web_lb" {
  name = var.elb_name

  internal                         = false
  load_balancer_type               = "application"
  subnets                          = var.public_subnets_id
  enable_deletion_protection       = false
  enable_cross_zone_load_balancing = var.cross_zone_load_balancing

  security_groups = var.elb_security_groups_id
}
