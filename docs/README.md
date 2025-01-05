# openlogo

```
git clone https://github.com/TeamShiksha/logoexecutive.git
cd logoexecutive
pnpm install
pnpm start
```

commands and descriptions

```
start - starts both the server and reloads on change.
serve - start(for react build before serving) with no reload on change
build - build both(no build for nodejs) the app 
test - runs test in both app
coverage - gets the test coverage in both the apps
lint - linting in both app
lint:fix - lint fix in both app (if possible)
format - runs prettier in both apps
```

To run commands seperately for ui or app workspace:
```
pnpm --filter ui start # `ui` is the workspace name and `start` is a command.
<!-- similarly you can run other commands -->
```

The above command will let you run both frontend and backend easily at the same time.