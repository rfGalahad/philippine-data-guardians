import QRCode from 'react-qr-code';

import Logo from '@/assets/logo-pdg-1.png';

import { getFullAddress, getInitials } from '@/utils/string';
import type { PlanName } from '@/lib/supabase/types';
import type { MemberDetail } from '@/lib/supabase/members';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface IDTemplateProps {
  memberId: string;
  fullName: string;
  photoUrl?: string | null;
  plan: PlanName | null;
  address: MemberDetail['address'];
}

//-----------------------------------------------------------
// ID TEMPLATE
//-----------------------------------------------------------

export const IDTemplate = ({ 
  memberId,
  fullName,
  photoUrl,
  plan, 
  address
}: IDTemplateProps) => {

  const fullAddress = address
    ? getFullAddress({
        houseNumber: address.houseNumber ?? undefined,
        street: address.street ?? undefined,
        barangay: address.barangay ?? undefined,
        cityMunicipality: address.cityMunicipality ?? undefined,
        province: address.province ?? undefined,
      })
    : '—';

  return (
    <div className="relative flex flex-col gap-4 p-4 w-full rounded-lg overflow-hidden text-white bg-[linear-gradient(to_bottom,#0A4787_0%,#053261_100%)]">
      {/* HEADER */}
      <div className="w-full flex">
        {/* PDG Logo */}
        <div className="flex items-center gap-2 mt-1">
          <img src={Logo} alt="Logo" className="h-6" />
          <div className="text-sm font-semibold">
            PHILIPPINE DATA <span className="text-accent">GUARDIANS</span>
          </div>
        </div>

        {/* Membership ID */}
        <div className="absolute right-0 border-white rounded-l-sm px-3 py-1 bg-[linear-gradient(to_right,#FFCC00_0%,#D4AF37_50%,#B8860B_100%)]">
          <span className="text-sm font-bold text-text-primary">
            MEMBERSHIP ID
          </span>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            className="w-45 h-45 rounded border-2 border-white object-cover"
          />
        ) : (
          <div className="flex w-45 h-45 shrink-0 items-center justify-center rounded border-2 border-white bg-white/10 text-2xl font-bold">
            {getInitials(fullName)}
          </div>
        )}

        <div className="z-1 flex flex-col justify-between">
          <div className='flex flex-col'>
            <div className="flex gap-1 items-center">
              <span className="text-sm font-semibold text-accent">
                {plan ?? "PLAN_NAME"}
              </span>
            </div>
            <span className="text-base font-semibold text-left">
              {fullName ?? "MEMBER_FULL_NAME"}
            </span>
            <span className="text-xs text-left">
              {fullAddress ?? "MEMBER_FULL_ADDRESS"}
            </span>
          </div>

          <div className="h-auto max-w-16 w-full">
            <QRCode
              size={180}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={memberId}
              viewBox="0 0 256 256"
            />
          </div>
        </div>
      </div>

      {/* LOGO BACKGROUND */}
      <img
        src={Logo}
        alt=""
        className="absolute -bottom-25 right-1 w-auto h-75 opacity-10"
      />
    </div>
  );
};