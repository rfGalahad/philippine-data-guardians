
// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

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