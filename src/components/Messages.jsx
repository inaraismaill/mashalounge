import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTable,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { MessageService } from "../services/messageService";
import { Link, useNavigate } from "react-router-dom";

export default function Messages() {
  const [firstMessages, setFirstMessages] = useState([]);
  const [teaMessages, setTeaMessages] = useState([]);
  const [normalMessages, setNormalMessages] = useState([]);
  const [costumerMessages, setCostumerMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [basicModalDelete, setBasicModalDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState(0);
  const toggleOpen = () => setBasicModal(!basicModal);
  const toggleOpenDeleteModal = () => setBasicModalDelete(!basicModalDelete);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const messageService = new MessageService();

    messageService
      .findAllFirstMessageTemplate()
      .then((res) => setFirstMessages(res.data.data))
      .catch(() => navigate("/login"));

    messageService
      .findAllNormalTemplate()
      .then((res) => setNormalMessages(res.data.data));

      messageService
      .findAllCostumerTemplate()
      .then((res) => setCostumerMessages(res.data.data));

    messageService
      .findAllTeaMessageTemplate()
      .then((res) => setTeaMessages(res.data.data));

      messageService
      .findAllFilteredTemplate()
      .then((res) => setFilteredMessages(res.data.data));
  }, []);

  const updateMessage = () => {
    const messageService = new MessageService();
    const data = {
      id: id,
      message: message,
    };
    messageService.updateMessage(data).then((res) => {
      if (res.status === 200) {
        toggleOpen();
        window.location.reload();
      }
    });
  };

  const deleteTemplate = () =>{
      const messageService = new MessageService();

      messageService.deleteById(id).then(() =>{
        toggleOpenDeleteModal()
        window.location.reload();
      })
      
  }

  const sendMessages = (id) => {
    console.log(id);
    const messageService = new MessageService();
    if (isSending) return;
    setIsSending(true);

    messageService
      .sendAllMessages(id)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e.message))
      .finally(() => setIsSending(false));
  };

  const sendCustomersMessages = (id) => {
    const messageService = new MessageService();
    if (isSending) return;
    setIsSending(true);

    messageService
      .sendAllCustomersMessages(id)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e.message))
      .finally(() => setIsSending(false));
  };
  return (
    <div>
      <h2>FIRST MESSAGE</h2>
      <MDBTable>
        <MDBTableBody>
          {firstMessages.map((message, i) => (
            <tr
              key={i}
              style={{ border: "1px solid" }}
              className="table-primary"
            >
              <th scope="row">{message.description}</th>
              <td>{message.message}</td>
              <td>{message.messageType}</td>
              <td>
                <MDBBtn className="me-1" color="danger" 
                  onClick={() => {
                    setId(message.id);
                    toggleOpenDeleteModal();
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
              <td>
                <MDBBtn
                  onClick={() => {
                    setId(message.id);
                    toggleOpen();
                  }}
                >
                  Update
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <h2>TEA MESSAGE</h2>
      <MDBTable>
        <MDBTableBody>
          {teaMessages.map((message, i) => (
            <tr
              key={i}
              style={{ border: "1px solid" }}
              className="table-primary"
            >
              <th scope="row">{message.description}</th>
              <td>{message.message}</td>
              <td>{message.messageType}</td>
              <td>
                <MDBBtn className="me-1" color="danger"
                  onClick={() => {
                    setId(message.id);
                    toggleOpenDeleteModal();
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
              <td>
                <MDBBtn
                  onClick={() => {
                    setId(message.id);
                    toggleOpen();
                  }}
                >
                  Update
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <h2>NORMAL MESSAGES</h2>
      <MDBTable>
        <MDBTableBody>
          {normalMessages.map((message, i) => (
            <tr
              key={i}
              style={{ border: "1px solid" }}
              className="table-primary"
            >
              <th scope="row">{message.description}</th>
              <td>{message.message}</td>
              <td>{message.messageType}</td>
              <td>
                <Link to={"/candidateQueue/" + message.id}><MDBBtn className="me-1" color="info">
                  Qeuue
                </MDBBtn></Link>
              </td>
              <td>
                <MDBBtn className="me-1" color="danger"
                  onClick={() => {
                    setId(message.id);
                    toggleOpenDeleteModal();
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
              <td>
                {
                  <MDBBtn
                    disabled={isSending}
                    onClick={() => sendMessages(message.id)}
                  >
                    {isSending ? "Sending..." : "Send Messages"}
                  </MDBBtn>
                }
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <h2>CUSTOMER MESSAGES</h2>
      <MDBTable>
        <MDBTableBody>
          {costumerMessages.map((message, i) => (
            <tr
              key={i}
              style={{ border: "1px solid" }}
              className="table-primary"
            >
              <th scope="row">{message.description}</th>
              <td>{message.message}</td>
              <td>{message.messageType}</td>
              <td>
                <Link to={"/candidateQueue/" + message.id}><MDBBtn className="me-1" color="info">
                  Qeuue
                </MDBBtn></Link>
              </td>
              <td>
                <MDBBtn className="me-1" color="danger"
                  onClick={() => {
                    setId(message.id);
                    toggleOpenDeleteModal();
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
              <td>
                {
                  <MDBBtn
                    disabled={isSending}
                    onClick={() => sendCustomersMessages(message.id)}
                  >
                    {isSending ? "Sending..." : "Send Messages"}
                  </MDBBtn>
                }
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <h2>FILTERED CANDIDATE MESSAGES</h2>
      <MDBTable>
        <MDBTableBody>
          {filteredMessages.map((message, i) => (
            <tr
              key={i}
              style={{ border: "1px solid" }}
              className="table-primary"
            >
              <th scope="row">{message.description}</th>
              <td>{message.message}</td>
              <td>{message.messageType}</td>
              <td>
                <Link to={"/candidateQueue/" + message.id}><MDBBtn className="me-1" color="info">
                  Qeuue
                </MDBBtn></Link>
              </td>
              <td>
                <MDBBtn className="me-1" color="danger"
                  onClick={() => {
                    setId(message.id);
                    toggleOpenDeleteModal();
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <MDBModal
        open={basicModal}
        onClose={() => setBasicModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Message</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {" "}
              <MDBInput
                label="Message"
                id="form1"
                type="text"
                onChange={(e) => setMessage(e.target.value)}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn color="success" onClick={updateMessage}>
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>


      <MDBModal
        open={basicModalDelete}
        onClose={() => setBasicModalDelete(false)}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Message</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpenDeleteModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {" "}
              <p>Are you sure delete template</p>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpenDeleteModal}>
                Close
              </MDBBtn>
              <MDBBtn color="danger" onClick={deleteTemplate}>
                delete
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
