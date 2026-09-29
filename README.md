# Record Speed Mobile Application

## Local Setup

Install dependencies using npm.

```bash
$ npm install
```

### Populate .env

You will see an `.env.sample` file, ask for the needed credentials and fill it accordingly.

### Launch the app

Expo can launch the application in `Expo Go` with `npm run android` or `npm run ios` if you run the project on a mac. Alternatively, you can launch the application with `npm run android:native` or `npm run ios:native` to use native build (this could be needed for some features—for instance, Google SSO needs a native build in order to work).

#### Expo secrets
This project uses Expo secrets feature for storing Production-related sensitive values, which means there are some variables that need to be set beforehand through the `eas secret` API.. In addition to this, you should know that secrets are used through the `process.env` API, which means you can also search `process.env.` throughout the app and see all of the environment variables invokations. If you see some environment variable that is utilized and not listed here, please add it to this README. Here's a list of the secrets (you can also see them by running `eas secret:list`):
```
GOOGLE_SERVICES_JSON=
```


# Build & Deployment

Build and deployment is handled using EAS and explained in grater detail in [the wiki](https://github.com/ingenious-agency/record_speed_mobile/wiki/Build-&-Deployment).
