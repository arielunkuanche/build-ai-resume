// utilize axios to fetch data from the Strapi API
import axios from 'axios';

//const { default: axios} = require("axios");
// import the strapi api token
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const axiosClient = axios.create({
        baseURL:'http://localhost:1337/api/',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
})

// the api endpoint from Strapi is the base url + create endpoint under User-resume collection
const CreateNewResume = (data) => axiosClient.post('/user-resumes', data); 
// to fetch all resumes from the same user in the find token endpoint
// use strapi filters to get the resumes by the user email, detail usage can see its documentation
const GetUserResumes = (userEmail) => axiosClient.get('/user-resumes?filters[userEmail][$eq]=' + userEmail);
// to update the resume, use the put method with dynamic resume id and the data to be updated
// data is the object to be updated in the Strapi database with internal structure as data:object
const UpdateResume = (id, data) => axiosClient.put('/user-resumes/' + id, data)
// to find one individual resume by dynamic resume id with populate to fetch all related data or else it will not return experience, education, etc.
const GetResumeById = (id) => axiosClient.get('/user-resumes/' + id + '?populate=*');
const DeleteResumeById = (id) => axiosClient.delete('/user-resumes/' + id);



// export the function to be used in other components
export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResume,
    GetResumeById, 
    DeleteResumeById,
}