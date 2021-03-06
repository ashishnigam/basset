const mail = {
  host: process.env.MAIL_HOST || 'localhost',
  port: parseInt(process.env.MAIL_PORT) || 1025,
  username: process.env.MAIL_USERNAME || '',
  password: process.env.MAIL_PASSWORD || '',
  email: process.env.MAIL_EMAIL || 'hello@basset.io',
  useTLS: parseInt(process.env.MAIL_TLS) === 1,
  ses: parseInt(process.env.MAIL_USE_SES) === 1,
  sesConfig: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  },
};

const database = {
  client: process.env.DB_CLIENT || 'postgresql',
  connection: {
    host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
    port: process.env.RDS_PORT || process.env.DB_PORT || 5432,
    database: process.env.RDS_DB_NAME || process.env.DB_NAME || 'basset',
    user: process.env.RDS_USERNAME || process.env.DB_USERNAME,
    password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
    ssl: parseInt(process.env.DB_USE_SSL) === 1 || false,
  },
};

const secret = process.env.BASSET_SECRET;
const env = process.env.NODE_ENV;

const enforceSnapshotLimit = parseInt(process.env.ENFORCE_SNAPSHOT_LIMIT) === 1;
const enforceBuildRetention = parseInt(process.env.ENFORCE_BUILD_RENTETION) === 1;

const cors = {
  origin: process.env.BASSET_ORIGIN,
  credentials: true,
};

const oauth = {
  strategy: {
    github: {
      use: parseInt(process.env.OAUTH_GITHUB) === 1,
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    },
    bitbucket: {
      use: parseInt(process.env.OAUTH_BITBUCKET) === 1,
      clientId: process.env.OAUTH_BITBUCKET_CLIENT_ID,
      clientSecret: process.env.OAUTH_BITBUCKET_CLIENT_SECRET,
    },
    gitlab: {
      use: parseInt(process.env.OAUTH_GITLAB) === 1,
      clientId: process.env.OAUTH_GITLAB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITLAB_CLIENT_SECRET,
    },
  },
};

const site = {
  private: parseInt(process.env.BASSET_PRIVATE) === 1,
  url: process.env.BASSET_URL,
};

const s3 = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  assetsBucket: process.env.ASSETS_BUCKET,
  privateAssets: parseInt(process.env.PRIVATE_ASSETS) === 1,
  screenshotBucket: process.env.SCREENSHOT_BUCKET,
  privateScreenshots: parseInt(process.env.PRIVATE_SCREENSHOTS) === 1,
};

const sqs = {
  use: parseInt(process.env.USE_SQS) === 1,
  buildUrl: process.env.SQS_BUILD_QUEUE_URL,
  taskUrl: process.env.SQS_TASK_QUEUE_URL,
};

const awsBatch = {
  JobDefinition: process.env.AWS_BATCH_JOB_DEFINITION,
  jobQueue: process.env.AWS_BATCH_JOB_QUEUE,
};

const defaultBuildQueue = process.env.AMQP_BUILD_QUEUE;
const amqp = {
  use: parseInt(process.env.USE_SQS) !== 1,
  host: process.env.AMQP_HOST,
  buildQueue: {
    firefox: process.env.AMQP_FIREFOX_BUILD_QUEUE || defaultBuildQueue,
    chrome: process.env.AMQP_CHROME_BUILD_QUEUE || defaultBuildQueue,
    ie: process.env.AMQP_IE_BUILD_QUEUE || defaultBuildQueue,
    edge: process.env.AMQP_EDGE_BUILD_QUEUE || defaultBuildQueue,
  },
  taskQueue: process.env.AMQP_TASK_QUEUE,
};

const token = process.env.TOKEN;

const session = {
  useDB: parseInt(process.env.USE_DB_SESSION) === 1,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
};

const saml = {
  enabled: parseInt(process.env.SAML_ENABLED) === 1,
  config: {
    cert: process.env.SAML_CERT,
    entryPoint: process.env.SAML_ENTRY_POINT,
    issuer: process.env.SAML_ISSUER || 'basset-saml',
    authnContext: process.env.SAML_AUTHN_CONTEXT,
  },
  attributes: {
    displayName: process.env.SAML_ATTR_DISPLAY_NAME || 'displayName',
    profileImage: process.env.SAML_ATTR_PROFILE_IMAGE || 'profileImage',
    email: process.env.SAML_ATTR_EMAIL || 'email',
    id: process.env.SAML_ATTTR_ID || 'nameId',
  },
};

const header = {
  scripts: [],
};

const allowableBrowsers = {
  firefox: true,
  chrome: true,
  ie: parseInt(process.env.ENABLE_IE) === 1,
  edge: parseInt(process.env.ENABLE_EDGE) === 1,
};

module.exports = {
  mail,
  database,
  secret,
  cors,
  oauth,
  site,
  s3,
  amqp,
  token,
  env,
  sqs,
  awsBatch,
  session,
  saml,
  enforceSnapshotLimit,
  enforceBuildRetention,
  header,
  allowableBrowsers,
};
