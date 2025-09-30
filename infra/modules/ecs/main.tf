resource "aws_ecs_cluster" "this" {
  name = var.cluster_name
}

# instance profile used by the ECS agent. Used by the ECS agent on the EC2 instances. Make calls to ECS, ECR, Cloudwatch, etc.
data "aws_iam_policy_document" "ecs_instance_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_instance_role" {
  name               = "${var.cluster_name}-ecs-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_instance_assume.json
}

resource "aws_iam_instance_profile" "ecs" {
  name = "${var.cluster_name}-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

# Attach AmazonEC2ContainerServiceforEC2Role managed policy.
resource "aws_iam_role_policy_attachment" "ecs_instance_policy" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# Launch template for the EC2 instances.
resource "aws_launch_template" "ecs_nodes" {
  name_prefix            = "${var.cluster_name}-lt-"
  image_id               = var.ec2_ecs_optimized_ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.allow_http_ecs.id, aws_security_group.allow_from_alb.id]

  block_device_mappings {
    device_name = "/dev/sdf"

    ebs {
      volume_size = 30
      volume_type = "gp3" # free tier eligible
    }
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs.name
  }

  # add the instance to the cluster
  user_data = base64encode(<<EOF
    #!/bin/bash
    echo ECS_CLUSTER=${aws_ecs_cluster.this.name} >> /etc/ecs/ecs.config
    EOF
  )
}

resource "aws_autoscaling_group" "ecs_asg" {
  desired_capacity    = var.desired_capacity
  max_size            = var.desired_capacity
  min_size            = var.desired_capacity
  vpc_zone_identifier = var.private_subnets_id

  launch_template {
    id      = aws_launch_template.ecs_nodes.id
    version = "$Latest"
  }
}

# set the ASG as a capacity provider for the cluster
resource "aws_ecs_capacity_provider" "this" {
  name = "${var.cluster_name}-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs_asg.arn
    managed_termination_protection = "DISABLED"
  }
}

# associate the capacity provider with the cluster
resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = [aws_ecs_capacity_provider.this.name]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.this.name
    weight            = 1
  }
}

# task definition
resource "aws_ecs_task_definition" "this" {
  family                   = var.task_family
  requires_compatibilities = ["EC2"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "768"

  container_definitions = jsonencode([
    {
      name      = var.container_name
      image     = var.image_url
      cpu       = 256
      memory    = 768
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
    }
  ])
}

resource "aws_security_group" "allow_from_alb" {
  name        = "allow_from_alb"
  description = "Security group to allow all inbound and outbound traffic"
  vpc_id      = var.vpc_id

  ingress {
    security_groups = var.elb_security_groups_id
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
  }

  egress {
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    to_port     = 0
    from_port   = 0
  }
}

resource "aws_security_group" "allow_http_ecs"{
  name        = "allow_http_ecs"
  description = "Security group to allow HTTP traffic"
  vpc_id      = var.vpc_id

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }

  egress {
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    to_port     = 0
    from_port   = 0
  }
}

resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = var.load_balancer_tg_arn
    container_name   = var.container_name
    container_port   = 8080
  }

  network_configuration {
    subnets          = var.private_subnets_id
    security_groups  = [aws_security_group.allow_from_alb.id]
    assign_public_ip = false
  }
}
