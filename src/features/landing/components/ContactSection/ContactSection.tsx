import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

import { ContactDetailsItem } from './ContactDetailsItem';
import { SendMessageForm } from './SendMessageForm';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const CONTACT_ITEMS = [
  { icon: Mail, title: 'Email', description: 'info@philippinedataguardians.org' },
  { icon: Phone, title: 'Phone', description: '(+63) 952 476 2059' },
  { icon: MapPin, title: 'Office Address', description: 'C5 Ext. Paranaque City, Metro Manila' },
];

const BUSINESS_HOURS = [
  { label: 'Monday - Friday', value: '8:00 AM - 5:00 PM' },
  { label: 'Saturday', value: '9:00 AM - 1:00 PM' },
  { label: 'Sunday', value: 'Closed' },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const ContactSection = () => {
  return (
    <div id="contact" className="scroll-mt-16 mt-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 md:col-span-2 md:p-8"
          >
            <h2 className="text-2xl font-bold text-[#053261] md:text-[2.125rem]">
              Protect your <span className="text-amber-600">data</span>. Secure your business.
            </h2>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              Have questions about data privacy or cybersecurity? We&apos;re here
              to help you protect what matters most. Let&apos;s talk.
            </p>
          </motion.div>

          {/* CONTACT DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:col-span-2"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              {CONTACT_ITEMS.map((item) => (
                <ContactDetailsItem
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </motion.div>

          {/* BUSINESS HOURS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:col-span-2"
          >
            <h3 className="mb-2 text-sm font-semibold text-[#053261]">
              Business Hours
            </h3>
            <div className="flex flex-col gap-1">
              {BUSINESS_HOURS.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SEND MESSAGE FORM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-start-3 md:row-start-1 md:row-span-3"
          >
            <SendMessageForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;