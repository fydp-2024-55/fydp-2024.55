# Browser Extension

All commands and folders referenced in this README are relative to the `browser-extension/` directory of the repo.

## Requirements
[NodeJS](https://nodejs.org/en/download) version 16 or higher.

## Install dependencies
Run `yarn` to install dependencies.

## Run development server
Run `yarn start` to start development server on [http://localhost:3000](http://localhost:3000). Any changes to the code will cause the webpage to automatically reload.

## Load extension
Go to [chrome://extensions/](chrome://extensions/) and click "Load unpacked". Select the `/build/` directory to load the extension. The extension does not automatically reload when code changes.

## Open extension
Click extensions (puzzle icon) along the Chrome menu bar and click the "brownie" extension to open it.

## Reload extension
Go to [chrome://extensions/](chrome://extensions/) and click the reload button for the brownie extension to reload. This is required to update the extension with any code changes.
