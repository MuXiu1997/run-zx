# Run zx


( install [`zx`](https://github.com/google/zx) + install dependencies + cache dependencies + run script ) in one step

## Usage

- [Basic](#Basic)
- [Setup zx for run scripts multiple times](#Setup-zx-for-run-scripts-multiple-times)

### See [action.yml](action.yml)
```yaml
- uses: MuXiu1997/run-zx@v0.1.0
  with:
    # The version of zx to install.
    # example: "7.2.3"
    zx-version: latest

    # Whether to disable pre-installed dependencies.
    # example: "true"
    disable-pre-installed-dependencies: false

    # A list of dependencies to install.
    # example: "typescript \n lodash@4.17.21"
    dependencies: ''

    # A key to use for restoring and saving the internal node_modules cache.
    # example: "primary-key-${{ runner.os }}"
    cache-key: 'run-zx-${{ runner.os }}-${{ a hash of all dependencies to be installed }}'

    # A list of keys to use for restoring the internal node_modules cache.
    # example: "primary-key-${{ runner.os }}-1 \n primary-key-${{ runner.os }}",
    cache-restore-keys: 'run-zx-${{ runner.os }}-'

    # The script content to run with zx.
    # example: "await $`ls -al`"
    script: ''

    # The file extension of the script file.
    # example: "md"
    script-file-ext: mjs

    # The zx command to run.
    # example: "zx --quiet {0}"
    zx-command: 'zx {0}'
```


### Basic
```yaml
- uses: MuXiu1997/run-zx@v0.1.0
  with:
    script: |-
      await $`ls -al`
```

### Setup zx for run scripts multiple times
```yaml
# GitHub Actions runs scripts by creating a temporary script in the ${{ runner.temp }} directory and executing it.
# Therefore, we need to create symbolic links for the node_modules from setup-zx to that directory in order to use dependencies.
- name: Setup zx
  id: setup-zx
  uses: MuXiu1997/run-zx@v0.1.0
  with:
    dependencies: |-
      hello-world-npm@1.1.1
    script: |-
      await fs.symlink(path.join(__dirname, 'node_modules'), path.join(process.env.RUNNER_TEMP, 'node_modules'))

- name: Run script
  shell: zx {0}
  run: |
    import * as core from '@actions/core'
    import HelloWorldNPM from 'hello-world-npm'

    cd('${{ github.workspace }}') // change working directory to workspace
    core.info(`${HelloWorldNPM.helloWorld()}`)

- name: Run script again
  shell: zx {0}
  run: |
    import * as core from '@actions/core'

    core.info('Hello again!')
```

## Pre installed dependencies

See [pre-installed-dependencies.json](src%2Fpre-installed-dependencies.json)


## License
[MIT](./LICENSE)
