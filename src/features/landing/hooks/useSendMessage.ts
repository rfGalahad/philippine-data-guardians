import { useMutation } from '@tanstack/react-query'

import type { SendMessageFormValues } from '../schema/sendMessageSchema'

async function sendMessage(values: SendMessageFormValues) {
  const data = new FormData()
  data.append('form-name', 'contact')
  data.append('fullName', values.fullName)
  data.append('email', values.emailAddress)
  data.append('message', values.message)

  const response = await fetch('/', {
    method: 'POST',
    body: data,
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return response
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
  })
}