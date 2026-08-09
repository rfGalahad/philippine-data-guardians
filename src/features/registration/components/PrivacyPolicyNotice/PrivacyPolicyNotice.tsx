import { useState, type ReactNode } from 'react';
import { FileText, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button';

import { AgreeCheckbox } from './AgreeCheckbox';


//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface PrivacyPolicyProps {
  handleNext: () => void;
}

interface NoticeItem {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const NOTICE: NoticeItem[] = [
  {
    icon: <FileText size={18} className="text-[#053261]" />,
    title: 'Membership Application Notice',
    content: `I hereby apply for membership with Philippine Data Guardians (PDG)
    and voluntarily provide my personal information for the purpose of processing
    my membership application, identification, communication, and access to member benefits.`,
  },
  {
    icon: <Lock size={18} className="text-[#053261]" />,
    title: 'Data Privacy Statement',
    content: (
      <>
        I understand that PDG will collect, use, and store my personal data in accordance with
        the{' '}
        <span className="border-b-[1.5px] border-[rgba(5,50,97,0.3)] pb-px font-bold text-[#053261]">
          Data Privacy Act of 2012 (Republic Act 10173)
        </span>{' '}
        and its implementing rules and regulations. My information will be kept confidential
        and will not be shared with third parties without my explicit consent, unless required
        by law.
      </>
    ),
  },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PrivacyPolicyNotice = ({ handleNext }: PrivacyPolicyProps)  => {

  const [agree, setAgree] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* PRIVACY POLICY */}
      <div className="flex flex-col gap-6 p-6">
        {NOTICE.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {item.icon}
                <h3 className="font-bold leading-tight text-[#053261]">{item.title}</h3>
              </div>
              <p className="text-justify text-sm leading-relaxed text-[#5a7396]">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKBOXES */}
      <AgreeCheckbox agree={setAgree}/>

      {/* Divider */}
      <hr className="border-[rgba(5,50,97,0.08)]" />

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50">
        <Button
          label="Go Back"
          variant="outlined"
          color="white"
          onClick={() => navigate(-1)}
          className='flex-1'
        />
        <Button
          label="Continue to Registration"
          disabled={!agree}
          variant='filled'
          color='neutral'
          onClick={() => handleNext()}
          className='flex-3'
        />
      </div>
    </div>
  );
};


export default PrivacyPolicyNotice;