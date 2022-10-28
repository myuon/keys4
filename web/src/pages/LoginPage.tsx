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
  const [user, setUser] = useState<User>();
  const [, setToken] = useLocalStorageState("token", "");

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
          const credential = GithubAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            const token = credential.accessToken;
            setToken(token);
          }

          const user = result.user;
          setUser(user);
        }}
      >
        Login with Github
      </button>

      {user ? (
        <div>
          <h2>Logged in as {user.displayName}</h2>
          <p>UID: {user.uid}</p>
        </div>
      ) : null}
    </div>
  );
};
