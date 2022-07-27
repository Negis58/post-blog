import React, { useState } from "react";
import { Button, Card, Carousel } from "react-bootstrap";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ModalFormEditPost } from "./ModalFormEditPost";
import { fetchDeletePost } from "../core/api";
import { HOST } from "../constant";

export const PostItem = ({ item, isAuth, user, setPosts, posts }) => {

  const [showFormEdit, setShowFormEdit] = useState(false);
  const handleCloseFormEdit = () => setShowFormEdit(false);

  const handleDelete = (item) => {
    if (window.confirm(`Удалить ${item.title}?`)) {
      deletePost(item.id);
      setPosts(posts.filter((val) => val.id !== item.id));
    }
  };

  const deletePost = (id) => {
    fetchDeletePost(id);
  };


  const handleEditFormShow = () => {
    setShowFormEdit(true);
  };

  return (
    <>
      <ModalFormEditPost
        show={showFormEdit}
        handleCloseFormEdit={handleCloseFormEdit}
        item={item}
        posts={posts}
        setPosts={setPosts}
      />
      <Card className="mb-3">
        <Card.Title className="ms-3 mt-2">{item.title}</Card.Title>
        <div className="d-flex justify-content-center mt-2">
          <Carousel>
            {item.attachments && item.attachments.map(media => (
              <Carousel.Item>
                {
                  media.mimetype === "video/mp4" ? (
                    <video width="500" height="auto" controls>
                      <source src={`${HOST}/${media.filename}`} type="video/mp4" />
                    </video>
                  ) : (
                    <Card.Img
                      // className="d-block w-100"
                      // style={{ objectFit: "cover", width: "500px", height: "auto" }}
                      src={`${HOST}/${media.filename}`}
                      alt={media.filename}
                    />
                  )
                }
              </Carousel.Item>
            ))
            }
          </Carousel>
        </div>
        <Card.Body>
          <Card.Text>{item.text}</Card.Text>
          <div className="d-flex flex-row justify-content-md-between">
            <div>
              {isAuth && item.user.id === user.id && (
                <Button variant="success" className="me-3" onClick={handleEditFormShow}>Редактировать</Button>
              )}
              {isAuth && item.user.id === user.id && (
                <Button variant="danger" className="me-3" onClick={() => handleDelete(item)}>Удалить</Button>
              )}
            </div>
            <div className="m-0">
              <p
                className="m-0"> Создано: <b>{format(new Date(item.createdAt), "dd.MM.yyyy", { locale: ru })}</b>
              </p>
              <p className="m-0">Отправил: <b>{item.user.username}</b></p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};