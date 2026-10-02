terraform {
  backend "s3" {
    bucket       = "healthcare-portal-tfstate-2026"
    key          = "dev/frontend/terraform.tfstate"
    region       = "ap-southeast-1"
    use_lockfile = true
    encrypt      = true
  }
}