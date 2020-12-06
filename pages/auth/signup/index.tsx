import firebaseClient from "../../../utils/firebaseClient";
import React, { FormEvent, useState } from "react";
import { Button, Layout } from "../../../components";

import styles from "./signup.module.scss";
import { useRouter } from "next/dist/client/router";
import { Alert } from "react-bootstrap";

interface Props {}

const Signup: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => router.push("/"))
      .catch((error) => setError(error.message));
  };

  return (
    <Layout small>
      <div className={styles.container}>
        {error ? (
          <Alert variant="danger" className={styles.error}>
            {error}
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your password ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
