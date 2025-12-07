variable "cluster_name" {}
variable "instance_type" { default = "t3.micro" }
variable "desired_capacity" { default = 1 }
variable "min_size" { default = 1 }
variable "max_size" { default = 2 }
variable "task_family" { default = "sp-task" }
variable "container_name" {}
variable "image_url" {}
variable "service_name" {}
variable "load_balancer_tg_arn" {}
variable "vpc_id" {}
variable "private_subnets_id" {}
variable "ec2_ecs_optimized_ami_id" {}
variable "elb_security_groups_id" {}
