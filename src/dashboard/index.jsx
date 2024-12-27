import React from "react";
import { useUser } from "@clerk/clerk-react";
import GlobalApi from "../../service/GlobalApi";
import { useEffect, useState } from "react";
import ResumeCardItem from "./components/ResumeCardItem";
import AddResume from "./components/AddResume";

function Dashboard() {
    const { user } = useUser();
    //to see all properties of the Clerk user object 
    //console.log('user: ', user);
    const [resumeList, setResumeList] = useState([]);
    useEffect(()=>{
        user && GetResumeList();
    },[user])
    
    //function to get user resume list by calling axios function
    const GetResumeList = () => {
        GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
        .then(resp => {
            if(resp){
                // console.log('resume list response: ', resp); 
                // notice the response object structure
                setResumeList(resp.data.data);
            }else{
                console.log('Error getting resume list, no resume found.');
            }
        },(error) =>{ 
            console.log('Error getting resume list: ', error.message);
        }
    )
    }
    return (
        <div className="p-10 md:px-20 lg:px-32">
            <h2 className="font-bold text-3xl">My Resume</h2>
            <p>Creating your AI resume for next amazing job challenges</p>
            <div className="grid grid-cols-2 
            md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
                <AddResume />
                {resumeList.length>0 ? resumeList.map((item, index)=>(
                    <ResumeCardItem resume={item} key={index} refreshData={GetResumeList}/>
                )) :
                [...Array(3)].map((item, index)=>(
                    <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse' key={index}>
                    </div>
                )) // this is a trick to show a loading animation
                }
            </div>
        </div>
    );
}

export default Dashboard;
