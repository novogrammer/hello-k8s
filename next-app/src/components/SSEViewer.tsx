"use client";

import { useEffect,  useState } from "react";

export default function SSEViewer(){
  const [message, setMessage] = useState('');

  useEffect(() => {
    
    console.log("useEffect");
    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setMessage(prev => prev + "(おわり)");
        eventSource.close();
      }else{
        setMessage(prev => prev + event.data);
      }
    };
    eventSource.onerror = (err) => {
      console.error('SSE error', err);
    }

    return () => {
      eventSource.close();
    };
  }, []);

  return (
      <p>{message}</p>
  );
}