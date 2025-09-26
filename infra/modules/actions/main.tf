data "aws_iam_policy_document" "frontend_cicd_policy" {
  statement {
    sid    = "AllowGithubActionsCICD"
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]

    resources = [
      "${var.s3_bucket_arn}",
      "${var.s3_bucket_arn}/*",
    ]

  }
}

data "aws_iam_policy_document" "cloudfront_invalidation_policy" {
  statement {
    sid    = "AllowCloudFrontInvalidation"
    effect = "Allow"

    actions = [
      "cloudfront:CreateInvalidation",
    ]

    resources = [
      "${var.cloudfront_distribution_arn}"
    ]
  }
}


data "aws_iam_policy_document" "backend_cicd_policy" {
  statement {
    sid    = "AllowECRActions"
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
    ]

    resources = ["*"]

  }
}

data "aws_iam_policy_document" "ecs_cicd_policy" {
  statement {

    sid    = "AllowECSActions"
    effect = "Allow"
    actions = [
      "ecs:DescribeTaskDefinition",
      "ecs:RegisterTaskDefinition",
      "ecs:UpdateService",
      "ecs:DescribeServices",
    ]
    resources = ["*"]
  }
}


# create iam user with this policy and give its credentials to github actions secrets

resource "aws_iam_user" "cicd_user" {
  name = "cicd-user"
}

resource "aws_iam_user_policy" "cicd_user_policy" {
  name   = "cicd-user-policy"
  user   = aws_iam_user.cicd_user.name
  policy = data.aws_iam_policy_document.frontend_cicd_policy.json
}

resource "aws_iam_user_policy" "cloudfront_invalidation_user_policy" {
  name   = "cloudfront-invalidation-user-policy"
  user   = aws_iam_user.cicd_user.name
  policy = data.aws_iam_policy_document.cloudfront_invalidation_policy.json
}

resource "aws_iam_user_policy" "ecs_cicd_user_policy" {
  name   = "ecs-cicd-user-policy"
  user   = aws_iam_user.cicd_user.name
  policy = data.aws_iam_policy_document.ecs_cicd_policy.json
}

resource "aws_iam_user_policy" "backend_cicd_user_policy" {
  name   = "backend-cicd-user-policy"
  user   = aws_iam_user.cicd_user.name
  policy = data.aws_iam_policy_document.backend_cicd_policy.json
}

resource "aws_iam_access_key" "cicd_user_access_key" {
  user = aws_iam_user.cicd_user.name

  depends_on = [aws_iam_user_policy.cicd_user_policy, aws_iam_user_policy.backend_cicd_user_policy]
}

output "cicd_user_access_key_id" {
  value       = aws_iam_access_key.cicd_user_access_key.id
  description = "Access Key ID for the CICD user"
}

output "cicd_user_secret_access_key" {
  value       = aws_iam_access_key.cicd_user_access_key.secret
  description = "Secret Access Key for the CICD user"
  sensitive   = true
}
