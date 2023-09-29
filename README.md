# amazon-cognito-example

## Environment

```sh
node --version
  # v20.6.1
aws --version
  # aws-cli/2.13.19 Python/3.11.5 Linux/5.10.16.3-microsoft-standard-WSL2 exe/x86_64.debian.11 prompt/off
cdk --version
  # 2.96.2 (build 3edd240)
```

## Bootstrap

- deploys the CDK toolkit stack into an AWS environment

```sh
cdk bootstrap
```

## Deploy

- Deploys the stack(s) named STACKS into your AWS account

```sh
cdk deploy
```

## Destroy

- Destroy the stack(s) named STACKS

```sh
cdk destroy
```