import axios from "axios";
import { useEffect, useState } from "react";
import DataList from "../../../components/DataList";
import { FormControl, Button } from "react-bootstrap";


const MainPage = ({user, isAuthenticated}) => {
        const [dataSet, setDataSet] = useState([]);
        const [queryText, setQueryText] = useState("");
        const [start, setStart] = useState(0);
        const [count, setCount] = useState(10);
       
        const [fields, setFields] = useState([
          "fieldPath",
          "nullable",
          " description",
          "nativeDataType",
        ]);
        const getData = async () => {
          const response = await axios.post("http://127.0.0.1:7070/get_datasets", {
            query: {
              query: `${queryText} `,
              start: `${start}`,
              count: `${count}`,
              fields: fields,
            },
            settings: {
              url: "http://localhost:8080/api/graphql",
            },
          });
          setDataSet(response.data.answer.data.search);
        };
        useEffect(() => {
          getData();
        }, [queryText]);
      
        
        // console.log(user);
        return (
          <>
            
      
            {isAuthenticated ? (
              <div
                style={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                  flexDirection: "column",
                }}
              >
                <FormControl
                  placeholder="Введите более 4-х символов"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  style={{ width: "100%", margin: "25px" }}
                />
      
                {dataSet != 0 && <DataList dataSet={dataSet} />}
              </div>
            ) : (
              <h3
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "100px",
                }}
              >
                Авторизируйтесь чтобы воспользоваться приложением
              </h3>
            )}
            </>
        );
    
}

export default MainPage