export default function Page() {
  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="prose">
        <h1 className="text-center">Write shell commands using natural language.</h1>
      </div>
      <div className="mockup-code w-full max-w-lg">
        <pre data-prefix=">">
          <code>npm i -g aicmd</code>
        </pre>
        <pre data-prefix=">">
          <code>aicmd print hello world</code>
        </pre>
      </div>
      <div className="prose">
        <ul>
          <li>
            Runs on{' '}
            <a href="https://nodejs.org/" target="_blank">
              Node.js
            </a>
            . Version 16+ required.
          </li>
          <li>Support all major OS and shells.</li>
          <li>Usage is free. No fees whatsoever.</li>
          <li>
            Open source on{' '}
            <a href="https://github.com/kunchenguid/aicmd" target="_blank">
              github
            </a>
            . Pull requests welcome.
          </li>
        </ul>
      </div>
    </div>
  );
}
