# 1b JHUB Coding - Rich Web Application

# Running the project

## Package manager

`pnpm` is used to manage the project dependencies. The project is configured to use corepack, which is a tool to install and manage multiple versions of Node.js on your machine.

You should simply be able to run 

```bash
pnpm install
```

to install all the dependencies.

If for some reason this does not work, try running `corepack enable` and then `pnpm install`. 

If this also does not work, you can install `pnpm` manually via npm `npm install -g pnpm`, then run `pnpm install`.

## Running the project

To run the project, simply run `pnpm dev`. This will start a local server on port 3000 and open the app in your default browser.