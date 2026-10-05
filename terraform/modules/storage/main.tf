resource "random_id" "phi" {
  byte_length = 4
}

resource "aws_s3_bucket" "phi" {
  bucket        = "${var.project_name}-phi-${var.environment}-${random_id.phi.hex}"
  force_destroy = true

  tags = { Name = "${var.project_name}-phi" }
}

resource "aws_s3_bucket_public_access_block" "phi" {
  bucket                  = aws_s3_bucket.phi.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "phi" {
  bucket = aws_s3_bucket.phi.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "phi" {
  bucket = aws_s3_bucket.phi.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_policy" "phi" {
  bucket = aws_s3_bucket.phi.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyNonTLS"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = ["${aws_s3_bucket.phi.arn}/*", aws_s3_bucket.phi.arn]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })
}