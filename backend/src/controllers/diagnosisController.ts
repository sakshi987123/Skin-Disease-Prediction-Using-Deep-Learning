import { Request, Response, NextFunction } from 'express';
import Diagnosis from '../models/Diagnosis';
import { User } from '../models/User';
import { IApiResponse, IAuthRequest } from '../types';
import { emailService } from '../utils/email';

/**
 * Patient: Create a diagnosis request (upload image & symptoms)
 */
export const createDiagnosisRequest = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageUrl, symptoms, description } = req.body;

    const diagnosis = await Diagnosis.create({
      user: req.user?._id,
      imageUrl,
      symptoms,
      description,
      status: 'pending',
      isVisibleToPatient: false,
    });

    // Notify all doctors via email (fire-and-forget)
    try {
      const patient = await User.findById(req.user?._id).select('firstName lastName');
      const doctors = await User.find({ role: { $in: ['manager', 'doctor'] }, isActive: true }).select('email firstName lastName');
      const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'A patient';
      for (const doc of doctors) {
        emailService.sendNewConsultationAlert(doc.email, doc.firstName, patientName).catch(() => {});
      }
    } catch (_) {}

    return res.status(201).json({
      success: true,
      message: 'Consultation request sent to doctor successfully',
      data: diagnosis,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor: Get all pending diagnosis requests
 */
export const getPendingRequests = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const diagnoses = await Diagnosis.find({ status: 'pending' })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: diagnoses,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor: Review and finalize a diagnosis (add AI prediction + notes)
 */
export const finalizeDiagnosis = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { prediction, recommendations, doctorNotes, status, isVisibleToPatient, isUrgent } = req.body;

    const diagnosis = await Diagnosis.findByIdAndUpdate(
      id,
      {
        prediction,
        recommendations,
        doctorNotes,
        status: status || 'finalized',
        isVisibleToPatient: isVisibleToPatient !== undefined ? isVisibleToPatient : true,
        isUrgent: isUrgent || false,
        doctor: req.user?._id,
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis request not found',
      });
    }

    // Email the patient when report is visible (fire-and-forget)
    if (diagnosis && diagnosis.isVisibleToPatient && prediction?.disease) {
      try {
        const patientUser = await User.findById((diagnosis.user as any)._id || diagnosis.user).select('email firstName lastName');
        const doctorUser = await User.findById(req.user?._id).select('firstName lastName');
        if (patientUser && doctorUser) {
          const doctorName = `${doctorUser.firstName} ${doctorUser.lastName}`;
          emailService.sendReportReadyAlert(patientUser.email, patientUser.firstName, doctorName, prediction.disease).catch(() => {});
        }
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      message: 'Diagnosis finalized successfully',
      data: diagnosis,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Patient: Get all their own diagnosis requests (all statuses)
 */
export const getMyDiagnoses = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const diagnoses = await Diagnosis.find({ user: req.user?._id })
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: diagnoses,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor: Get all finalized/reviewed cases (their history)
 */
export const getCompletedCases = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const diagnoses = await Diagnosis.find({
      status: { $in: ['finalized', 'reviewed'] },
    })
      .populate('user', 'firstName lastName email')
      .populate('doctor', 'firstName lastName')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: diagnoses,
    });
  } catch (error) {
    return next(error);
  }
};

/** Doctor: get real analytics from DB */
export const getAnalytics = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalCases, pendingCases, completedCases, diseaseDistribution, modelPerformance, weeklyRaw, uniquePatients] = await Promise.all([
      Diagnosis.countDocuments(),
      Diagnosis.countDocuments({ status: 'pending' }),
      Diagnosis.countDocuments({ status: { $in: ['finalized', 'reviewed'] } }),

      Diagnosis.aggregate([
        { $match: { status: 'finalized', 'prediction.disease': { $exists: true, $ne: null } } },
        { $group: { _id: '$prediction.disease', count: { $sum: 1 }, avgConfidence: { $avg: '$prediction.confidence' } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      Diagnosis.aggregate([
        { $match: { status: 'finalized', 'prediction.modelUsed': { $exists: true, $ne: null } } },
        { $group: { _id: '$prediction.modelUsed', avgConfidence: { $avg: '$prediction.confidence' }, count: { $sum: 1 } } },
        { $sort: { avgConfidence: -1 } },
      ]),

      Diagnosis.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Diagnosis.distinct('user'),
    ]);

    // Fill missing days in weekly volume
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyVolume = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const found = weeklyRaw.find((r: any) => r._id === key);
      return { day: days[d.getDay()], date: key, count: found ? found.count : 0 };
    });

    const avgConfidence = completedCases > 0
      ? await Diagnosis.aggregate([
          { $match: { status: 'finalized', 'prediction.confidence': { $exists: true } } },
          { $group: { _id: null, avg: { $avg: '$prediction.confidence' } } },
        ]).then((r: any[]) => Math.round((r[0]?.avg || 0) * 10) / 10)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalCases,
        pendingCases,
        completedCases,
        uniquePatients: uniquePatients.length,
        avgConfidence,
        diseaseDistribution: diseaseDistribution.map((d: any) => ({
          disease: d._id,
          count: d.count,
          avgConfidence: Math.round(d.avgConfidence * 10) / 10,
          percentage: Math.round((d.count / (completedCases || 1)) * 100),
        })),
        modelPerformance: modelPerformance.map((m: any) => ({
          model: m._id,
          avgConfidence: Math.round(m.avgConfidence * 10) / 10,
          count: m.count,
        })),
        weeklyVolume,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getDiagnosisById = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('doctor', 'firstName lastName');

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found',
      });
    }

    // Check permissions: either the owner (if visible) or a doctor
    const isPatient = req.user?.role === 'user' || req.user?.role === 'patient';
    if (isPatient && (diagnosis.user.toString() !== req.user?._id?.toString() || !diagnosis.isVisibleToPatient)) {
       return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(200).json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    return next(error);
  }
};
