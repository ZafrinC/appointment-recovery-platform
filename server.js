const env = require("./src/config/env");
const app = require("./src/app");

app.listen(env.port, () => {
  console.log(
    `${env.appName} is running in ${env.nodeEnv} mode on port ${env.port} at ${env.appUrl}`,
  );
});
