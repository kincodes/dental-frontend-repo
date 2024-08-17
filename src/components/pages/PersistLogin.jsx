import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";

const PersistLogin = () => {
  const { auth, persist } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const refresh = useRefreshToken();

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    let isMounted = true;
    let isRefreshed = false;

    const verifyRefreshToken = async () => {
      //  await timeout(1000);

      try {
         await timeout(1000);

        if (!isRefreshed) {
        await refresh();
        }
      } catch (err) {
        console.error("Persit try " + err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!auth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => [
      isMounted = false,
      isRefreshed = true ]     

  
    }, []);

  useEffect(() => {

    let isRendered = false;

    const handleChange = async () => {
      await timeout(1000); // prevents multiple renders

      if (!isRendered) {
        console.log(`isLoading: ${isLoading}`);
       // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
      }
     
    };
    handleChange();

    return () => {
      isRendered = true;
    };
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
