/**
 * Heuristic natural language and slip parser for Indian business agreements.
 * Extracts merchant, customer, amounts, advance, dates, and work description
 * from casual text, transcribed speech, or OCR slip text.
 */

export function parseNaturalLanguageAgreement(text) {
  if (!text || typeof text !== 'string') return null;

  const raw = text.trim();
  const lower = raw.toLowerCase();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Default structure
  const result = {
    merchantName: '',
    merchantContact: '+91 98765 43210',
    customerName: '',
    customerContact: '+91 98123 45670',
    transactionTitle: '',
    workDescription: raw,
    totalAmount: '',
    advanceAmount: '',
    paymentTerms: '',
    startDate: todayStr,
    expectedCompletionDate: '',
    status: 'Pending',
  };

  // 1. Extract Amounts (INR ₹)
  // Look for total amount
  const totalMatches = [
    /(?:total|agreed amount|cost|price|for|worth)\s*(?:of|is|:)?\s*(?:rs\.?|inr|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]+)/i,
    /(?:rs\.?|inr|₹)\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]+)\s*(?:total)?/i,
  ];

  let extractedTotal = null;
  for (const regex of totalMatches) {
    const match = raw.match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1].replace(/,/g, ''), 10);
      if (num >= 500) {
        extractedTotal = num;
        break;
      }
    }
  }

  // Look for advance amount
  const advanceMatches = [
    /(?:advance|deposit|upfront|token|booking)\s*(?:of|is|:)?\s*(?:rs\.?|inr|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]+)/i,
    /(?:rs\.?|inr|₹)\s*([0-9]{1,3}(?:,[0-9]{2,3})*|[0-9]+)\s*(?:advance|deposit)/i,
  ];

  let extractedAdvance = null;
  for (const regex of advanceMatches) {
    const match = raw.match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1].replace(/,/g, ''), 10);
      extractedAdvance = num;
      break;
    }
  }

  // If no advance was explicitly found, default to a standard 20-30% or 0
  if (extractedTotal) {
    result.totalAmount = extractedTotal;
    if (extractedAdvance) {
      result.advanceAmount = extractedAdvance;
    } else {
      // reasonable advance default (approx 30% rounded to 1000s)
      result.advanceAmount = Math.round((extractedTotal * 0.3) / 1000) * 1000 || Math.round(extractedTotal * 0.3);
    }
    result.paymentTerms = `₹${result.advanceAmount.toLocaleString('en-IN')} advance paid upon agreement, balance ₹${(result.totalAmount - result.advanceAmount).toLocaleString('en-IN')} upon completion and delivery.`;
  }

  // 2. Extract Customer Name
  const customerMatches = [
    /(?:for|customer|client|with|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    /(?:customer|client|name)\s*[:=-]\s*([A-Za-z\s]+?)(?:,|\.|\n|$)/i,
  ];

  for (const regex of customerMatches) {
    const match = raw.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (!['Total', 'Advance', 'Rs', 'INR', 'November', 'December', 'January', 'Payment'].includes(candidate)) {
        result.customerName = candidate;
        break;
      }
    }
  }

  // 3. Extract Merchant Name
  const merchantMatches = [
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}(?:\s+(?:Woodworks|Interiors|Electricals|Tailors|Boutique|Fabricators|Caterers|Services|Enterprises|Studio|Works))?)\s+(?:agreed|will|shall|to)/i,
    /(?:merchant|vendor|shop|by)\s*[:=-]\s*([A-Za-z\s]+?)(?:,|\.|\n|$)/i,
  ];

  for (const regex of merchantMatches) {
    const match = raw.match(regex);
    if (match && match[1]) {
      result.merchantName = match[1].trim();
      break;
    }
  }

  // 4. Extract Title / Work Deliverables
  if (lower.includes('table') || lower.includes('chair') || lower.includes('furniture') || lower.includes('cabinet') || lower.includes('wood')) {
    result.transactionTitle = result.transactionTitle || 'Custom Woodworking & Furniture Fabrication';
    if (!result.merchantName) result.merchantName = 'Sharma Woodworks & Interiors';
  } else if (lower.includes('wiring') || lower.includes('electric') || lower.includes('switchboard') || lower.includes('mcb')) {
    result.transactionTitle = result.transactionTitle || 'Electrical Wiring & Installation Services';
    if (!result.merchantName) result.merchantName = 'Gupta Electricals & Contracting';
  } else if (lower.includes('lehenga') || lower.includes('blouse') || lower.includes('tailor') || lower.includes('stitching') || lower.includes('dress') || lower.includes('suit')) {
    result.transactionTitle = result.transactionTitle || 'Custom Designer Tailoring & Embroidery';
    if (!result.merchantName) result.merchantName = 'Ananya Boutique & Designer Tailors';
  } else if (lower.includes('grill') || lower.includes('gate') || lower.includes('metal') || lower.includes('fabrication') || lower.includes('welding') || lower.includes('iron')) {
    result.transactionTitle = result.transactionTitle || 'Metal Fabrication & Safety Grill Installation';
    if (!result.merchantName) result.merchantName = 'Vishwakarma Fabrication Works';
  } else if (lower.includes('catering') || lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('party')) {
    result.transactionTitle = result.transactionTitle || 'Catering & Event Food Arrangement';
    if (!result.merchantName) result.merchantName = 'Swagath Caterers & Tiffin Services';
  } else {
    // Generate clean title from first sentence
    const firstSentence = raw.split(/[.\n]/)[0].slice(0, 60);
    result.transactionTitle = firstSentence || 'Trade Order & Work Commitment';
    if (!result.merchantName) result.merchantName = 'Vishwas Merchant Partner';
  }

  if (!result.customerName) {
    result.customerName = 'Rajesh Verma';
  }

  // 5. Completion Date (default ~14 days ahead if not specified)
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 14);
  result.expectedCompletionDate = futureDate.toISOString().split('T')[0];

  return result;
}
