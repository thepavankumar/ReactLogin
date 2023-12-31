import { useRef, useState, useEffect, useContext } from "react";
import axios from "./api/axios";

import AuthContext from "./context/AuthProvider";

// icons
import { BsFillPersonCheckFill, BsEmojiSmile } from "react-icons/bs";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check username and password submitting successfully with below commented lines
    // console.log( `You have submitted username ${user} with password ${pwd}`)
    // setUser(""); setPwd(''); setSuccess(true)

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify(
          { user, pwd },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );
      console.log(JSON.stringify(response?.data));
      console.log(response?.data.accessToken);
      const roles = response?.data?.roles;
      setAuth({user, pwd, roles, accessToken })
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if(!err?.response){
        setErrMsg('No server response')
      } else if(err.response?.status === 400){
        setErrMsg('Missing username or password')
      }else if(err.response?.status === 401){
        setErrMsg('Unauthorised')
      }else {
        setErrMsg('Login failed')
      }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <div className="inside">
            <BsEmojiSmile />
            <h1>Success!</h1>
            <p>
              you are successfully logged in <br />
              <a href="#">Redirecting to dashboard</a>
            </p>
          </div>
        </section>
      ) : (
        <section>
          <div className="inside">
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            <div className="heading-head">
              <BsFillPersonCheckFill />
              <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username : </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
              <label htmlFor="password">Password : </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <button className="btn-submit">Sign in</button>
            </form>
          </div>

          <p className="registered-early">
            Need an Account?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
