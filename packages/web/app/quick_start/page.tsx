import Link from 'next/link';
import { TbArrowLeft } from 'react-icons/tb';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="prose">
        <h2>Install Node.js</h2>
      </div>
      <div className="prose">
        <p>
          Make sure you have{' '}
          <a href="https://nodejs.org" target="_blank">
            Node.js
          </a>{' '}
          v16 or above installed.
        </p>
      </div>
      <div className="prose">
        <h2>Install aicmd</h2>
      </div>
      <div className="mockup-code w-full max-w-lg">
        <pre data-prefix=">">
          <code>npm i -g aicmd</code>
        </pre>
      </div>
      <div className="prose">
        <h2>Use aicmd</h2>
      </div>
      <div className="mockup-code w-full max-w-lg">
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
      <Link className="btn" href="/">
        <TbArrowLeft />
        Back
      </Link>
    </div>
  );
}
