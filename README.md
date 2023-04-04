# AICMD
[![build](https://github.com/kunchenguid/aicmd/actions/workflows/build.yml/badge.svg)](https://github.com/kunchenguid/aicmd/actions/workflows/build.yml)

A CLI program that allows you to write shell commands using nautral language.
* Always asks for confirmation before executing.
* Supports all major OS and shells.
* Usage is free. No fees whatsoever.

![screenshot](./doc/screenshot.png)

## Prerequisites
AICMD is based on Node.js. [Install Node.js](https://nodejs.org/en) before proceeding. Minimum required version is Node.js 16.

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

## Disclaimers

* Your command requests to aicmd are processed by a backend service hosted on [Vercel](https://vercel.com), not locally 
  on your computer. The source code of this backend service is also fully available in this repo.
* Behind the scenes, we call [OpenAI's API](https://platform.openai.com/docs) to generate the commands. Please see
  [OpenAI's data usage policies](https://openai.com/policies/api-data-usage-policies) for how OpenAI handles the data.
* You are responsible for the consequence of executing the commands. Same as most AI-based tools, please be aware that 
  AI can make mistakes and in this case it can give you commands that don't do what you expect. Please make sure you 
  understand and have confidence in the commands being suggested before executing them.

## Support me
[Buy me a coffee](https://www.buymeacoffee.com/kunchenxyz)