import * as service from "../service/session.report.service.js";
import {
  DailyReportRequestDTO,
  WeeklyReportRequestDTO,
} from "../dto/session.request.dto.js";
import {
  DailyReportResponseDTO,
  WeeklyReportResponseDTO,
  TodayRecommendationResponseDTO,
} from "../dto/session.response.dto.js";

export const getDailyReport = async (req, res) => {
  const dto = new DailyReportRequestDTO(req.query);
  const data = await service.getDailyReport(req.user.id, dto);
  return res.json({ ok: true, report: new DailyReportResponseDTO(data) });
};

export const getWeeklyReport = async (req, res) => {
  const dto = new WeeklyReportRequestDTO(req.query);
  const data = await service.getWeeklyReport(req.user.id, dto);
  return res.json({ ok: true, report: new WeeklyReportResponseDTO(data) });
};

export const getTodayRecommendation = async (req, res) => {
  const data = await service.getTodayRecommendation(req.user.id);
  return res.json({
    ok: true,
    recommendation: new TodayRecommendationResponseDTO(data),
  });
};
