import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class AmazonCognitoExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // UserPool
    const UserPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'sample-users',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      // standardAttributes: {
      //   givenName: { required: true },
      //   familyName: { required: true },
      // },
      // customAttributes: { // カスタム属性設定
      //   'family_name_kana': new cognito.StringAttribute({ minLen: 1, maxLen: 256, mutable: true }),
      //   'given_name_kana': new cognito.StringAttribute({ minLen: 1, maxLen: 256, mutable: true }),
      // },
      // passwordPolicy: { // 設定しない場合はコンソールの場合と同じデフォルト設定
      //   minLength: 10,
      //   requireLowercase: false,
      //   requireUppercase: false,
      //   requireDigits: false,
      //   requireSymbols: false,
      //   tempPasswordValidity: cdk.Duration.days(7),
      // },
      // lambdaTriggers: {
      //   postConfirmation: sample_fn, // 今回は登録確認後のトリガー設定　他も有り
      // },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /*
    // Application Client
    UserPool.addClient('Application', {
      userPoolClientName: 'application', // クライアント名
      generateSecret: false, // シークレットの作成設定
      enableTokenRevocation: true, // 高度な認証設定のトークンの取り消しを有効化
      preventUserExistenceErrors: true, // 高度な認証設定のユーザー存在エラーの防止を有効化
      oAuth: {
        flows: { // OAuth 付与タイプ設定
          authorizationCodeGrant: true, // 認証コード付与
          implicitCodeGrant: true, // 暗黙的な付与
        },
        callbackUrls: [ // 許可されているコールバックURL設定
          'https://sample.com/app',
          'https://oauth.pstmn.io/v1/callback', // ポストマンアプリ用
        ],
        logoutUrls: [ // 許可されているサインアウトURL設定
          'https://sample.com/app',
        ],
        scopes: [ // カスタムスコープ
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PHONE,
          cognito.OAuthScope.PROFILE,
        ],
      }
    });
    */
  }
}
