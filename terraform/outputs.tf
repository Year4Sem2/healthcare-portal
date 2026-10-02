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