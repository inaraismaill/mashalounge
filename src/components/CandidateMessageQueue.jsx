import { useEffect, useState } from 'react'
import { CandidateMessageQueueService } from '../services/candidateMessageQueueService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MDBBtn } from 'mdb-react-ui-kit';

const CandidateMessageQueue = () => {

    const [datas, setDatas] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const navigate = useNavigate()
    const { id } = useParams(); 
    const [count, setCount] = useState(0);

    useEffect(() =>{
        const candidateMessageQueue  = new CandidateMessageQueueService();
        
        candidateMessageQueue.getAllCandidateMessageQueuesByMessageContentId(id, pageNumber).then(res => {
            setDatas(res.data.data)
        }).catch(e => navigate("/login"))

        candidateMessageQueue.getCandidateCountByMessageTemplateId(id).then(res => setCount(res.data))

    },[pageNumber])
    
  return (
    <div>
        <h3>Sent: {datas.totalElements}</h3>
        <h3>Remained: {count - datas.totalElements}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          {datas.content?.map((data, i) => (
            <tr key={data.id}>
              <td>{i + 1 + 50 * pageNumber}</td>
              <td>{data?.candidate?.firstName}</td>
              <td>{data?.candidate?.lastName}</td>
              <td>{data?.candidate?.phoneNumber}</td>
            
              <td>
              <Link to={"/candidateDetalis/"+data?.candidate?.id}>
                <MDBBtn className="me-1" color="info">
                  Info
                </MDBBtn>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
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
          <li className={`page-item `}> 
            <button
              className="page-link"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default CandidateMessageQueue
