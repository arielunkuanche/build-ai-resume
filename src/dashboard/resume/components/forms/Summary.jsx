import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import { Button } from '../../../../components/ui/button';
import { Textarea } from '../../../../components/ui/textarea';
import GlobalApi from '../../../../../service/GlobalApi';
import { Combine, LoaderCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { AIChatSession }  from '../../../../../service/AIModal';

function Summary({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();
  const prompt = 'Job Title: {jobTitle}. Depends on job title give me list of summary for Experience level, Mid Level and Fresher level in 3-4 lines in array format. With summary and experience_level Field in JSON Format';
  const [AIGeneratedSummaryList, setAIGeneratedSummaryList] = useState([]);

  useEffect(()=>{
    //console.log('Resume info and params in summary: ', resumeInfo, params);
    summary&&setResumeInfo({
      ...resumeInfo,
      summery: summary
    })
  },[summary]);
  const generateSummaryFromAI = async () => {
    try {
      setLoading(true);
      const dynamicPrompt = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
      //console.log('Dynamic prompt: ', dynamicPrompt);
      const result = await AIChatSession.sendMessage(dynamicPrompt);
      if(result){
        // console.log(result.response.text());
        setAIGeneratedSummaryList(JSON.parse(result.response.text()));
      }else{
        console.error('Error generating summary: ', result);
      }
    } catch (error) {
      console.error('Error generating summary: ', error.message);
    } finally{
      setLoading(false);
    }
  };
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
        console.log('data in Summary: ', summary);
        const data = {
            data: {
              summery : summary // 'summery' property name must be the same as Strapi collection field name
            }
        }
        try {
            console.log('Data to update in summary: ', data);
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp){
                console.log('Resume updated: ', resp.data);
                enableNext(true);
                toast({
                    title: "Saved",
                    description: "Introduction summary has been updated.",
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
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
        <h2 className='font-bold text-lg'> Introduction summary</h2>
        <p>Type in a short introduction summary for your background</p>
        <form className='mt-6' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add the summary</label>
            {/* here the Button has to explicitly indicate the type as a 'button' or else it will trigger the form submit action */}
            <Button type='button' className='border-primary text-primary flex gap-2' size='sm' variant='outlined' onClick={()=>generateSummaryFromAI()}> 
              <Combine className='h-4 w-4'/> Generate from AI
            </Button>
          </div>
          <Textarea className='mt-5' required value={summary} defaultValue={resumeInfo?.summery} onChange={(e)=>setSummary(e.target.value)}/>
          <div className='mt-3 flex justify-end'>
            {/* here the Button is the main function to submit the form so the type is 'submit' */}
            <Button type='submit' disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
      {AIGeneratedSummaryList.length > 0 && 
      <div className='my-5'>
        <h2 className='font-bold text-lg'>Suggestions</h2>
        {AIGeneratedSummaryList?.map((item, index)=>(
          <div className='p-5 shadow-lg my-4 rounded-lg cursor-pointer' key={index} onClick={()=>setSummary(item?.summary)}>
            <h2 className='font-bold my-1'>Level: {item?.experience_level}</h2>
            <p>{item?.summary}</p>
          </div>
        ))}
      </div>}
    </div>
  )
}

export default Summary