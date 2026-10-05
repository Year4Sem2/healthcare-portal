module "frontend" {
  source = "./modules/frontend"

  project_name = var.project_name
  environment  = var.environment
}

# ── M2: Backend infrastructure ───────────────────────────

module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
  vpc_cidr     = var.vpc_cidr
}

module "security" {
  source       = "./modules/security"
  project_name = var.project_name
  environment  = var.environment
}

module "database" {
  source              = "./modules/database"
  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.networking.vpc_id
  vpc_cidr            = module.networking.vpc_cidr
  isolated_subnet_ids = module.networking.isolated_subnet_ids
  db_instance_class   = var.db_instance_class
  db_name             = var.db_name
  db_username         = var.db_username
  kms_key_arn         = module.security.kms_key_arn
}

module "storage" {
  source       = "./modules/storage"
  project_name = var.project_name
  environment  = var.environment
  kms_key_arn  = module.security.kms_key_arn
}

module "compute" {
  source       = "./modules/compute"
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.networking.vpc_id
  aws_region   = var.aws_region
  db_sg_id     = module.database.db_sg_id
  db_secret_arn = module.database.secret_arn
  kms_key_arn  = module.security.kms_key_arn
  api_image_tag = var.api_image_tag
}