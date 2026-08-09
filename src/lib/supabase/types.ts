export type PaymentMethod = 'qr' | 'cash' | 'paymongo';
export type PaymentStatus = 'paid' | 'pending'
export type SubscriptionStatus = "active" | "expired" | "upcoming" | "no-subscription";
export type DigitalIdStatus = "issued" | "expired" | "not-issued";

export interface SubscriberDetail {
  subscriberId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptions: {
    subscriptionId: string;
    status: string;
    startedAt: string;
    expiresAt: string | null;
    serviceName: string;
    planName: string;
    payments: Payment[];
  }[];
}

export interface Subscriber {
  subscriber_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  email: string;
  contact_number: string | null;
}

export interface SubscriberFull extends Subscriber {
  created_at: string;
  updated_at: string;
}

export interface Service {
  service_id: string;
  service_name: string;
}

export interface Plan {
  plan_id: string;
  plan_name: string;
}

export interface Payment {
  payment_id: string;
  reference_number: string | null;
  amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  paid_at: string | null;
}

export interface SubscriberDetailRow extends SubscriberFull {
  subscriptions:
    | {
        subscription_id: string;
        status: string;
        started_at: string;
        expires_at: string | null;
        service: Service[] | Service | null;
        plan: Plan[] | Plan | null;
        payments: Payment[] | null;
      }[]
    | null;
}

export type MemberForRemovalRow = {
  photo_url: string | null;
  subscriber: { subscriber_id: string } | { subscriber_id: string }[] | null;
};

export interface AddressRow {
  house_number: string | null;
  street: string | null;
  barangay: string | null;
  city_municipality: string | null;
  province: string | null;
}

export interface DigitalIdRow {
  issued_at: string | null;
  expired_at: string | null;
}

export interface MembersListRawRow {
  member_id: string;
  photo_url: string | null;
  member_status: string;
  subscriber: Subscriber[] | Subscriber | null;
  address: AddressRow[] | AddressRow | null;
  digital_id: DigitalIdRow[] | DigitalIdRow | null;
}

export interface SubscriptionForMemberRow {
  subscriber_id: string;
  subscription_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  plan: Plan[] | Plan | null;
  payments: Payment[] | null;
}

export interface SubscriberSubscriptionRow {
  subscription_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  service: Service[] | Service | null;
  plan: Plan[] | Plan | null;
  payments: Payment[] | null;
}

export interface SubscriberWithSubscriptions extends SubscriberFull {
  subscriptions: SubscriberSubscriptionRow[] | null;
}

export interface MemberDetailRawRow {
  member_id: string;
  photo_url: string | null;
  member_status: string;
  subscriber: SubscriberWithSubscriptions[] | SubscriberWithSubscriptions | null;
  address: AddressRow[] | AddressRow | null;
  digital_id: DigitalIdRow[] | DigitalIdRow | null;
}