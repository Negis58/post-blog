import React, { useContext, useEffect, useState } from "react";
import { PostItem } from "../components/PostItem";
import AppContext from "../context";
import api from "../core/axios";
import { fetchLogout, fetchPosts } from "../core/api";
import { Header } from "../components/Header";
import { ModalFormPost } from "../components/ModalFormPost";


const MainPage = () => {
  const { isAuth, setAuthLoading, setIsAuth, setUser, user, postLoading, setPostLoading } = useContext(AppContext);
  const [posts, setPosts] = useState([]);


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
    setPostLoading(true);
  };

  const checkAuth = async () => {
    setAuthLoading(true);
    const { data } = await api.post("/auth/refresh-token", { withCredentials: true });
    localStorage.setItem("token2", data.accessToken);
    setIsAuth(true);
    setUser(data.user);
    setAuthLoading(false);
  };


  const logout = async () => {
    await fetchLogout();
    setIsAuth(false);
    setUser({});
    localStorage.removeItem("token2");
  };
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (localStorage.getItem("token2")) {
      checkAuth();
    }
    getPosts();
  }, []);


  return (
    <div>
      <Header
        isAuth={isAuth}
        handleShow={handleShow}
        setIsAuth={setIsAuth}
        setUser={setUser}
        handleLogout={handleLogout}
      />
      <div className="d-flex justify-content-center">
        <div className="container m-0 p-0" style={{ width: "1000px" }}>
          <ModalFormPost
            show={show}
            handleClose={handleClose}
            setPosts={setPosts}
            setPostLoading={setAuthLoading}
            posts={posts}
          />

          {postLoading && <>
            {posts.map((item) => (
              <PostItem
                key={item.id}
                item={item}
                user={user}
                isAuth={isAuth}
                posts={posts}
                setPosts={setPosts}
              />
            ))}
          </>
          }
        </div>
      </div>
    </div>
  );
};
export default MainPage;
