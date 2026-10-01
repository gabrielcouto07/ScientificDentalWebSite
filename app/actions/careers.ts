"use server";

import { deliverApplication } from "@/lib/careers";
import { processApplication, type CareersState } from "@/lib/careers-submission";
import { consumeLeadRateLimit, requestIp } from "@/lib/rate-limit";

export type { CareersState } from "@/lib/careers-submission";

export async function submitApplication(_prev: CareersState, formData: FormData): Promise<CareersState> {
  return processApplication(formData, { requestIp, consumeLeadRateLimit, deliverApplication });
}
