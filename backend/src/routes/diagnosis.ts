import express from 'express';
import {
  createDiagnosisRequest,
  getMyDiagnoses,
  getDiagnosisById,
  getPendingRequests,
  finalizeDiagnosis,
  getCompletedCases,
  getAnalytics,
} from '../controllers/diagnosisController';
import { authenticate, managerOnly } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Patient routes
router.post('/request', createDiagnosisRequest);
router.get('/my', getMyDiagnoses);

// Doctor routes
router.get('/pending', managerOnly, getPendingRequests);
router.get('/completed', managerOnly, getCompletedCases);
router.get('/analytics', managerOnly, getAnalytics);
router.patch('/:id/finalize', managerOnly, finalizeDiagnosis);

// Shared
router.get('/:id', getDiagnosisById);

export default router;
