import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as fs from 'fs';

const app = new cdk.App();
const userPoolName = app.node.tryGetContext("user_pool_name") || 'example-user-pool';
const supported_idp = [
  'okta',
  'kuroco',
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

    supported_idp.forEach(idpName => {
      // UserPoolIdentityProviderSamlMetadata
      let metadata = undefined;
      if (app.node.tryGetContext(`${idpName}-metadata-url`)) {
        metadata = cognito.UserPoolIdentityProviderSamlMetadata.url(app.node.tryGetContext(`${idpName}-metadata-url`));
      } else if (app.node.tryGetContext(`${idpName}-metadata-file`)) {
        let fileContent = fs.readFileSync(app.node.tryGetContext(`${idpName}-metadata-file`), 'utf8');
        metadata = cognito.UserPoolIdentityProviderSamlMetadata.file(fileContent);
      } else {
        return;
      }

      // UserPoolIdentityProviderSaml
      let userPoolIdentityProviderSaml = new cognito.UserPoolIdentityProviderSaml(this, `UserPoolIdentityProviderSaml_${idpName}`, {
        metadata: metadata,
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

      // UserPoolClient
      let userPoolClient = userPool.addClient(`Client_${idpName}`, {
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
