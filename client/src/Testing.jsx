import React, { useState } from 'react';
import axios from './Utils/axiosService';
import { toast } from 'react-toastify';

const UploadCSV = () => {
  const [file, setFile] = useState();

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('campID', 'neworg::fecd78453d38a5bf')

    await axios.post('/lead/uploadLeads', formData, {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent);
      },
    }).then(res=>{
        toast.success(res.data.message)
        console.log("Success :",res.data)
    }).catch(err=>{
        toast.error(err.response.data.error.message)
        console.log("Error :",err)
    })
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" max="209" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadCSV;
