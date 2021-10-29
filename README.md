### Overview

This is the Property micro-frontend for the MTFH project.
This app is not intended to be run in isolation in production, but managed through it's [root app](https://github.com/LBHackney-IT/mtfh-frontend-root).

### Running it locally

You can either run this application in standalone mode or inside the single SPA "root" application that provides the header and footer.

-   Install all dependencies by running `yarn`.
-   Run in standalone mode by running `yarn start:standalone`.
-   Run inside the container application by running the root application and running `yarn start` on this application.

### Production build

-   You can create a production build by running `yarn build`.

### Testing

-   You can run the unit tests by running `yarn test`.

API is mocked for tests via [msw](https://github.com/mswjs/msw) and our @hackney/mtfh-test-utils
You can see an example on test-utils.tsx

### Resources

-   [Hackney Design System](https://design-system.hackney.gov.uk/)
-   [Single SPA Framework](https://single-spa.js.org/)

### Working with dependencies

The app has a dependency on the [Common](https://github.com/LBHackney-IT/mtfh-frontend-common.git) microfronted.

In case you need to work on other MFEs at the same time, the preferred tool is [yalc](https://github.com/wclr/yalc)
