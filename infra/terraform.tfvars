#ECR
ecr_repo_name    = "smp-repo"
cluster_name     = "smartpoll-cluster"
min_size         = 1
max_size         = 2
desired_capacity = 1
image_url        = "datawire/hello-world"
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
