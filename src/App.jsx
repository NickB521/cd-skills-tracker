import { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css"
function App() {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  // submit state
  const [excelData, setExcelData] = useState(null);
  const [count, setCount] = useState(0);
  const fixedData = [];
  const tempArr = []
  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files;
    for(let i =0;i<selectedFile.length;i++){
      if (selectedFile[i]) {
        if (selectedFile[i] && fileTypes.includes(selectedFile[i].type)) {
          setTypeError(null);
          let reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile[i]);
          reader.onload = (e) => {
            tempArr.push(e.target.result);
          };
        } else {
          setTypeError("Please select only excel file types");
          setExcelFile(null);
        }
      } else {
        console.log("Please select your file");
      }
    }
    setExcelFile(tempArr)
  };
  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    console.log(tempArr)
    console.log(excelFile)
    for(let i = 0;i<excelFile.length;i++){
      if (excelFile[i] !== null) {
        const workbook = XLSX.read(excelFile[i], { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        data.forEach((element) => dataFixer(element));
        dataDeleeter(fixedData);
        setExcelData(fixedData);
        setCount(fixedData.length);
      }
    }
  };
  const dataFixer = (data) => {
    let temp = {};
    let tempVal = "null";
    for (const [key, value] of Object.entries(data)) {
      const objectLength = Object.keys(temp).length;
      if (key == "First_Name") {
        temp.First_Name = value;
      }
      if (key == "Last_Name") {
        temp.Last_Name = value;
      }
      if (key == "Assignment_Name") {
        temp.Assignment_Name = value;
      }
      if (key == "Total_Points_Earned") {
        temp.Total_Points_Earned = value;
      }
      if (key == "Total_Points_Possible") {
        temp.Total_Points_Possible = value;
      }
      if (key == "Time_Spent") {
        temp.Time_Spent = value;
      }
      if (objectLength >= 5) {
        console.log("Temp being added: "+temp)
        fixedData.push(temp);
        temp = {};
        break;
      }
    }
  };
  const dataDeleeter = (dataFixed) => {
    for (let i = 0; i < dataFixed.length; i++) {
      if (
        dataFixed[i].Total_Points_Earned ==
          dataFixed[i].Total_Points_Possible &&
        dataFixed[i].Time_Spent > 0
      ) {
        console.log(
          "adding idx: " +
            i +
            " pnts earned: " +
            dataFixed[i].Total_Points_Earned +
            " pos pnts: " +
            dataFixed[i].Total_Points_Possible+ " tim spent: " + dataFixed[i].Time_Spent
        );
      } else {
        console.log(
          "getting rid of idx: " +
          i +
          " pnts earned: " +
          dataFixed[i].Total_Points_Earned +
          " pos pnts: " +
          dataFixed[i].Total_Points_Possible+ " tim spent: " + dataFixed[i].Time_Spent
        );
        dataFixed.splice(i, 1);
        i--;
      }
    }
  };
  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>
      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="form-control"
          required
          multiple
          onChange={handleFile}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>
      <div>
        number of interns completed: {count}
      </div>
      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key} className="tblLabels">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key} className="tblData">{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </div>
  );
}
export default App;