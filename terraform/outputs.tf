output "bucket_name" {
  description = "S3 bucket holding the frontend build"
  value       = module.frontend.bucket_name
}

output "cloudfront_url" {
  description = "Public HTTPS URL served by CloudFront"
  value       = module.frontend.cloudfront_url
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (used for cache invalidation)"
  value       = module.frontend.cloudfront_distribution_id
}

# ── M2 outputs ───────────────────────────────────────────

output "vpc_id" {
  value = module.networking.vpc_id
}

output "private_subnet_ids" {
  value = module.networking.private_subnet_ids
}

output "public_subnet_ids" {
  value = module.networking.public_subnet_ids
}

output "rds_endpoint" {
  value     = module.database.endpoint
  sensitive = true
}

output "rds_secret_arn" {
  value = module.database.secret_arn
}

output "phi_bucket_name" {
  value = module.storage.bucket_name
}

output "ecr_repository_url" {
  value = module.compute.ecr_repository_url
}

output "ecs_cluster_name" {
  value = module.compute.ecs_cluster_name
}

output "migrate_task_sg_id" {
  value = module.compute.task_sg_id
}