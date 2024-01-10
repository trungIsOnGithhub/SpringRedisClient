
import { Toast } from "react-bootstrap";
import React, { useState, useRef } from "react";
import "./style.css";
import { useEffect } from "react";

const DEMO_USERS = ["User1", "User2", "User3", "User4"];

export default function Login({ onLogIn }) {
  const [username, setUsername] = useState(
    () => DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)]
  );

  const [error, setError] = useState(null);
  const [password, setPassword] = useState("password123")

  const onSubmit = async (event) => {
    event.preventDefault();
    onLogIn(username, password, setError);
  };

  return (
    <>
      <div className="login-form text-center login-page">
        <div
          className="rounded"
          style={{
            boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
          }}
        >
          <div className="position-relative">
            <div
              className="row no-gutters align-items-center"
              style={{
                maxWidth: 400,
                backgroundColor: "palegreen",
                padding: 20,
              }}
            >
              <div className="col text-primary text-left">
                <h3 className="font-size-15">Spring Redis Chat App!</h3>
                <i>This is a UI demo of the application</i>
              </div>
              <div className="col align-self-end">
                <img
                  style={{ maxWidth: "80%" }}
                  src={`${process.env.PUBLIC_URL}/welcome-back.png`}
                />
              </div>
            </div>
            <div
              className="position-absolute"
              style={{ bottom: -10, left: 20 }}
            >
            </div>
          </div>

          <form
            className="bg-white text-left px-4"
            style={{
              paddingTop: 20,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}
            onSubmit={onSubmit}
          >
            <label className="font-size-12">Name</label>

            <div className="username-select mb-3">
              <UsernameSelect
                username={username}
                setUsername={setUsername}
                names={DEMO_USERS}
              />
            </div>

            <label htmlFor="inputPassword" className="font-size-12">
              Password
            </label>
            <input
              value={"password123"}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              id="inputPassword"
              className="form-control"
              required
            />
            <div style={{ height: 30 }} />
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <div className="login-error-anchor">
              <div className="toast-box">
                <Toast
                  style={{ minWidth: 277 }}
                  onClose={() => setError(null)}
                  show={error !== null}
                  delay={3000}
                  autohide
                >
                  <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                    />
                    <strong className="mr-auto">Error</strong>
                  </Toast.Header>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>
              </div>
            </div>
            <div style={{ height: 30 }} />
          </form>
        </div>
      </div>
    </>
  );
}

const UsernameSelect = ({ username, setUsername, names = [""] }) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const ref = useRef();
  /** @ts-ignore */
  const clientRectWidth = ref.current?.getBoundingClientRect().width;
  useEffect(() => {
    /** @ts-ignore */
    setWidth(clientRectWidth);
  }, [clientRectWidth]);

  /** Click away listener */
  useEffect(() => {
    if (open) {
      const listener = () => setOpen(false);
      document.addEventListener("click", listener);
      return () => document.removeEventListener("click", listener);
    }
  }, [open]);

  /** Make the current div focused */
  useEffect(() => {
    if (open) {
      /** @ts-ignore */
      ref.current?.focus();
    }
  }, [open]);

  return (
    <div
      tabIndex={0}
      ref={ref}
      className={`username-select-dropdown ${open ? "open" : ""}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="username-select-row">
        <div>{username}</div>
        <div>
          <svg width={24} height={24}>
            <path d="M7 10l5 5 5-5z" fill="#333" />
          </svg>
        </div>
      </div>
      <div
        style={{ width: width }}
        className={`username-select-block ${open ? "open" : ""}`}
      >
        {names.map((name) => (
          <div
            className="username-select-block-item"
            key={name}
            onClick={() => setUsername(name)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
