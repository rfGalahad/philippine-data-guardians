import { useAppForm } from '@/lib/form'
import Button from '@/components/ui/Button'

import { sendMessageDefaultValues, sendMessageSchema } from '../../schema/sendMessageSchema'
import { useSendMessage } from '../../hooks/useSendMessage'

export const SendMessageForm = () => {

  const sendMessage = useSendMessage()

  const form = useAppForm({
    defaultValues: sendMessageDefaultValues,
    validators: {
      onChange: sendMessageSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      // Silently drop bot submissions — no error shown, just bail
      if (value.botField.trim() !== '') return

      await sendMessage.mutateAsync(value)
      formApi.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex h-full flex-col gap-4"
    >
      {/* HONEYPOT (hidden) */}
      <form.AppField name="botField">
        {(field) => (
          <input
            type="text"
            name="bot-field"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.AppField>

      {/* FULL NAME */}
      <form.AppField name="fullName">
        {(field) => (
          <field.TextField
            label="Full Name"
            placeholder="Enter your name"
          />
        )}
      </form.AppField>

      {/* EMAIL ADDRESS */}
      <form.AppField name="emailAddress">
        {(field) => (
          <field.TextField
            label="Email Address"
            placeholder="Enter your email address"
          />
        )}
      </form.AppField>

      {/* MESSAGE */}
      <form.AppField name="message">
        {(field) => (
          <field.TextField
            label="Message"
            placeholder="Enter your concern..."
            hint="500 characters max."
            multiline
          />
        )}
      </form.AppField>

      {/* SEND MESSAGE BUTTON */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            label="Send Message"
            color="neutral"
            disabled={!canSubmit || sendMessage.isPending}
            loading={isSubmitting || sendMessage.isPending}
          />
        )}
      </form.Subscribe>
    </form>
  )
}

export default SendMessageForm