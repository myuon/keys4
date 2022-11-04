import { css } from "@emotion/react";
import { GithubAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useState } from "react";
import { useLocalStorageState } from "../components/useLocalStorageState";
import { auth } from "../firebase";

const provider = new GithubAuthProvider();
provider.addScope("repo");
provider.setCustomParameters({
  allow_signup: "false",
});

export const LoginPage = () => {
  const [user, setUser] = useState<User | undefined>(
    auth.currentUser ?? undefined
  );
  const [token, setToken] = useLocalStorageState("token", "");

  return (
    <div>
      <h1>Login</h1>

      <button
        css={css`
          color: #fff;
          background-color: #333;
        `}
        onClick={async () => {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          setUser(user);

          setToken(await result.user.getIdToken());
        }}
      >
        Login with Github
      </button>

      {user && token ? (
        <div>
          <h2>Logged in as {user.displayName}</h2>
          <p>UID: {user.uid}</p>

          <button
            onClick={async () => {
              const resp = await fetch(
                "https://asia-northeast1-keys4-ebdd8.cloudfunctions.net/api/init",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log(await resp.text());
            }}
          >
            /init
          </button>
          <button
            onClick={async () => {
              const resp = await fetch(
                "https://asia-northeast1-keys4-ebdd8.cloudfunctions.net/api/sqlite",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log(await resp.text());
            }}
          >
            /sqlite
          </button>
        </div>
      ) : null}
    </div>
  );
};
