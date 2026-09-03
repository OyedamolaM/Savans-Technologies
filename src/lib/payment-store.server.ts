import { getSupabaseServerClient } from "./supabase.server";

export type StoredPayment = {
  reference: string;
  status: "success";
  amountKobo: number;
  amountNaira: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  plan?: string;
  paymentType?: string;
  paidAt: string;
  source: string;
};

type PaymentRow = {
  reference: string;
  status: "success";
  amount_kobo: number;
  amount_naira: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  plan: string | null;
  payment_type: string | null;
  paid_at: string;
  source: string;
};

type PaystackChargeSuccess = {
  data?: {
    reference?: unknown;
    amount?: unknown;
    currency?: unknown;
    customer?: { email?: unknown; first_name?: unknown; last_name?: unknown };
    metadata?: {
      plan?: unknown;
      payment_type?: unknown;
      name?: unknown;
      custom_fields?: Array<{ variable_name?: unknown; value?: unknown }>;
    };
  };
};

export async function listStoredPayments() {
  const { data, error } = await getSupabaseServerClient()
    .from("payment_records")
    .select("*")
    .order("paid_at", { ascending: false });
  if (error) throw new Error(`Could not list payments: ${error.message}`);
  return (data as PaymentRow[]).map(toStoredPayment);
}

export async function listStoredPaymentsForEmail(email: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("payment_records")
    .select("*")
    .ilike("customer_email", email)
    .order("paid_at", { ascending: false });
  if (error) throw new Error(`Could not list customer payments: ${error.message}`);
  return (data as PaymentRow[]).map(toStoredPayment);
}

export async function recordPaystackChargeSuccess(event: Record<string, unknown>) {
  const charge = event as PaystackChargeSuccess;
  const data = charge.data;
  const metadata = data?.metadata;
  const customer = data?.customer;
  const customName = metadata?.custom_fields?.find(
    (field) => field.variable_name === "name",
  )?.value;
  const customerName = [metadata?.name, customName, customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const reference = String(data?.reference ?? "");
  const amountKobo = Number(data?.amount ?? 0);

  if (!reference || !Number.isFinite(amountKobo) || amountKobo <= 0) {
    throw new Error("Paystack webhook is missing a valid payment reference or amount");
  }

  const payment: StoredPayment = {
    reference,
    status: "success",
    amountKobo,
    amountNaira: amountKobo / 100,
    currency: String(data?.currency ?? "NGN"),
    customerName: customerName || undefined,
    customerEmail: customer?.email ? String(customer.email).toLowerCase() : undefined,
    plan: metadata?.plan ? String(metadata.plan) : undefined,
    paymentType: metadata?.payment_type ? String(metadata.payment_type) : undefined,
    paidAt: new Date().toISOString(),
    source: "paystack_webhook",
  };
  const { data: row, error } = await getSupabaseServerClient()
    .from("payment_records")
    .upsert(toPaymentRow(payment), { onConflict: "reference", ignoreDuplicates: true })
    .select()
    .maybeSingle<PaymentRow>();
  if (error) throw new Error(`Could not record payment: ${error.message}`);
  return { payment: row ? toStoredPayment(row) : payment, isNew: Boolean(row) };
}

function toPaymentRow(payment: StoredPayment) {
  return {
    reference: payment.reference,
    status: payment.status,
    amount_kobo: payment.amountKobo,
    amount_naira: payment.amountNaira,
    currency: payment.currency,
    customer_name: payment.customerName ?? null,
    customer_email: payment.customerEmail ?? null,
    plan: payment.plan ?? null,
    payment_type: payment.paymentType ?? null,
    paid_at: payment.paidAt,
    source: payment.source,
  };
}

function toStoredPayment(row: PaymentRow): StoredPayment {
  return {
    reference: row.reference,
    status: row.status,
    amountKobo: row.amount_kobo,
    amountNaira: row.amount_naira,
    currency: row.currency,
    customerName: row.customer_name ?? undefined,
    customerEmail: row.customer_email ?? undefined,
    plan: row.plan ?? undefined,
    paymentType: row.payment_type ?? undefined,
    paidAt: row.paid_at,
    source: row.source,
  };
}
