import { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
function App() {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  // submit state
  const [excelData, setExcelData] = useState(null);
  const [assignmentCount, setAssignmentCount] = useState(null);
  const fixedData = [];

  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    let selectedFile = e.target.files;

    const tempArr = [];
    for (let i = 0; i < selectedFile.length; i++) {
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
    setExcelFile(tempArr);
  };
  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    //console.log(excelFile);
    for (let i = 0; i < excelFile.length; i++) {
      if (excelFile[i] !== null) {
        const workbook = XLSX.read(excelFile[i], { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        data.forEach((element) => dataFixer(element));
        //console.log(fixedData);
        dataDeleeter(fixedData);
        assignmentNameCounter(fixedData);
        setExcelData(fixedData);
        console.log(assignmentCount);
      }
    }
  };
  //dataFixer getting the important data
  const dataFixer = (data) => {
    let temp = {};
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
        console.log("Temp being added: " + temp);
        fixedData.push(temp);
        temp = {};
        break;
      }
    }
  };
  const dataDeleeter = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].Total_Points_Earned == data[i].Total_Points_Possible &&
        data[i].Time_Spent > 0
      ) {
        // console.log(
        //   "adding idx: " +
        //     i +
        //     " pnts earned: " +
        //     data[i].Total_Points_Earned +
        //     " pos pnts: " +
        //     data[i].Total_Points_Possible +
        //     " tim spent: " +
        //     data[i].Time_Spent
        // );
      } else {
        // console.log(
        //   "getting rid of idx: " +
        //     i +
        //     " pnts earned: " +
        //     data[i].Total_Points_Earned +
        //     " pos pnts: " +
        //     data[i].Total_Points_Possible +
        //     " tim spent: " +
        //     data[i].Time_Spent
        // );
        data.splice(i, 1);
        i--;
      }
    }
  };
  const assignmentNameCounter = (data) => {
    //pAN = pastAssignmentName
    let pAN = data[0].Assignment_Name;
    let count = 0;
    let temp = {};
    let temp2 = {};
    const tempArr = [];
    //element is the obj ref
    //index is the index of the array
    //array is the whole array
    data.forEach((element, index, array) => {
      //cAN = currentAssignmentName
      let cAN = element.Assignment_Name;
      if (pAN != cAN) {
        pAN = cAN;
        count = 1;
      } else {
        count++;
        temp[pAN] = count;
      }
    });
    // console.log(temp);
    for (const keyVal in temp) {
      temp2[keyVal] = temp[keyVal];
      tempArr.push(temp2);
      temp2 = {};
    }
    // console.log(tempArr)
    setAssignmentCount(tempArr);
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
        {assignmentCount ? (
          <div className="assignmentCount">{assignmentCount.map((assignmentCount, index) => (
            <div key={index}>
              {Object.keys(assignmentCount).map((key) => (
                 <p key={key}>[ {key}: {assignmentCount[key]}]</p>
              ))}
            </div>
          ))}</div>
        ) : (
          <div>No Stats yet</div>
        )}
      </div>
      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key} className="tblLabels">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key} className="tblData">
                        {individualExcelData[key]}
                      </td>
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
