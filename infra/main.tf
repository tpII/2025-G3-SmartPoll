module "vpc" {
  source               = "./modules/vpc"
  vpc_cidr             = var.vpc_cidr
  private_subnets_cidr = var.private_subnets_cidr
  public_subnets_cidr  = var.public_subnets_cidr
  vpc_az               = var.vpc_az
}

module "ecr" {
  source        = "./modules/ecr"
  ecr_repo_name = var.ecr_repo_name
}

# moved {
#   from = aws_s3_bucket.smartpoll_bucket
#   to   = module.s3.aws_s3_bucket.smartpoll_bucket
# }

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.s3_bucket_name
}

module "cloudfront" {
  source                = "./modules/cloudfront"
  s3_bucket_arn         = module.s3.s3_bucket_arn
  s3_bucket_id          = module.s3.s3_bucket_id
  s3_bucket_website_endpoint = module.s3.s3_bucket_website_endpoint
  s3_bucket_regional_domain_name = module.s3.s3_bucket_regional_domain_name
}

module "fck-nat" {
  source = "git::https://github.com/RaJiska/terraform-aws-fck-nat.git"

  name                 = "my-fck-nat"
  vpc_id               = module.vpc.vpc_id
  subnet_id            = module.vpc.public_subnets_id[0]

  update_route_tables = true
  route_tables_ids = {
    "private_rt" = module.vpc.private_route_table_id
  }
}

# module "ecs" {
#   source                         = "./modules/ecs"
#   container_name                 = var.container_name
#   cluster_name                   = var.cluster_name
#   instance_type                  = var.instance_type
#   desired_capacity               = var.desired_capacity
#   min_size                       = var.min_size
#   max_size                       = var.max_size
#   image_url                      = var.image_url
#   service_name                   = var.service_name
#   load_balancer_tg_arn           = module.elb.alb_tg_arn
#   vpc_id                         = module.vpc.vpc_id
#   private_subnets_id             = module.vpc.private_subnets_id
#   ec2_ecs_optimized_ami_id       = var.ec2_ecs_optimized_ami_id
#   elb_security_group_id          = module.elb.elb_security_group_id
#   ec2_instance_security_group_id = module.vpc.security_groups_id[0]
# }
#
# module "elb" {
#   source                    = "./modules/elb"
#   elb_name                  = var.elb_name
#   vpc_id                    = module.vpc.vpc_id
#   cross_zone_load_balancing = var.cross_zone_load_balancing
#   public_subnets_id         = module.vpc.public_subnets_id
#   elb_security_groups_id    = module.vpc.security_groups_id
# }
