import { useState } from 'react';

import { useToast } from '@/components/Toast';

import { registerMember } from '@/lib/supabase/members';
import { removeMemberPhoto } from '@/lib/supabase/member-photos';
import { getPlanByTierName } from '@/lib/supabase/plan';

import { useFormContext } from '../context/FormContext';
import { getPhotoUrl, getPlanName } from '../utils/helper';
import { createRegistrationPayload } from '../utils/create-registration-payload';


export const useSubmitRegistration = () => {

  const [loading, setLoading] = useState(false);
  const { formData } = useFormContext();
  const toast = useToast();

  const submitForm = async (): Promise<{ subscriberId: string; subscriptionId: string } | null> => {

    setLoading(true);

    let photoPath: string | null = null;

    try {
      const {
        personalInfo,
        addressDetails,
        membershipType,
        uploadPicture
      } = formData;

      if (!uploadPicture) {
        toast.error("Please upload a photo before proceeding.");
        return null;
      }

      if (!membershipType.tier) {
        toast.error("Please select a membership type.");
        return null;
      }

      // UPLOAD PHOTO AND GET ITS URL
      const { 
        photoUrl, 
        photoPath: uploadedPhotoPath 
      } = await getPhotoUrl(uploadPicture);
      photoPath = uploadedPhotoPath;

      // GET THE SELECTED MEMBERSHIP PLAN
      const plan = await getPlanByTierName(getPlanName(membershipType.tier));

      // CREATE REGISTRATION PAYLOAD
      const payload = createRegistrationPayload({
        personalInfo,
        addressDetails,
        photoUrl,
        plan,
        payment: {method: "paymongo", referenceNumber: "pending"},
        paymentStatus: "pending"
      });

      const result = await registerMember(payload); 
      return { 
        subscriberId: result.subscriber_id, 
        subscriptionId: result.subscription_id 
      };
    } catch (err) {
      if (photoPath) await removeMemberPhoto(photoPath);
      toast.error("Failed submitting registration form.");
      console.error('Submit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    submitForm,
  };
};