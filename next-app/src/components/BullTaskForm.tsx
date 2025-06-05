"use client";
import { useState } from "react";
import styles from "./HeavyTaskForm.module.scss";

interface FormData{
  message:string;
}

interface ResponseDataOk{
  ok:true;
  id:string;
}
interface ResponseDataNg{
  ok:false;
  message:string;
}
type ResponseData = 
  | ResponseDataOk
  | ResponseDataNg;

export default function BullTaskForm(){
  const [formData, setFormData] = useState<FormData>({message:""});
  const [errorMessage,setErrorMessage]=useState<string>("");
  const [log,setLog]=useState<string>("");
  
  const onSubmit=async (event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    try{
      const body=Object.assign({},formData);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if(!res.ok){
        const responseData=await res.json() as ResponseData;
        if(!responseData.ok){
          throw new Error(responseData.message);
        }else{
          throw new Error("!res.ok && !!result.ok");
        }
      }
      
      const responseData=await res.json() as ResponseData;
      if(!responseData.ok){
        throw new Error("!res.ok && !!result.ok");
      }else{
        const eventSource = new EventSource(`/api/jobs/${responseData.id}/sse`);
        eventSource.onmessage = (event) => {
          if (event.data === '[DONE]') {
            setLog(prev => prev + "(おわり)");
            eventSource.close();
          }else{
            setLog(prev => prev + event.data);
          }
        };
        eventSource.onerror = (err) => {
          console.error('SSE error', err);
        }
        eventSource.addEventListener("progress",(event)=>{
            setLog(prev => prev + event.data);
        });
        eventSource.addEventListener("failed",(event)=>{
            setErrorMessage(() => event.data);
        });
        eventSource.addEventListener("completed",(event)=>{
            setLog(prev => prev + event.data);
        });

        
      }
      

    }catch(error){
      if(error instanceof Error){
        setErrorMessage(()=>error.message as string)
      }else{
        setErrorMessage(()=>""+error);
      }

    }

  };
  const onChangeMessage=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData((prev)=>{
      const message=event.target.value;
      return {...prev,message}
    });
  };
  return <div className={styles["component"]}>
    <form className={styles["component__form"]} onSubmit={onSubmit}>
      <input className={styles["component__message"]} type="text" onChange={onChangeMessage} value={formData.message}/>
      <button className={styles["component__submit"]} type="submit">Submit</button>
    </form>
    <div className={styles["component__error"]}>{errorMessage}</div>
    <div className={styles["component__log"]}>{log}</div>
  </div>
}