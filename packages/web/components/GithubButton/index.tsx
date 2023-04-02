'use client';

import GitHubButton from 'react-github-btn';

const GithubButton = () => {
  return (
    <div style={{ height: 28 }}>
      <GitHubButton
        href="https://github.com/kunchenguid/aicmd"
        data-color-scheme="no-preference: dark; light: dark; dark: dark;"
        data-size="large"
        data-show-count="true"
        aria-label="Star kunchenguid/aicmd on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  );
};

export default GithubButton;
