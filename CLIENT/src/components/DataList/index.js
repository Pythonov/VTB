
import React from "react";
import DataCard from "../DataCard";

const DataList = ({dataSet}) => {


  return (
    <div style={{width:'100%',}}>
        
      {!dataSet.searchResults.length ? (
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "150px",
            textAlign: "center",
          }}
        >
         Нет датасетов
        </h2>
      ) : (
        <div >
          {dataSet.searchResults.map((result,index) => (
              <div key = {index}>
              <DataCard
                result={result}
              />
            </div>
          ))}
     </div>
      )}
    </div>
  );
};

export default DataList;