variable "project_name"  { type = string }
variable "environment"   { type = string }
variable "vpc_id"        { type = string }
variable "aws_region"    { type = string }
variable "db_sg_id"      { type = string }
variable "db_secret_arn" { type = string }
variable "kms_key_arn"   { type = string }
variable "api_image_tag" { type = string }
variable "public_subnet_ids"  { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "jwt_secret" {
  type      = string
  sensitive = true
}