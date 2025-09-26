resource "aws_ecr_repository" "my_repo" {
  name = var.ecr_repo_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.my_repo.repository_url
}
