import React from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
const DataCard = ({result}) => {
  const router = useHistory()
  // console.log(result) 
  return (

<Card border="primary" style={{  marginBottom:'15px', cursor:'pointer'}} onClick={()=>router.push(`/main/${result.entity.name}`)}>
    <Card.Header>{result.entity.name}</Card.Header>
    <Card.Body>
     <div style={{display:'flex',flexDirection:'row', justifyContent:"space-between"}}>
         <div style={{display:'flex', flexDirection:'column'}}>
             {result.entity.schema.fields.map((f,index)=>(
          <div key = {index}>
          <div style = {{borderBottom:"1 px solid black"}}>{f.fieldPath}</div>
       </div>
      ))}
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
             {result.entity.schema.fields.map((f,index)=>(
          <div key = {index}>
          <div>{f.description}</div>
       </div>
      ))}
      </div>
    </div>
    </Card.Body>
  </Card>
  );
};

export default DataCard;

