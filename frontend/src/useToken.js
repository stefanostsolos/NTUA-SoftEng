import { useState } from "react";

export default function useToken() {
  function getToken() {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== 'undefined') {
      return tokenString;
    } else return undefined;
  }

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    token,
    setToken: saveToken,
  };
}
