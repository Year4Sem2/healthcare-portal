variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used as resource prefix"
  type        = string
  default     = "healthcare-portal"
}

# ── M2 additions ─────────────────────────────────────────
variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "portal"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "portaladmin"
}

variable "api_image_tag" {
  description = "Image tag for the migration/API image"
  type        = string
  default     = "latest"
}