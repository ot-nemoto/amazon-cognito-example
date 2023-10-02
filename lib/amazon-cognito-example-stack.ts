import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

const app = new cdk.App();
const userPoolName = app.node.tryGetContext("user_pool_name") || 'example-user-pool';
const supported_idp = [
  'okta',
];

export class AmazonCognitoExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // UserPool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: userPoolName,
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // UserPoolDomain
    const userPoolDomain = userPool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix: userPoolName,
      },
    });

    // UserPoolClient
    const userPoolClient = userPool.addClient('Client', {
      userPoolClientName: `${userPoolName}-client`,
      generateSecret: false,
      enableTokenRevocation: true,
      preventUserExistenceErrors: true,
      authFlows: {
        custom: false,
        userPassword: false,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
        },
        callbackUrls: [
          'https://www.google.com/',
        ],
        logoutUrls: [],
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PHONE,
        ],
      },
    });

    // UserPoolIdentityProviderSaml
    supported_idp.forEach(idpName => {
      if (!app.node.tryGetContext(`${idpName}-metadata-url`)) {
        return;
      }

      const userPoolIdentityProviderSaml = new cognito.UserPoolIdentityProviderSaml(this, `UserPoolIdentityProviderSaml_${idpName}`, {
        metadata: cognito.UserPoolIdentityProviderSamlMetadata.url(app.node.tryGetContext(`${idpName}-metadata-url`)),
        userPool: userPool,
        attributeMapping: {
          email: cognito.ProviderAttribute.other('email'),
          familyName: cognito.ProviderAttribute.other('lastname'),
          givenName: cognito.ProviderAttribute.other('firstname'),
        },
        identifiers: [`${idpName}`],
        idpSignout: false,
        name: `${idpName}`,
      });

      const userPoolClient = userPool.addClient(`Client_${idpName}`, {
        userPoolClientName: `${userPoolName}-${idpName}-client`,
        generateSecret: false,
        enableTokenRevocation: true,
        preventUserExistenceErrors: true,
        authFlows: {
          custom: false,
          userPassword: false,
          userSrp: true,
        },
        oAuth: {
          flows: {
            authorizationCodeGrant: true,
            implicitCodeGrant: false,
          },
          callbackUrls: [
            'https://www.google.com/',
          ],
          logoutUrls: [],
          scopes: [
            cognito.OAuthScope.EMAIL,
            cognito.OAuthScope.OPENID,
            cognito.OAuthScope.PHONE,
          ],
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
          cognito.UserPoolClientIdentityProvider.custom(`${idpName}`),
        ],
      });

      userPoolClient.node.addDependency(userPoolIdentityProviderSaml);
    });
  }
}
