import React, { useState } from 'react';
import { MDBBtn, MDBFile, MDBInput, MDBTextArea } from 'mdb-react-ui-kit';
import { Select } from 'semantic-ui-react';
import { MessageService } from '../services/messageService';
import { useNavigate } from 'react-router-dom';
import { PictureService } from '../services/pictureService';

export default function CreateMessageTemplate() {
  const messageConents = [
    { key: 'first', value: 'first_message', text: 'First message' },
    { key: 'tea', value: 'tea_message', text: 'Tea message' },
    { key: 'normal', value: 'normal_message', text: 'Normal message' },
    { key: 'costumer', value: 'costumer_message', text: 'Costumer message' },
    { key: 'filtered', value: 'filtered_message', text: 'Filtered message' },

  ];

  const messageTypes = [
    { key: 'text', value: 'text', text: 'Text' },
    { key: 'image', value: 'image', text: 'Image' },
  ];

  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submit = () => {
    const messageService = new MessageService();

    const data = {
      description: description,
      message: message,
      messageType: messageType,
      messageContent: messageContent
    };

    console.log(data);
    messageService.save(data).then(res => {
      if (res.status === 200) {
        if (messageType === 'text') {
          navigate("/");
        } else {
          const pictureService = new PictureService();
          const formData = new FormData();
          formData.append('picture', selectedFile);
          formData.append('messageTemplateId', res.data.data);

          pictureService.save(formData).then(res => {
            if (res.status === 200) navigate("/");
          });
        }
      }
    }).catch(e => navigate("/login"));
  };

  return (
    <div style={{ width: "40%", margin: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      <MDBInput onChange={(e) => setDescription(e.target.value)} label="Description" type="text" />
      <MDBTextArea onChange={(e) => setMessage(e.target.value)} label="Message" id="textAreaExample" rows={4} />
      <Select onChange={(e, data) => setMessageType(data.value)} placeholder='Select Message Type' options={messageTypes} />
      <Select onChange={(e, data) => setMessageContent(data.value)} placeholder='Select Message Content' options={messageConents} />
      {messageType === "image" ? <MDBFile onChange={handleFileChange} label='Default file input example' id='customFile' /> : null}
      <MDBBtn onClick={submit}>Submit</MDBBtn>
    </div>
  );
}
