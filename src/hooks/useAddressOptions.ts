import { useMemo } from 'react';
import {
  PROVINCE_OPTIONS,
  getMunicipalityOptions,
  getBarangayOptions
} from '../lib/addressData';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface UseAddressOptionsProps {
  provinceId?: string | null;
  municipalityId?: string | null;
}

//-----------------------------------------------------------
// USE ADDRESS OPTIONS
//-----------------------------------------------------------

export function useAddressOptions({ 
  provinceId, 
  municipalityId 
}: UseAddressOptionsProps ) {
  
  const municipalityOptions = useMemo(
    () => getMunicipalityOptions(provinceId),
    [provinceId]
  );

  const barangayOptions = useMemo(
    () => getBarangayOptions(municipalityId),
    [municipalityId]
  );

  return {
    provinceOptions: PROVINCE_OPTIONS,
    municipalityOptions,
    barangayOptions,
    showMunicipality: Boolean(provinceId),
    showBarangay: Boolean(municipalityId),
  };
}