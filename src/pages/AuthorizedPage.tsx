import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import { useContext } from "react";

export default function AuthorizedPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    auth.getToken();
  }, []);

  return (
    <>
      <h1>Authroized Page</h1>
    </>
  );
}