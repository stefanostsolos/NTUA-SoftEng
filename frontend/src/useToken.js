import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function useToken() {
  function getToken() {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {

      console.log(tokenString)
      console.log(typeof(tokenString))
      const decodedToken = jwt_decode(tokenString);
      const  now = new Date().getTime();
      const expiresIn = decodedToken.exp*1000 - now;

      if (expiresIn <= 0) {
        localStorage.removeItem("token");
        return undefined;
      } else return tokenString;

    } else return undefined;
  }

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    if(userToken)
      localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  return {
    token,
    setToken: saveToken,
  };
}
