import mongoose from 'mongoose';
import Agreement from '../models/Agreement.js';
import { isDBConnected } from '../config/db.js';

/**
 * Controller for Agreement endpoints
 * All methods include database connectivity checks, error handling,
 * and meaningful responses for development and production.
 */

// Helper to check DB status before operations
const checkDatabase = (res) => {
  if (!isDBConnected()) {
    res.status(503).json({
      success: false,
      message: 'Database connection is not available. Please verify MongoDB is running or check server/.env connection string.',
    });
    return false;
  }
  return true;
};

/**
 * GET /api/agreements
 * Retrieve all agreements with optional search and status filtering
 */
export const getAgreements = async (req, res) => {
  if (!checkDatabase(res)) return;

  try {
    const { status, search } = req.query;
    const filter = {};

    // Filter by status if provided (and not 'All')
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Search keyword across multiple relevant fields
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { agreementId: regex },
        { customerName: regex },
        { merchantName: regex },
        { transactionTitle: regex },
      ];
    }

    const agreements = await Agreement.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    console.error('Error in getAgreements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agreements',
      error: error.message,
    });
  }
};

/**
 * GET /api/agreements/stats/summary
 * Aggregate metrics for the merchant dashboard
 */
export const getAgreementStats = async (req, res) => {
  if (!checkDatabase(res)) return;

  try {
    const total = await Agreement.countDocuments();
    const pending = await Agreement.countDocuments({ status: 'Pending' });
    const confirmed = await Agreement.countDocuments({ status: 'Confirmed' });
    const completed = await Agreement.countDocuments({ status: 'Completed' });
    const draft = await Agreement.countDocuments({ status: 'Draft' });
    const cancelled = await Agreement.countDocuments({ status: 'Cancelled' });

    // Financial sum calculations
    const aggregates = await Agreement.aggregate([
      {
        $group: {
          _id: null,
          totalAgreedValue: { $sum: '$totalAmount' },
          totalAdvanceReceived: { $sum: '$advanceAmount' },
          totalPendingBalance: { $sum: '$remainingAmount' },
        },
      },
    ]);

    const financialMetrics = aggregates[0] || {
      totalAgreedValue: 0,
      totalAdvanceReceived: 0,
      totalPendingBalance: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        completed,
        draft,
        cancelled,
        ...financialMetrics,
      },
    });
  } catch (error) {
    console.error('Error in getAgreementStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agreement statistics',
      error: error.message,
    });
  }
};

/**
 * GET /api/agreements/:id
 * Retrieve a single agreement by MongoDB _id OR custom agreementId
 */
export const getAgreementById = async (req, res) => {
  if (!checkDatabase(res)) return;

  try {
    const { id } = req.params;

    let agreement = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      agreement = await Agreement.findById(id);
    }

    if (!agreement) {
      // Try searching by readable agreementId (e.g. AGR-20261114-1234)
      agreement = await Agreement.findOne({ agreementId: id });
    }

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: `Agreement not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    console.error('Error in getAgreementById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agreement details',
      error: error.message,
    });
  }
};

/**
 * POST /api/agreements
 * Create a new digital agreement
 */
export const createAgreement = async (req, res) => {
  if (!checkDatabase(res)) return;

  try {
    const {
      merchantName,
      merchantContact,
      customerName,
      customerContact,
      transactionTitle,
      workDescription,
      totalAmount,
      advanceAmount,
      paymentTerms,
      startDate,
      expectedCompletionDate,
      status,
    } = req.body;

    // Numerical validation
    const numTotal = Number(totalAmount);
    const numAdvance = Number(advanceAmount || 0);

    if (isNaN(numTotal) || numTotal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be a positive number',
      });
    }

    if (isNaN(numAdvance) || numAdvance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Advance amount must be a non-negative number',
      });
    }

    if (numAdvance > numTotal) {
      return res.status(400).json({
        success: false,
        message: 'Advance amount cannot exceed total agreed amount',
      });
    }

    // Date validation
    if (new Date(startDate) > new Date(expectedCompletionDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be later than expected completion date',
      });
    }

    const newAgreement = new Agreement({
      merchantName,
      merchantContact,
      customerName,
      customerContact,
      transactionTitle,
      workDescription,
      totalAmount: numTotal,
      advanceAmount: numAdvance,
      paymentTerms,
      startDate,
      expectedCompletionDate,
      status: status || 'Pending',
    });

    const savedAgreement = await newAgreement.save();

    return res.status(201).json({
      success: true,
      message: 'Agreement created successfully',
      data: savedAgreement,
    });
  } catch (error) {
    console.error('Error in createAgreement:', error);

    // Mongoose validation error formatting
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create agreement',
      error: error.message,
    });
  }
};

/**
 * PUT /api/agreements/:id
 * Update an existing agreement or update its lifecycle status
 */
export const updateAgreement = async (req, res) => {
  if (!checkDatabase(res)) return;

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent direct override of agreementId or createdAt
    delete updateData.agreementId;
    delete updateData.createdAt;

    // Recalculate remaining amount if financial figures changed
    if (updateData.totalAmount !== undefined || updateData.advanceAmount !== undefined) {
      const existing = mongoose.Types.ObjectId.isValid(id)
        ? await Agreement.findById(id)
        : await Agreement.findOne({ agreementId: id });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Agreement not found to update',
        });
      }

      const total = updateData.totalAmount !== undefined ? Number(updateData.totalAmount) : existing.totalAmount;
      const advance = updateData.advanceAmount !== undefined ? Number(updateData.advanceAmount) : existing.advanceAmount;

      if (advance > total) {
        return res.status(400).json({
          success: false,
          message: 'Advance amount cannot exceed total agreed amount',
        });
      }

      updateData.remainingAmount = Math.max(0, total - advance);
    }

    // Find and update
    let query = { agreementId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    }

    const updatedAgreement = await Agreement.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAgreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found to update',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Agreement updated successfully',
      data: updatedAgreement,
    });
  } catch (error) {
    console.error('Error in updateAgreement:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update agreement',
      error: error.message,
    });
  }
};
