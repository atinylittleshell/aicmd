export default function Page() {
  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="prose">
        <h1 className="text-center">Write shell commands using natural language</h1>
      </div>
      <div className="mockup-code w-full max-w-lg">
        <pre data-prefix=">">
          <code>npm i -g aicmd</code>
        </pre>
        <pre data-prefix=">">
          <code>aicmd undo the last two git commits</code>
        </pre>
        <pre data-prefix=">" className="text-info">
          <code>git reset --soft HEAD~2</code>
        </pre>
        <pre data-prefix=">" className="text-warning">
          <code>Execute the command above? [y/N]</code>
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
          <li>Always asks for confirmation before executing.</li>
          <li>Support all major OS and shells.</li>
          <li>Usage is free. No fees whatsoever.</li>
        </ul>
      </div>
    </div>
  );
}
