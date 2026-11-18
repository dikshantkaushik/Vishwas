import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Agreement from './src/models/Agreement.js';
import { connectDB } from './src/config/db.js';

dotenv.config();

const sampleAgreements = [
  {
    agreementId: 'AGR-20261110-1011',
    merchantName: 'Sharma Woodworks & Interiors',
    merchantContact: '+91 98231 44550',
    customerName: 'Rajesh Verma',
    customerContact: '+91 94120 78219',
    transactionTitle: 'Custom Teakwood 6-Seater Dining Table & Chairs',
    workDescription: 'Fabrication of 6ft x 3.5ft solid teak dining table with natural walnut melamine finish and 6 matching high-back cushioned chairs. Includes 1-year termite warranty and free doorstep installation in Sector 14.',
    totalAmount: 48000,
    advanceAmount: 20000,
    remainingAmount: 28000,
    paymentTerms: '₹20,000 advance with raw wood purchase, ₹28,000 balance upon delivery and customer inspection.',
    startDate: new Date('2026-11-01'),
    expectedCompletionDate: new Date('2026-11-20'),
    status: 'Confirmed',
  },
  {
    agreementId: 'AGR-20261112-2042',
    merchantName: 'Gupta Electricals & Contracting',
    merchantContact: '+91 98110 33211',
    customerName: 'Priya Sundaram',
    customerContact: '+91 98450 67123',
    transactionTitle: '3BHK Complete Concealed Electrical Wiring & Switchboards',
    workDescription: 'Complete rewiring of 3BHK flat using Havells fire-resistant copper wire, installation of 42 modular switch plates (Legrand), and MCB distribution board setup.',
    totalAmount: 35000,
    advanceAmount: 10000,
    remainingAmount: 25000,
    paymentTerms: '₹10,000 advance, ₹15,000 upon casing completion, ₹10,000 balance after testing and handover.',
    startDate: new Date('2026-11-05'),
    expectedCompletionDate: new Date('2026-11-25'),
    status: 'Pending',
  },
  {
    agreementId: 'AGR-20261113-3391',
    merchantName: 'Ananya Boutique & Designer Tailors',
    merchantContact: '+91 97188 22345',
    customerName: 'Sunita Mehra',
    customerContact: '+91 99991 12345',
    transactionTitle: 'Hand-Embroidered Bridal Lehenga & 2 Blouses',
    workDescription: 'Raw silk bridal lehenga with intricate zardozi hand embroidery, custom neckline blouses with latkan tassels, and double net dupatta finishing with zari border.',
    totalAmount: 62000,
    advanceAmount: 30000,
    remainingAmount: 32000,
    paymentTerms: '50% advance for fabric & embroidery artisans, remaining 50% on first fitting trial.',
    startDate: new Date('2026-11-08'),
    expectedCompletionDate: new Date('2026-12-10'),
    status: 'Confirmed',
  },
  {
    agreementId: 'AGR-20261114-4118',
    merchantName: 'Swagath Catering Services',
    merchantContact: '+91 93421 99882',
    customerName: 'Vikram Patel',
    customerContact: '+91 97234 55667',
    transactionTitle: 'Silver Jubilee Anniversary Dinner Catering (120 Guests)',
    workDescription: 'Full live buffet arrangement for 120 pax: 2 welcome mocktails, 4 starters, North & South Indian main course, live chaat counter, and 3 dessert items with 8 uniformed service staff.',
    totalAmount: 75000,
    advanceAmount: 25000,
    remainingAmount: 50000,
    paymentTerms: '₹25,000 advance on date booking, ₹50,000 balance payable at venue closing.',
    startDate: new Date('2026-11-14'),
    expectedCompletionDate: new Date('2026-11-28'),
    status: 'Pending',
  },
  {
    agreementId: 'AGR-20261028-5901',
    merchantName: 'Balaji Offset & Digital Printers',
    merchantContact: '+91 98400 11223',
    customerName: 'Amit Saxena',
    customerContact: '+91 98199 44332',
    transactionTitle: '500 Customized Corrugated Packaging Boxes with 2-Color Print',
    workDescription: '3-ply E-flute corrugated delivery boxes (dimensions 12x8x4 inch) with customized logo printing and UV varnish coating.',
    totalAmount: 18500,
    advanceAmount: 18500,
    remainingAmount: 0,
    paymentTerms: '100% advance payment for custom die cut mold and paper stock.',
    startDate: new Date('2026-10-28'),
    expectedCompletionDate: new Date('2026-11-05'),
    status: 'Completed',
  },
];

async function seed() {
  const connected = await connectDB();
  if (!connected) {
    console.error('Cannot seed: Database not connected.');
    process.exit(1);
  }

  try {
    const existingCount = await Agreement.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing agreement(s). Skipping sample seed to avoid overwriting.`);
      console.log('To force re-seed, clear collection or delete existing records first.');
    } else {
      await Agreement.insertMany(sampleAgreements);
      console.log(`✅ Successfully seeded ${sampleAgreements.length} realistic Indian MSME agreements into MongoDB!`);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
