variable "db_name" {}
variable "db_username" {}
variable "db_password" {}
variable "db_subnet_ids" {
  type = list(string)
}
variable "db_vpc_id" {}
variable "db_allowed_sg_id" {}
