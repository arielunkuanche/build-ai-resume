import React, { useContext, useState } from 'react';
import { 
    BtnBold,
    BtnItalic,
    Editor,
    EditorProvider,
    Toolbar,
    BtnBulletList,
    BtnLink,
    BtnNumberedList,
    BtnUnderline,
    BtnUndo,
    BtnRedo,
    Separator,
} from 'react-simple-wysiwyg';
import { Button } from '../../../components/ui/button';
import { Combine, LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { useToast } from "@/hooks/use-toast"
import { AIChatSession }  from '../../../../service/AIModal';


function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const prompt = `position title: {position}. Based on my position title, generate 3-4 bullet points for my experience in the resume. 
                    Quantify achievement whenever possible. Use numbers and percentages to demonstrate the impact of work. 
                    Use action verbs to start each bullet points. Avoid using jargon or overly technical language. 
                    Return the result in raw HTML format as an unordered list (<ul>) with each bullet point wrapped inside a <li> tag.`;
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    
    const generateSummaryFromAI = async () => {
        try {
            setLoading(true);
            if(!resumeInfo.experience[index].title){
                toast({
                    title: "Error",
                    description: "Please enter the position title first.",
                    status: "error"
                });
                return;
            }
            const dynamicPrompt = prompt.replace('{position}', resumeInfo?.experience[index].title);
            const result = await AIChatSession.sendMessage(dynamicPrompt);
            if(result){
                const response = result.response.text();
                console.log('AI generate work response: ', response);
                const formattedResponse = response.replace(/^\{/, '') // Remove leading '{'
                                                    .replace(/\}$/, '') // Remove trailing '}'
                                                    .replace(/^\s*"[^"]+":\s*"/, '') // Remove property name (e.g., "bullet_points":)
                                                    .replace(/"\s*$/, '') // Remove trailing '"'
                                                    .trim(); // Remove extra whitespace
                setValue(formattedResponse);
                setResumeInfo({
                    ...resumeInfo,
                    experience: resumeInfo.experience.map((item, i) => {
                        if(i === index){
                            return {
                                ...item,
                                workSummery: response.replace(/^\{/, '') // Remove leading '{'
                                                    .replace(/\}$/, '') // Remove trailing '}'
                                                    .replace(/^\s*"[^"]+":\s*"/, '') // Remove property name (e.g., "bullet_points":)
                                                    .replace(/"\s*$/, '') // Remove trailing '"'
                                                    .trim() // Remove extra whitespace
                            }
                        }
                        return item;
                    })
                })
                // const response = await (JSON.parse(result.response.text()));
                // let summaryArray = [];
                // for (const key in response) {
                //     if (response.hasOwnProperty(key)) {
                //         const element = response[key];
                //         summaryArray.push(element);
                //     }
                // }
                // console.log('Summary array: ', summaryArray);
                // setValue(summaryArray.join('\n'));
            }else{
                console.error('Error generating summary: ', result);
            }
        } catch (error) {
            console.error('Error generating summary: ', error.message);
        } finally {
            setLoading(false);   
        }
    };
    return (
        <div>
            <div className='flex justify-between items-end mb-3'>
                <div>
                    <label className='font-bold text-primary'>Generate summary</label>
                    <p className='text-xs text-primary'>Review generated results based on your actual experience and keep the final take-away concise</p>
                </div>
                {/* here the Button has to explicitly indicate the type as a 'button' or else it will trigger the form submit action */}
                <Button type='button' className='border-primary text-primary flex gap-2' size='sm' variant='outlined' onClick={()=>generateSummaryFromAI()}> 
                    {loading ? <LoaderCircle className='animate-spin' size={20}/> : <Combine className='h-4 w-4'/> } Generate from AI 
                </Button>
            </div>
            <EditorProvider>
                <Editor 
                    value={value} 
                    onChange={(e)=>{
                        setValue(e.target.value);
                        onRichTextEditorChange(e);
                }}>
                    <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    
    )
}

export default RichTextEditor