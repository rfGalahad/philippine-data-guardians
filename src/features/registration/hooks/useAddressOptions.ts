import { useMemo } from 'react';

import barangayData from '../data/barangay.json';
import municipalityData from '../data/municipality.json';
import provinceData from '../data/province.json';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface Province {
  province_id: number;
  region_id: number;
  province_name: string;
}

interface Municipality {
  municipality_id: number;
  municipality_name: string;
  province_id: number;
  [key: string]: unknown;
}

interface Barangay {
  barangay_id: number;
  barangay_name: string;
  municipality_id: number;
  [key: string]: unknown;
}

interface ProvinceOption extends Province {
  label: string;
  value: string;
}

interface MunicipalityOption extends Municipality {
  label: string;
  value: string;
}

interface BarangayOption extends Barangay {
  label: string;
  value: string;
}

// FORM VALUES PASSED IN
export interface AddressFormValues {
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  [key: string]: unknown;
}

// HOOK RETURN TYPE
interface UseAddressOptionsReturn {
  showMunicipality: boolean;
  showBarangay: boolean;
  showStreet: boolean;
  PROVINCE_OPTIONS: ProvinceOption[];
  FILTERED_MUNICIPALITY_OPTIONS: MunicipalityOption[];
  FILTERED_BARANGAY_OPTIONS: BarangayOption[];
  selectedProvinceLabel: string;
  selectedMunicipalityLabel: string;
  selectedBarangayLabel: string;
}

//-----------------------------------------------------------
// MAIN CUSTOM HOOK
//-----------------------------------------------------------

export const useAddressOptions = (
  values: AddressFormValues
): UseAddressOptionsReturn => {

  // PROVINCE DROPDOWN LIST
  const PROVINCE_OPTIONS: ProvinceOption[] = useMemo(() => {
  return (provinceData as Province[]).map((province) => ({
    label: province.province_name,
    value: String(province.province_id),
    ...province,
  }));
}, []);

  // CITY/MUNICIPALITY DROPDOWN LIST
  const MUNICIPALITY_OPTIONS: MunicipalityOption[] = useMemo(() => {
    return (municipalityData as Municipality[]).map((municipality) => ({
      label: municipality.municipality_name,
      value: String(municipality.municipality_id),
      ...municipality,
    }));
  }, []);

  // BARANGAY DROPDOWN LIST
  const BARANGAY_OPTIONS: BarangayOption[] = useMemo(() => {
    return (barangayData as Barangay[]).map((barangay) => ({
      label: barangay.barangay_name,
      value: String(barangay.barangay_id),
      ...barangay,
    }));
  }, []);

  // SELECTED IDs
  const selectedProvince = values.province;
  const selectedMunicipality = values.cityMunicipality;

  // MUNICIPALITIES UNDER SELECTED PROVINCE
  const FILTERED_MUNICIPALITY_OPTIONS: MunicipalityOption[] = useMemo(() => {
    const province_id = values.province ? Number(values.province) : null;

    if (province_id) {
      return MUNICIPALITY_OPTIONS.filter(
        (municipality) => municipality.province_id === province_id
      );
    }
    return [];
  }, [values.province, MUNICIPALITY_OPTIONS]);

  // BARANGAYS UNDER SELECTED CITY/MUNICIPALITY
  const FILTERED_BARANGAY_OPTIONS: BarangayOption[] = useMemo(() => {
    const municipality_id = values.cityMunicipality ? Number(values.cityMunicipality) : null;

    if (municipality_id) {
      return BARANGAY_OPTIONS.filter(
        (barangay) => barangay.municipality_id === municipality_id
      );
    }
    return [];
  }, [values.cityMunicipality, BARANGAY_OPTIONS]);

  const selectedProvinceLabel = useMemo(() => {
    return PROVINCE_OPTIONS.find((p) => p.value === values.province)?.label ?? '';
  }, [PROVINCE_OPTIONS, values.province]);

  const selectedMunicipalityLabel = useMemo(() => {
    return FILTERED_MUNICIPALITY_OPTIONS.find((m) => m.value === values.cityMunicipality)?.label ?? '';
  }, [FILTERED_MUNICIPALITY_OPTIONS, values.cityMunicipality]);

  const selectedBarangayLabel = useMemo(() => {
    return FILTERED_BARANGAY_OPTIONS.find((b) => b.value === values.barangay)?.label ?? '';
  }, [FILTERED_BARANGAY_OPTIONS, values.barangay]);

  // CONTROLS WHAT FIELDS TO SHOW
  const showMunicipality = Boolean(selectedProvince);
  const showBarangay = Boolean(showMunicipality && selectedMunicipality);
  const showStreet = Boolean(showBarangay && values.barangay);

  return {
    showMunicipality,
    showBarangay,
    showStreet,
    PROVINCE_OPTIONS,
    FILTERED_MUNICIPALITY_OPTIONS,
    FILTERED_BARANGAY_OPTIONS,
    selectedProvinceLabel,
    selectedMunicipalityLabel,
    selectedBarangayLabel,
  };
};

export function resolveAddressNames(values: {
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
}) {
  const province = (provinceData as Province[]).find(
    (p) => String(p.province_id) === values.province
  );
  const municipality = (municipalityData as Municipality[]).find(
    (m) => String(m.municipality_id) === values.cityMunicipality
  );
  const barangay = (barangayData as Barangay[]).find(
    (b) => String(b.barangay_id) === values.barangay
  );

  return {
    provinceName: province?.province_name ?? '',
    cityMunicipalityName: municipality?.municipality_name ?? '',
    barangayName: barangay?.barangay_name ?? '',
  };
}