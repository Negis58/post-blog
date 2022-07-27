import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppContext from "./context";

export const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState();
    const [authLoading, setAuthLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);


    return (
      <AppContext.Provider
        value={{
          isAuth,
          setIsAuth,
          authLoading,
          setAuthLoading,
          user,
          setUser,
          postLoading,
          setPostLoading
        }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AppContext.Provider>

    );
  }
;

export default App;
