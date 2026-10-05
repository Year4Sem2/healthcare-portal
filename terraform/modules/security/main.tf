resource "aws_kms_key" "phi" {
  description             = "${var.project_name}-${var.environment} PHI encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = { Name = "${var.project_name}-phi-key" }
}

resource "aws_kms_alias" "phi" {
  name          = "alias/${var.project_name}-phi"
  target_key_id = aws_kms_key.phi.key_id
}