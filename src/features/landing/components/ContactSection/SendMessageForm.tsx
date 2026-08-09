import { useState } from 'react';

import { useForm } from '@/hooks/useForm';
import { email, maxLength, minLength, required } from '@/utils/validators';

import CustomField from '@/components/ui/CustomField';
import Button from '@/components/ui/Button';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const INITIAL_VALUES = {
  fullName: '',
  emailAddress: '',
  message: '',
  botField: ''
};

const VALIDATION_RULES = {
  fullName: [required()],
  emailAddress: [required(), email()],
  message: [minLength(20), maxLength(500)],
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const SendMessageForm = () => {

  const [botField, setBotField] = useState('');

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validationRules: VALIDATION_RULES,
    onSubmit: async (values) => {
      if (values.botField.trim() !== "") return; 

    const data = new FormData();
    data.append("form-name", "contact");
    data.append("fullName", values.fullName);
    data.append("email", values.emailAddress);
    data.append("message", values.message);

    try {
      await fetch("/", {
        method: "POST",
        body: data,
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    },
  });

  return (
    <form 
      onSubmit={form.handleSubmit} 
      className="flex h-full flex-col gap-4"
    >
      {/* HONEYPOT (hidden) */}
      <input
        type="text"
        name="bot-field"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        value={botField}
        onChange={(e) => setBotField(e.target.value)}
      />

      {/* FULL NAME */}
      <CustomField
        id="fullName"
        name="fullName"
        label="Full Name"
        placeholder="Enter your name"
        value={form.values.fullName}
        onChange={form.handleChange}
        error={form.errors.fullName}
      />

      {/* EMAIL ADDRESS */}
      <CustomField
        id="emailAddress"
        name="emailAddress"
        label="Email Address"
        placeholder="Enter your email address"
        value={form.values.emailAddress}
        onChange={form.handleChange}
        error={form.errors.emailAddress}
      />

      {/* MESSAGE */}
      <CustomField
        id="message"
        name="message"
        label="Message"
        placeholder="Enter your concern..."
        hint="500 characters max."
        value={form.values.message}
        onChange={form.handleChange} 
        error={form.errors.message}
        multiline
      />

      {/* SEND MESSAGE BUTTON */}
      <Button
        type="submit"
        label="Send Message"
        color="neutral"
        disabled={form.isSubmitting}
        loading={form.isSubmitting}
      />
    </form>
  );
};

export default SendMessageForm;