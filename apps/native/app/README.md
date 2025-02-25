# Ísland.is App

This is the native app Ísland.is for iOS and Android.

## Installation

```bash
yarn install
bundle install
npx pod-install
```

### Building for iOS

```bash
yarn run ios
```

### Building for Android

```bash
yarn run android
```

### Start development server

```
yarn start
```

### Publishing a Beta

```bash
yarn run beta
```

### After release

Make sure to increment the version of the app by running `yarn run version:increment` and commit the changes.

```bash
yarn run version:increment
```

## NX commands

NX command example to proxy arguments to `package.json` scripts

```bash
nx run native-app:script --name=<some-script-from-package.json>
```

```bash
nx run native-app:codegen/frontend-client
```

## NOTES

- ci jobs
  - codegen
  - lint
  - build
  - test
