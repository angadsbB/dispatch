import type { Company, Contact, FundingEvent } from "./types";
import { formatUsd } from "./format";

function firstName(fullName: string): string {
  return fullName.split(" ")[0] ?? fullName;
}

export function generateNote(
  contact: Pick<Contact, "fullName">,
  company: Pick<Company, "name" | "industry">,
  event: Pick<FundingEvent, "round" | "amountUsd" | "leadInvestor">,
): string {
  const name = firstName(contact.fullName);
  const amount = formatUsd(event.amountUsd);
  const lead = event.leadInvestor;
  const co = company.name;
  const round = event.round;

  switch (round) {
    case "Seed":
      return `${name} — congratulations on the Seed round. Raising ${amount} with ${lead} behind you is a strong start for ${co}. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.`;
    case "Series A":
      return `Congrats on the Series A, ${name}. Closing ${amount} with ${lead} leading is a real milestone for ${co}. Enjoy the cookies, and if it's ever useful to compare notes on scaling ${company.industry} as you grow, I'm around.`;
    case "Series B":
      return `${name}, a ${amount} Series B led by ${lead} is a different kind of problem set for ${co}. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.`;
    case "Series C":
      return `${name} — a ${amount} Series C led by ${lead} is the kind of round the whole ${company.industry} stack notices. A small congratulations for the ${co} team. If a conversation would ever help, I'm easy to find.`;
    default:
      return `${name}, saw ${co}'s ${round} with ${lead} at ${amount}. Congratulations to you and the team. Sending something over; would welcome a conversation if the timing is right.`;
  }
}
