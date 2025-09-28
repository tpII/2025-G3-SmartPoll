#ECR
ecr_repo_name    = "smp-repo"
cluster_name     = "smartpoll-cluster"
min_size         = 1
max_size         = 2
desired_capacity = 1
image_url     = "443370696756.dkr.ecr.us-east-1.amazonaws.com/smp-repo:latest"
service_name     = "smartpoll-service"
container_name   = "smartpoll-api"

# VPC
vpc_cidr             = "10.0.0.0/16"
private_subnets_cidr = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnets_cidr  = ["10.0.10.0/24", "10.0.11.0/24"]
vpc_az               = ["us-east-1a", "us-east-1b"]

# S3
s3_bucket_name = "smartpoll-bucket"

# RDS
db_name = "smartpoll_db"
db_username = "postgres"
db_password = "postgres"

#ELB
alb_certificate_arn            = "arn:aws:acm:us-east-1:443370696756:certificate/d0ce569e-a354-4560-8547-edae5b5e12cc"

cloudfront_certificate_arn = "arn:aws:acm:us-east-1:443370696756:certificate/765e3db9-516c-40ab-83d3-ad27efa35fce"
