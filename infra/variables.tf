#ECR
variable "ecr_repo_name" {
  description = "The name of the ECR repository"
  type        = string
  default     = "smartpoll-repo"
}

#ECS
variable "ec2_ecs_optimized_ami_id" {
  description = "The AMI ID for the ECS optimized EC2 instance"
  type        = string
  default     = "ami-09bf79a39d1ad39b5"
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "sp-cluster"
}

variable "min_size" {
  description = "Minimum number of instances in the ECS cluster"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of instances in the ECS cluster"
  type        = number
  default     = 2
}

variable "desired_capacity" {
  description = "Desired number of instances in the ECS cluster"
  type        = number
  default     = 1
}

variable "image_url" {
  description = "Docker image URL"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the ECS cluster"
  type        = string
  default     = "t3.micro"
}
variable "service_name" {
  description = "Name of the ECS service"
  type        = string
  default     = "sp-service"
}

variable "container_name" {
  description = "Name of the container"
  type        = string
  default     = "sp-api"
}

# VPC
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnets_cidr" {
  description = "CIDR block for the private subnet"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets_cidr" {
  description = "CIDR block for the public subnet"
  type        = list(any)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "vpc_az" {
  description = "Availability Zone for the private subnet"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

#S3
variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

# ALB
variable "elb_name" {
  description = "Name of the ELB"
  type        = string
  default     = "sp-alb"
}

variable "cross_zone_load_balancing" {
  description = "Enable cross-zone load balancing"
  type        = bool
  default     = true
}

# RDS
variable "db_name" {
  description = "Name of the RDS database"
  type        = string
  default     = "smartpoll_db"
}

variable "db_username" {
  description = "Username for the RDS database"
  type        = string
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}
