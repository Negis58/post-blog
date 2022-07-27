import { Button, Card, FloatingLabel, Form, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { fetchEditPost } from "../core/api";
import iconClose from "../assets/cross-svgrepo-com.svg";
import styles from "./item.module.scss";
import { HOST } from "../constant";

export const ModalFormEditPost = ({ show, handleCloseFormEdit, item, setPosts, posts }) => {

  const editPost = async (formData, id) => {
    const data = await fetchEditPost(formData, id);
    let updatedPosts = posts.map(item => {
      if (item.id === data.id) {
        return data;
      }
      return item;
    });
    setPosts(updatedPosts);
  };
  const [image, setImage] = useState([...item.attachments]);

  const [text, setText] = useState(item.text);
  const [title, setTitle] = useState(item.title);
  const [file, setFile] = useState([]);
  const [imageIds, setImageIds] = useState([]);

  const onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("text", text);
    formData.append("title", title);
    file.forEach(item => {
      formData.append("files", item);
    });
    imageIds.forEach(item => {
      formData.append("imageIds", [item]);
    });
    editPost(formData, item.id);
    handleCloseFormEdit(true);
    setImageIds([]);
  };

  const handleImageDelete = (id) => {
    setImage(image.filter((val) => val.id !== id));
    setImageIds([...imageIds, id]);
  };


  return (
    <Modal show={show} onHide={handleCloseFormEdit}>
      <Form style={{ maxWidth: "800px" }} className="justify-content-center" onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Редактирование поста</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            className="mb-3"
            placeholder="Введите заголовок поста"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FloatingLabel
            controlId="floatingTextarea"
            label="Введите текст поста"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              required
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </FloatingLabel>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg, video/mp4"
              onChange={(e) => setFile([...e.target.files])}
            />
          </Form.Group>
          <div className="d-flex flex-wrap justify-content-between">
            {image.map(media => (
              <div className={styles.root}>
                <img src={iconClose} className={styles.close} alt="iconClose"
                     onClick={() => handleImageDelete(media.id)} />
                <Card.Img
                  // className="d-block w-100"
                  style={{ objectFit: "cover", width: "100px", height: "100px" }}
                  src={`${HOST}/${media.filename}`}
                  alt={media.filename}
                />
              </div>
            ))}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFormEdit}>Закрыть</Button>
          <Button type="submit" variant="primary" className="ms-2">Отправить</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};