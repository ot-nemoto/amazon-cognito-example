# amazon-cognito-example

- Amazon Cognito で外部プロバイダーと接続するサンプル
- 対応プロバイダ
  - Okta
  - Kuroco

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

- Configulation SAML IdP

```sh
cdk deploy \
    -c okta-metadata-url=<okta-metadata-url> \
    -c kuroco-metadata-file=<kuroco-metadata-file>
```

### parameter

|KEY|DESCRIPTION|DEFAULT|
|--|--|--|
|user_pool_name|UserPool名を指定する|`example-user-pool`|
|okta-metadata-url|Okta(SAML Idp)のメタデータURLを指定する|-|
|okta-metadata-file|Okta(SAML Idp)のメタデータのファイルパスを指定する<br>**okta-metadata-url** の指定を優先|-|
|kuroco-metadata-url|Kuroco(SAML Idp)のメタデータURLを指定する|-|
|kuroco-metadata-file|Kuroco(SAML Idp)のメタデータのファイルパスを指定する<br>**kuroco-metadata-url** の指定を優先|-|

## Destroy

- Destroy the stack(s) named STACKS

```sh
cdk destroy
```