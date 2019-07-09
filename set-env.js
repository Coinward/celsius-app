// copies app.json from celsius-creds repo

const fs = require('fs');
const path = require('path');

const { CONFIG, DIRECTORY_PATH } = process.env;
const ALL_CONFIGS = {
  DEV: 'DEV',
  STAGING: 'STAGING',
  TEST: 'TEST',
  PREPROD: 'PREPROD',
  PRODUCTION: 'PRODUCTION'
};

if (Object.keys(ALL_CONFIGS).indexOf(CONFIG) !== -1) {
  copyFileFromCelsiusCreds('app.json')
  copyFileFromCelsiusCreds('google-services.json')
  copyFileFromCelsiusCreds('build_android.sh')
  copyFileFromCelsiusCreds('celsius.jks')
  copyFileFromCelsiusCreds('constants.js')
  // eslint-disable-next-line no-console
  console.log(`Created app.json for ${CONFIG} environment successfully`);
  return true;
}

// eslint-disable-next-line no-console
console.log(`Plese specify correct CONFIG variable, one of ${ Object.keys(ALL_CONFIGS).join(', ') }`);
return false;

function copyFileFromCelsiusCreds(pathToFile) {
  let src;
  const dest = path.resolve(__dirname, pathToFile);
  const directoryPath = DIRECTORY_PATH || '../celsius-creds'

  switch (CONFIG) {
    case ALL_CONFIGS.STAGING:
      src = path.resolve(__dirname, `${directoryPath}/staging/celsius-app/${pathToFile}`);
      break;
    case ALL_CONFIGS.TEST:
      src = path.resolve(__dirname, `${directoryPath}/test/celsius-app/${pathToFile}`);
      break;
    case ALL_CONFIGS.PREPROD:
      src = path.resolve(__dirname, `${directoryPath}/pre-prod/celsius-app/${pathToFile}`);
      break;
    case ALL_CONFIGS.PRODUCTION:
      src = path.resolve(__dirname, `${directoryPath}/production/celsius-app/${pathToFile}`);
      break;
    case ALL_CONFIGS.DEV:
    default:
      src = path.resolve(__dirname, `${directoryPath}/dev/celsius-app/${pathToFile}`);
  }

  if (!fs.existsSync(src)) {
    // eslint-disable-next-line no-console
    console.log(`${src} doesn't exist`);
    return false;
  }

  const data = fs.readFileSync(src, 'utf-8');
  fs.writeFileSync(dest, data);
}