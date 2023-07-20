import React, { useState } from "react";

interface LoginProps {
  loginUser: (user: string, pass: string) => void;
}

// Define Login component
const Login: React.FC<LoginProps> = ({ loginUser }) => {
  // State variables for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // render create account form instead

  // Function to handle create account form submission
  const handleCreateAccount = (event: React.FormEvent) => {
    event.preventDefault();
    // Perform create account logic here
    console.log("Creating account...", username, password);
  };

  return (
    <div>
      {isLogin ? (
        <>
          {" "}
          <h2>Login</h2>
          <form onSubmit={() => loginUser(username, password)}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <br />
            <button type="submit">Login</button>
            <br />
            <a href="/create" onClick={() => setIsLogin(false)}>
              Create account here
            </a>
          </form>
        </>
      ) : (
        <>
          <h2>Create Account</h2>
          <form onSubmit={handleCreateAccount}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <br />
            <button type="submit">Create Account</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
