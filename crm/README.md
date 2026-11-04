# RecordSpeed CRM (staff iPhone app)

The RecordSpeed team's app: the sales CRM (pipeline, accounts, deals, follow-ups, reports, website demo requests)
and the team's projects, which live in Asana. It uses the same API and the same staff accounts as the staff portal
(portal.recordspeed.com/staff), so a change in either shows in the other. Patients never use it.

It's its own Expo app (bundle ID `com.recordspeed.crm`), separate from the patient app in the folder above, with its own
dependencies, App Store listing and EAS project. The patient app's build ignores this folder.

## Run it

    cd crm
    npm install
    npx expo start            # scan the QR code with Expo Go, or press i for the iOS simulator

Against a local API: `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000 npx expo start`.

## First App Store build

    npm install -g eas-cli
    eas login                 # Expo account: aseeras
    eas init                  # creates the EAS project and adds its id to app.config.js
    eas build -p ios --profile production
    eas submit -p ios         # sends it to App Store Connect (team G3A4C87SVV)

Before the first submit, create the app in App Store Connect: My Apps → + → New App, platform iOS, name
"RecordSpeed CRM", bundle ID `com.recordspeed.crm`. Then invite the team in TestFlight (internal testing), so it stays
private to RecordSpeed staff. Publishing it publicly isn't needed.

## Signing in

Staff accounts only (made with `bin/rails staff:add` on the API). Two-step sign-in: on the first sign-in, "Add to
Passwords / authenticator" hands the setup to Apple Passwords, or type the setup key into any authenticator app.
