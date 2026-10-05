# ── ECR ──────────────────────────────────────────────
resource "aws_ecr_repository" "migrations" {
  name                 = "${var.project_name}-migrations"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration { scan_on_push = true }
}

# ── ECS Cluster ──────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ── Security group for migration task ────────────────
resource "aws_security_group" "task" {
  name   = "${var.project_name}-migration-task-sg"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-migration-task-sg" }
}

resource "aws_security_group_rule" "task_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = var.db_sg_id
  source_security_group_id = aws_security_group.task.id
}

# ── IAM: execution role ──────────────────────────────
resource "aws_iam_role" "ecs_execution" {
  name = "${var.project_name}-ecs-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_managed" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  role = aws_iam_role.ecs_execution.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue", "kms:Decrypt"]
      Resource = [var.db_secret_arn, var.kms_key_arn]
    }]
  })
}

# ── IAM: task role ───────────────────────────────────
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-ecs-task"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

# ── CloudWatch log group ─────────────────────────────
resource "aws_cloudwatch_log_group" "migrations" {
  name              = "/ecs/${var.project_name}-migrations"
  retention_in_days = 30
}

# ── ECS task definition ──────────────────────────────
resource "aws_ecs_task_definition" "migrate" {
  family                   = "${var.project_name}-migrate"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "migrate"
    image     = "${aws_ecr_repository.migrations.repository_url}:${var.api_image_tag}"
    essential = true

    secrets = [
      { name = "DB_HOST",     valueFrom = "${var.db_secret_arn}:host::" },
      { name = "DB_USER",     valueFrom = "${var.db_secret_arn}:username::" },
      { name = "DB_PASSWORD", valueFrom = "${var.db_secret_arn}:password::" },
      { name = "DB_NAME",     valueFrom = "${var.db_secret_arn}:dbname::" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.migrations.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "migrate"
      }
    }
  }])
}