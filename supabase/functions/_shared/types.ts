
export interface Service {
  service_id: string;
  service_name: string;
}

export type MemberForRemovalRow = {
  photo_url: string | null;
  subscriber: { subscriber_id: string } | { subscriber_id: string }[] | null;
};

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