'use client';

import { useEffect, useState } from 'react';
import { TbBrandGoogle, TbCheck, TbCopy } from 'react-icons/tb';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useFirebaseContext } from '../../hooks/FirebaseContext';

const Page = () => {
  const firebaseContext = useFirebaseContext();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (firebaseContext.loadingAuth || !firebaseContext.user || accessToken) {
      return;
    }

    const getAccessToken = async (): Promise<string> => {
      const idToken = await firebaseContext.getIdToken();
      const response = await fetch('/api/get_access_token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer FIREBASE ${idToken}`,
        },
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        return accessToken || '';
      }

      throw new Error('Failed to get access token');
    };

    getAccessToken()
      .then((accessToken) => {
        setAccessToken(accessToken);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [firebaseContext, accessToken, setAccessToken]);

  if (firebaseContext.loadingAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!firebaseContext.user) {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <div className="hero">
          <div className="hero-content">
            <div className="max-w-md prose">
              <h1 className="text-center">Get Started</h1>
              <ul>
                <li>Sign in required to prevent abuse.</li>
                <li>Usage is free. No subscription or credits.</li>
              </ul>
              <button
                className="btn btn-primary btn-block mt-4"
                onClick={() => {
                  firebaseContext.signInWithGoogle();
                }}
              >
                <TbBrandGoogle className="text-xl mr-2" />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const copyAccessToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setCopySuccess(true);
    }
  };

  return (
    <div className="flex-1 relative flex flex-col gap-2 items-center justify-center m-4">
      {accessToken ? (
        <>
          <div className="form-control w-full max-w-lg">
            <label className="label">
              <span className="label-text">
                {copySuccess ? 'Paste it into aicmd to continue.' : 'Copy your access token.'}
              </span>
            </label>
            <div className="input-group">
              <input
                type="text"
                readOnly
                className="input input-bordered w-full focus:outline-none"
                value={accessToken}
                onClick={(e) => {
                  e.currentTarget.select();
                  copyAccessToken();
                }}
              />
              <button
                className={`btn btn-square ${copySuccess ? 'btn-success' : 'btn-primary'}`}
                onClick={() => {
                  copyAccessToken();
                }}
              >
                {copySuccess ? <TbCheck className="text-xl" /> : <TbCopy className="text-xl" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner text="Loading..." />
      )}
    </div>
  );
};

export default Page;
