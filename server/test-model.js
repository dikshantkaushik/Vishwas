import Agreement from './src/models/Agreement.js';

console.log('--- Testing Mongoose Agreement Schema & Validation Rules ---');

async function testModelValidation() {
  // Test Case 1: Valid agreement data
  const validData = {
    merchantName: 'Sharma Woodworks & Furniture',
    merchantContact: '+91 98765 43210',
    customerName: 'Rajesh Verma',
    customerContact: '+91 91234 56789',
    transactionTitle: '6-Seater Solid Sheesham Dining Table',
    workDescription: 'Fabrication and delivery of custom dining table with 6 cushioned chairs. Includes walnut finish and 1-year termite warranty.',
    totalAmount: 45000,
    advanceAmount: 15000,
    paymentTerms: '₹15,000 advance on raw material procurement, ₹30,000 upon delivery and inspection',
    startDate: new Date('2026-11-15'),
    expectedCompletionDate: new Date('2026-12-05'),
    status: 'Pending',
  };

  const agreementDoc = new Agreement(validData);
  const validationError = agreementDoc.validateSync();

  if (validationError) {
    console.error('❌ Test 1 FAILED: Valid data should not produce error:', validationError.message);
  } else {
    console.log('✅ Test 1 PASSED: Valid agreement document passed validation.');
    console.log(`   - Generated Agreement ID: ${agreementDoc.agreementId}`);
    console.log(`   - Total Amount: ₹${agreementDoc.totalAmount}`);
    console.log(`   - Advance Amount: ₹${agreementDoc.advanceAmount}`);
    console.log(`   - Auto-computed Remaining Amount: ₹${agreementDoc.remainingAmount}`);
    console.log(`   - Status: ${agreementDoc.status}`);
  }

  // Test Case 2: Validation of required fields
  const invalidDoc = new Agreement({});
  const invalidErrors = invalidDoc.validateSync();
  if (invalidErrors && invalidErrors.errors) {
    const missingKeys = Object.keys(invalidErrors.errors);
    console.log(`✅ Test 2 PASSED: Required fields caught (${missingKeys.length} fields):`, missingKeys.join(', '));
  } else {
    console.error('❌ Test 2 FAILED: Empty document should fail validation');
  }

  // Test Case 3: Invalid status enum
  const badStatusDoc = new Agreement({
    ...validData,
    status: 'NotAValidStatus',
  });
  const badStatusError = badStatusDoc.validateSync();
  if (badStatusError && badStatusError.errors.status) {
    console.log('✅ Test 3 PASSED: Invalid status enum correctly rejected.');
  } else {
    console.error('❌ Test 3 FAILED: Invalid status should be rejected');
  }

  console.log('--- All Model Tests Complete ---');
}

testModelValidation().catch(console.error);
