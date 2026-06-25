export interface Subdistrict {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface CheckoutFormValues {
    label: string
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    subdistrictId: string;
    subdistrictName: string;
    districtName: string;
    cityName: string;
    provinceName: string;
    postalCode: string;
}