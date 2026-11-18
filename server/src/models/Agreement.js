import mongoose from 'mongoose';


const generateAgreementId = () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AGR-${dateStr}-${randomSuffix}`;
};


const agreementSchema = new mongoose.Schema(
  {
    agreementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      default: generateAgreementId,
    },

    merchantName: {
      type: String,
      required: [true, 'Merchant business or personal name is required'],
      trim: true,
      minlength: [2, 'Merchant name must be at least 2 characters'],
    },
    merchantContact: {
      type: String,
      required: [true, 'Merchant contact number or email is required'],
      trim: true,
    },


    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
    },
    customerContact: {
      type: String,
      required: [true, 'Customer contact number or email is required'],
      trim: true,
    },


    transactionTitle: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      maxlength: [120, 'Transaction title cannot exceed 120 characters'],
    },
    workDescription: {
      type: String,
      required: [true, 'Detailed work or service description is required'],
      trim: true,
    },


    totalAmount: {
      type: Number,
      required: [true, 'Total agreed amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    advanceAmount: {
      type: Number,
      default: 0,
      min: [0, 'Advance amount cannot be negative'],
    },
    remainingAmount: {
      type: Number,
      default: function () {
        const total = typeof this.totalAmount === 'number' ? this.totalAmount : 0;
        const advance = typeof this.advanceAmount === 'number' ? this.advanceAmount : 0;
        return Math.max(0, total - advance);
      },
      min: [0, 'Remaining amount cannot be negative'],
    },
    paymentTerms: {
      type: String,
      required: [true, 'Payment terms and schedule description are required'],
      trim: true,
    },

    // Timeline
    startDate: {
      type: Date,
      required: [true, 'Agreement start date is required'],
    },
    expectedCompletionDate: {
      type: Date,
      required: [true, 'Expected completion date is required'],
    },

    // Status of the Agreement Lifecycle
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Pending', 'Confirmed', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid agreement status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

/**
 * Pre-save hook:
 * Ensures remainingAmount is always kept synchronized with totalAmount and advanceAmount
 */
agreementSchema.pre('save', function (next) {
  if (typeof this.totalAmount === 'number') {
    const advance = this.advanceAmount || 0;
    this.remainingAmount = Math.max(0, this.totalAmount - advance);
  }
  next();
});

const Agreement = mongoose.model('Agreement', agreementSchema);

export default Agreement;
