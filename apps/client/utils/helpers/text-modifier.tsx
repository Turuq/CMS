type imageTitleType = { [key: string]: string };

const imageTitles: imageTitleType = {
  proofOfContact: "Proof of Contact",
  proofOfDelivery: "Proof of Delivery",
  instapayReceipt: "Instapay Receipt",
  proofOfUnreachable: "Proof of Unreachable",
  proofOfPostponement: "Proof of Postponement",
  proofOfGhosting: "Proof of Ghosting",
  proofOfReturn: "Proof of Return",
  proofOfLocation: "Proof of Location",
};

export function getImageTitle(imageKey: string) {
  return imageTitles[imageKey];
}
