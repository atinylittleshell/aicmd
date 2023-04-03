import Link from 'next/link';
import { TbArrowRight } from 'react-icons/tb';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="prose">
        <h1 className="text-center">Write shell commands using natural language</h1>
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
      <Link href="/quick_start" className="btn btn-primary">
        Quick Start <TbArrowRight />
      </Link>
      <div className="prose">
        <ul>
          <li>
            Depends on{' '}
            <a href="https://nodejs.org/" target="_blank">
              Node.js
            </a>{' '}
            v16 or above.
          </li>
          <li>Always asks for confirmation before executing.</li>
          <li>Support all major OS and shells.</li>
          <li>Usage is free. No fees whatsoever.</li>
        </ul>
      </div>
    </div>
  );
}
