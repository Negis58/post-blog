import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { fetchAddPost } from "../core/api";

export const ModalFormPost = ({ show, handleClose, setPosts, setPostLoading, posts }) => {

  const [text, setText] = useState("");
  const [file, setFile] = useState([]);
  const [title, setTitle] = useState("");

  const getPosts = async (formData) => {
    setPostLoading(false);
    const data = await fetchAddPost(formData);
    setPosts([data, ...posts]);
    setPostLoading(true);
  };

  const onSubmit = e => {
    handleClose(true);
    e.preventDefault();
    let formData = new FormData();
    formData.append("text", text);
    formData.append("title", title);
    file.forEach(item => {
      formData.append("files", item);
    });
    getPosts(formData);
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Form style={{ maxWidth: "500px" }} className="justify-content-center" onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Создание записи</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            className="mb-3"
            placeholder="Введите заголовок поста"
            name="username"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <FloatingLabel
            controlId="floatingTextarea"
            label="Введите текст поста"
            className="mb-3"
            required
          >
            <Form.Control as="textarea" placeholder="Leave a comment here" onChange={(e) => setText(e.target.value)} />
          </FloatingLabel>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg, video/mp4"
              onChange={(e) => setFile([...e.target.files])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
          <Button type="submit" variant="primary" className="ms-2">Отправить</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};