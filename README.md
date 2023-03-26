# aicmd
[![build](https://github.com/kunchenguid/aicmd/actions/workflows/build.yml/badge.svg)](https://github.com/kunchenguid/aicmd/actions/workflows/build.yml)

A CLI program that uses AI to help find the right command for your task.

## Usage

Run it directly using npx:
```bash
npx aicmd create a javascript code file that prints hello world, and run it
```

Alternatively, install aicmd globally:
```bash
npm i -g aicmd
```

And then run it more easily each time:
```bash
aicmd create a javascript code file that prints hello world, and run it
```

Output:
```bash
echo console.log("Hello World!") > hello.js && node hello.js
Execute the command above? [y/N]
```