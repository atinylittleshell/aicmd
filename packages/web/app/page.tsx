export default function Page() {
  return (
    <div className="flex-1 flex flex-col gap-4 items-center justify-center">
      <div className="text-2xl">Write shell commands using natural language.</div>
      <div className="mockup-code w-full max-w-lg">
        <pre data-prefix=">">
          <code>npm i -g aicmd</code>
        </pre>
        <pre data-prefix=">">
          <code>aicmd print hello world</code>
        </pre>
      </div>
    </div>
  );
}
