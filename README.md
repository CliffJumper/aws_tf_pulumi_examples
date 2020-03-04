# aws_tf_pulumi_examples
Some Basic examples of using Terraform or Pulumi to deploy AWS infra

## Layout

```
ec2 : Examples for creating instances
 |_ terraform : Terraform example
 |_ pulumi    : Pulumi example

vpc : Examples for creating networking
 |_ terraform : Terraform example
     |_ tf_11 : Example using terraform 0.11
     |_ tf_12 : Example using terraform 0.12
 |_ pulumi    : Pulumi example
``` 

## Notes:

For the terraform code .terraform-version files are in place, so use [tfenv](https://github.com/tfutils/tfenv)
