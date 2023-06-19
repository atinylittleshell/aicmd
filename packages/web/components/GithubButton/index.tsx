'use client';

import GitHubButton from 'react-github-btn';

const GithubButton = () => {
  return (
    <div style={{ height: 28 }}>
      <GitHubButton
        href="https://github.com/atinylittleshell/aicmd"
        data-color-scheme="no-preference: dark; light: dark; dark: dark;"
        data-size="large"
        data-show-count="true"
        aria-label="Star atinylittleshell/aicmd on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  );
};

export default GithubButton;
