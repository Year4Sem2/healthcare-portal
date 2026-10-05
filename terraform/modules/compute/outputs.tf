output "ecr_repository_url" { value = aws_ecr_repository.migrations.repository_url }
output "ecs_cluster_name"   { value = aws_ecs_cluster.main.name }
output "task_sg_id"         { value = aws_security_group.task.id }
output "log_group_name"     { value = aws_cloudwatch_log_group.migrations.name }