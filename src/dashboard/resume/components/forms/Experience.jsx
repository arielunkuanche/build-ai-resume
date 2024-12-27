import React, { useContext, useState } from 'react'
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import RichTextEditor from '../RichTextEditor';
import { useEffect } from 'react';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '../../../../../service/GlobalApi';

function Experience({ enableNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { toast } = useToast(); 
    const formExperience = {
        title:'',
        companyName:'',
        city:'',
        state:'',
        startDate:'',
        endDate:'',
        workSummery:'',
    };
    const [experienceList, setExperienceList] = useState([
        formExperience
    ]);
    useEffect(()=>{
        resumeInfo?.experience.length > 0 && setExperienceList(resumeInfo?.experience);
        //console.log('Resume info in Experience: ', resumeInfo, experienceList);
    }, []);
    useEffect(()=>{
        // console.log('Experience list: ', experienceList);
        setResumeInfo({
            ...resumeInfo,
            experience: experienceList
        });
    },[experienceList]);

    const handleInputChange = (index, e) => {
        const newInput = experienceList.slice();
        const { name, value}  = e.target;
        newInput[index][name] = value;
        //console.log('New input in experience form: ', newInput);
        setExperienceList(newInput);
    };
    const handleRichTextEditorChange = (index, e, name) => {
        const newEntry = experienceList.slice();
        newEntry[index][name] = e.target.value;
        //console.log('New entry in rich text editor: ', newEntry);
        setExperienceList(newEntry);
    };
    const handleAddExperience = () => {
        setExperienceList([...experienceList, formExperience]); 
    };
    const handleRemove = () => {
        setExperienceList(experienceList.slice(0, -1));
    };
    const onSave = async () => {
        setLoading(true);
        //console.log('data in Experience: ', experienceList);
        const data = {
            data: {
                experience : experienceList.map((id) => ({
                    title: id.title,
                    companyName: id.companyName,
                    city: id.city,
                    state: id.state,
                    startDate: id.startDate,
                    endDate: id.endDate,
                    workSummery: id.workSummery
                }))
            }
        }
        try {
            console.log('Data to update in experience: ', data);
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp){
                console.log('Resume experience updated: ', resp, resp.data);
                enableNext(true);
                toast({
                    title: 'Saved',
                    description: 'Work experience has been updated.',
                })
            }else{
                toast({
                    title:'Error',
                    description: `Failed to update skills. ${resp?.message}`,
                })
            }
        } catch (error) {
            console.error('Error updating resume: ', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
                <h2 className='font-bold text-lg'> Work Experience</h2>
                <p>Add your professional experience here</p>
                <div>
                    {experienceList?.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-2 border p-3 my-5 rounded-lg gap-3'> 
                                <div>
                                    <label>Position Title</label>
                                    <Input name="title" defaultValue={item?.title} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>Company Name</label>
                                    <Input name="companyName" defaultValue={item?.companyName} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>City</label>
                                    <Input name="city" defaultValue={item?.city} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>State/Country</label>
                                    <Input name="state" defaultValue={item?.state} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>Start date</label>
                                    <Input type="date" name="startDate" defaultValue={item?.startDate} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>End date</label>
                                    <Input type="date" name="endDate" defaultValue={item?.endDate} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div className='col-span-2'>
                                    {/* RichTextEditor must have a property index to get ExperienceList array item */}
                                    {/* make sure to implement the defaultValue prop in RichTextEditor to fetch content fill in the editor */}
                                    <RichTextEditor index={index} defaultValue={item?.workSummery} onRichTextEditorChange={(e)=>handleRichTextEditorChange(index, e, 'workSummery')}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-3'>
                        <Button variant='outline' className='text-primary' size='sm' onClick={handleAddExperience}> + Add More Experience</Button>
                        <Button variant='outline' className='text-primary' size='sm' onClick={handleRemove}> - Remove</Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Experience