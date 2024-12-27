import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Button } from '../../../../components/ui/button';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { LoaderCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"


function PersonalDetail({ enableNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { toast } = useToast(); // destructuring the toast function from the custom hook useToast so use {}
    
    useEffect(()=>{
        // the params display resumeId instead of documentId as in backend strapi collection record has the property field is resumeId, like firstName, lastName
        console.log('Resume info in personal detail useEffect: ', params?.resumeInfo);
    },[]);
    
    const handleInputChange = (e) => {
        enableNext(false);
        const { name, value } = e.target; // object destructing to extract name and value properties from event target object
        
        setFormData({
            ...formData,
            [name]: value
        });
        setResumeInfo({
            ...resumeInfo,
            [name]: value // directly maps the properties of the resumeInfo object with the input name attribute
            
        });
        console.log('Resume info in personal detail handleInput: ', resumeInfo);
    };
    const onSave =async (e) => {
        e.preventDefault(); // as in form component it will refresh after submit the preventDefault will stop the refresh
        setLoading(true);
        //console.log('Form data in personal details: ', formData);
        const data = {
                data: formData // refers to Strapi PUT documentation format to update record
        };
        try {
            // console.log('Data to update in personal detail: ', data);
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp){
                //console.log('Resume updated: ', resp.data);
                enableNext(true);
                toast({
                    title: "Saved",
                    description: "Personal details have been updated.",
                })
            }else{
                console.error('Update failed: ', resp);
            }
        } catch (error) {
            console.error('Error updating resume: ', error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
            <h2 className='font-bold text-lg'> Personal Details</h2>
            <p>Get started with personal details input</p>
            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <div >
                        <Label className='text-sm'>First Name</Label>
                        <Input name="firstName" required defaultValue={resumeInfo?.firstName} onChange={handleInputChange}/>
                    </div>
                    <div >
                        <Label className='text-sm'>Last Name</Label>
                        <Input name="lastName" required defaultValue={resumeInfo?.lastName} onChange={handleInputChange}/>
                    </div>
                    <div className='col-span-2' >
                        <Label className='text-sm'>Job Title</Label>
                        <Input name="jobTitle" required defaultValue={resumeInfo?.jobTitle} onChange={handleInputChange} />
                    </div>
                    <div className='col-span-2' >
                        <Label className='text-sm'>Address</Label>
                        <Input name="address" required defaultValue={resumeInfo?.address} onChange={handleInputChange} />
                    </div>
                    <div >
                        <Label className='text-sm'>Phone</Label>
                        <Input name="phone" required defaultValue={resumeInfo?.phone} onChange={handleInputChange} />
                    </div>
                    <div >
                        <Label className='text-sm'>Email</Label>
                        <Input name="email" required defaultValue={resumeInfo?.email} onChange={handleInputChange} />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type='submit'disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PersonalDetail