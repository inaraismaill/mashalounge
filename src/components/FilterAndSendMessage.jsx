import { MDBCheckbox, MDBBtn, MDBInput, MDBTextArea } from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import { CandidateService } from "../services/candidateService";
import { Link, useNavigate } from "react-router-dom";
import { MessageService } from "../services/messageService";
import { Select } from "semantic-ui-react";

const FilterAndSendMessage = () => {
  const [includeBranches, setIncludeBranches] = useState({
    TEA: false,
    BAR: false,
    HOOKAH: false,
    KITCHEN: false,
    SET: false,
  });

  const [excludeBranches, setExcludeBranches] = useState({
    TEA: false,
    BAR: false,
    HOOKAH: false,
    KITCHEN: false,
    SET: false,
  });

  const [pageNumber, setPageNumber] = useState(0);
  const [candidates, setCandidates] = useState({});
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [messageTemplates, setMessageTemplates] = useState([])
  const [messageTemplateId,setMessageTemplateId] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    handleSubmit();
  }, [pageNumber]);

  useEffect(() => {
    const messageService = new MessageService();
    messageService.findAllFilteredTemplate().then(res => {
      const messageTemplatesTmp = []
      
      res.data.data?.map(data => {
        const messageTemplate = {key:data?.id, value:data?.id, text: data?.description};
        messageTemplatesTmp.push(messageTemplate)
      })

      setMessageTemplates(messageTemplatesTmp);
    })
    
  },[])

  const handleIncludeChange = (branch) => {
    setIncludeBranches({
      ...includeBranches,
      [branch]: !includeBranches[branch],
    });
  };

  const handleExcludeChange = (branch) => {
    setExcludeBranches({
      ...excludeBranches,
      [branch]: !excludeBranches[branch],
    });
  };

  const handleSendMessage = () => {
    const messageService = new MessageService()

    const includeDepartments = Object.keys(includeBranches).filter(
        (branch) => includeBranches[branch]
      );
      const excludeDepartments = Object.keys(excludeBranches).filter(
        (branch) => excludeBranches[branch]
      );

    const sendMessageDto = {
        messageTemplateId,
        includeDepartments,
        excludeDepartments,
        startDate,
        endDate
    }

    messageService.sendMessageFilteredCandidate(sendMessageDto).then(res => {
        if(res.status === 200){
            alert("Messages sent filtered candidate successfully")
        }
    }).catch(err => navigate("/login"))
  }

  const handleSubmit = () => {
    const includeDepartments = Object.keys(includeBranches).filter(
      (branch) => includeBranches[branch]
    );
    const excludeDepartments = Object.keys(excludeBranches).filter(
      (branch) => excludeBranches[branch]
    );

    const filterCandidateDto = {
      includeDepartments,
      excludeDepartments,
      pageNumber,
      startDate,
      endDate
    };

    const candidateService = new CandidateService();

    candidateService
      .filterByFoodDepartment(filterCandidateDto)
      .then((res) => {
        setCandidates(res.data.data);
      })
      .catch((err) => {
        navigate("/login");
      });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{display:"flex", justifyContent:"space-around"}}>
        <div>
            <h2>Start date</h2>
          <MDBInput className="mb-4" type="datetime-local" name="openCheckAt" onChange={(e) => setStartDate(e.target.value)}/>
        </div>
        <div>
            <h2>End date</h2>
          <MDBInput className="mb-4" type="datetime-local" name="openCheckAt" onChange={(e) => setEndDate(e.target.value)}/>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h2>Include Branch</h2>
          <MDBCheckbox
            checked={includeBranches.TEA}
            onChange={() => handleIncludeChange("TEA")}
            name="includeTea"
            value="TEA"
            id="includeTea"
            label="TEA"
          />
          <MDBCheckbox
            checked={includeBranches.BAR}
            onChange={() => handleIncludeChange("BAR")}
            name="includeBar"
            value="BAR"
            id="includeBar"
            label="BAR"
          />
          <MDBCheckbox
            checked={includeBranches.HOOKAH}
            onChange={() => handleIncludeChange("HOOKAH")}
            name="includeHookah"
            value="HOOKAH"
            id="includeHookah"
            label="HOOKAH"
          />
          <MDBCheckbox
            checked={includeBranches.KITCHEN}
            onChange={() => handleIncludeChange("KITCHEN")}
            name="includeKitchen"
            value="KITCHEN"
            id="includeKitchen"
            label="KITCHEN"
          />
          <MDBCheckbox
            checked={includeBranches.SET}
            onChange={() => handleIncludeChange("SET")}
            name="includeSet"
            value="SET"
            id="includeSet"
            label="SET"
          />
        </div>
        <div>
          <h2>Exclude Branch</h2>
          <MDBCheckbox
            checked={excludeBranches.TEA}
            onChange={() => handleExcludeChange("TEA")}
            name="excludeTea"
            value="TEA"
            id="excludeTea"
            label="TEA"
          />
          <MDBCheckbox
            checked={excludeBranches.BAR}
            onChange={() => handleExcludeChange("BAR")}
            name="excludeBar"
            value="BAR"
            id="excludeBar"
            label="BAR"
          />
          <MDBCheckbox
            checked={excludeBranches.HOOKAH}
            onChange={() => handleExcludeChange("HOOKAH")}
            name="excludeHookah"
            value="HOOKAH"
            id="excludeHookah"
            label="HOOKAH"
          />
          <MDBCheckbox
            checked={excludeBranches.KITCHEN}
            onChange={() => handleExcludeChange("KITCHEN")}
            name="excludeKitchen"
            value="KITCHEN"
            id="excludeKitchen"
            label="KITCHEN"
          />
          <MDBCheckbox
            checked={excludeBranches.SET}
            onChange={() => handleExcludeChange("SET")}
            name="excludeSet"
            value="SET"
            id="excludeSet"
            label="SET"
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MDBBtn onClick={handleSubmit}>Find Candidate</MDBBtn>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Cashback</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Should Receive</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {candidates?.content?.map((data, i) => (
            <tr key={data.id}>
              <td>{i + 1 + 100 * pageNumber}</td>
              <td>{data.cashBack}</td>
              <td>{data.firstName}</td>
              <td>{data.lastName}</td>
              <td>{data.phoneNumber}</td>
              <td>{data.shouldReceive ? "YES" : "NO"}</td>
              <td>
                <Link to={"/candidateDetails/" + data.id}>
                  <MDBBtn className="me-1" color="info">
                    Info
                  </MDBBtn>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>Count Candidate: {candidates.totalElements}</tfoot>
      </table>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pageNumber === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </button>
          </li>
          <li
            className={`page-item ${
              (pageNumber + 1) * 100 > candidates.totalElements
                ? "disabled"
                : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      {candidates.totalElements != 0 ? (
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "30px", display:"flex", justifyContent:"center"}}>
          <Select onChange={(e, data) => setMessageTemplateId(data.value)} placeholder='Select Message Template' options={messageTemplates} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MDBBtn onClick={handleSendMessage}>Send message</MDBBtn>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FilterAndSendMessage;
