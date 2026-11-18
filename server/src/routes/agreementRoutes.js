import express from 'express';
import {
  getAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  getAgreementStats,
} from '../controllers/agreementController.js';

const router = express.Router();

// Dashboard summary metrics route (placed before /:id to prevent route shadowing)
router.get('/stats/summary', getAgreementStats);

// Standard CRUD endpoints
router.get('/', getAgreements);
router.post('/', createAgreement);
router.get('/:id', getAgreementById);
router.put('/:id', updateAgreement);

export default router;
