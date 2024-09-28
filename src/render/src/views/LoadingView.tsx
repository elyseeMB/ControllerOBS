import { globalFetchProfile } from "../store/store.ts";
import { fetchProfile } from "../components/setup/FetchProfile.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function LoadingView() {
  const location = useLocation();
  const navigate = useNavigate();
  fetchProfile(async (data) => {
    await globalFetchProfile(data);
  });
  
  useEffect(() => {
    if (location.pathname === "/laoding") {
      navigate("/home");
    }
  }, []);
  
  return <div>Loading...</div>;
}