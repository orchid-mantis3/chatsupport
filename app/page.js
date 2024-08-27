'use client'

import { Box, Stack, TextField, Button, Typography } from "@mui/material"
import { useState } from "react";

export default function Home() {
  const [history, setHistory] = useState([])
  const firstMessage = "Hi there! I'm the Headstarter virtual assistant. How can I help?"
  
  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    setHistory((history) => [ ...history, {role: "user", parts: [{text: message}]} ])
    setMessage('')

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify([ ...history, {role: "user", parts: [{text: message}]} ])
    })

    const data = await response.json()

    setHistory((history) => [ ...history, {role: "model", parts: [{text: data}] }])
  }
  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      flexDirection="column"
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Stack 
        direction={'column'} 
        justifyContent={'flex-start'}
        width='500px'
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack direction={'column'} spacing={2} overflow={'auto'} flexGrow={1} maxHeight="100%">
          <Box
            display={'flex'}
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
            bgcolor={
              message.role === 'assistant'
                ? 'primary.main'
                : 'secondary.main'
            }
            borderRadius={10}
            p={2}
          >
            <Typography
              bgcolor={'secondary.main'}
              color={'white'}
            >
              {firstMessage}
            </Typography>
          </Box>
          {history.map((textObject, index) => (
              <Box
              key={index}
              display="flex"
              justifyContent={
                textObject.role === 'user' ? 'flex-end' : 'flex-start'
              }
            >
              <Box
                bgcolor={
                  textObject.role === 'user'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {textObject.parts[0].text}
                
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2} width={'80%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <TextField label='Message' value={message} onChange={(e => setMessage(e.target.value))} fullWidth></TextField>
          <Button variant='contained' onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}