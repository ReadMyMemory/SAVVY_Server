import { connect } from 'pm2';
import baseResponse from '../../../config/baseResponseStatus';
import { errResponse } from '../../../config/response';

export const selectPlannerListById = async (connection, user_id, type) => {
  switch (type) {
    case 0:
      const selectPlannerListAllByIdQuery = `
      (SELECT planner.id, title, planner.updated_at, nickname 
        FROM planner JOIN user ON planner.user_id = user.id
        WHERE user_id = ?)
        UNION ALL
        (SELECT planner.id, title, planner_scrap.updated_at, nickname
        FROM planner_scrap JOIN planner
        ON planner_scrap.planner_id = planner.id
        JOIN user ON planner.user_id = user.id
        WHERE planner_scrap.user_id = ?)
        ORDER BY updated_at DESC;`;
      const plannerListAllRow = await connection.query(
        selectPlannerListAllByIdQuery,
        [user_id, user_id]
      );
      return plannerListAllRow;
    case 1:
      const selectPlannerListByIdQuery = `
      SELECT id, title, DATE_FORMAT(updated_at, '%Y.%m.%d') AS 'updated_at' 
      FROM planner 
      WHERE user_id = ?
      ORDER BY planner.updated_at DESC;`;
      const plannerListRow = await connection.query(
        selectPlannerListByIdQuery,
        user_id
      );
      return plannerListRow;
    case 2:
      const selectPlannerListScrapByIdQuery = `
      SELECT planner.id, title, DATE_FORMAT(planner_scrap.updated_at, '%Y.%m.%d') AS 'updated_at', nickname
      FROM planner_scrap JOIN planner 
      ON planner_scrap.planner_id = planner.id
      JOIN user ON planner.user_id = user.id
      WHERE planner_scrap.user_id = ?
      ORDER BY planner_scrap.updated_at DESC;
      `;
      const plannerListScrapRow = await connection.query(
        selectPlannerListScrapByIdQuery,
        user_id
      );
      return plannerListScrapRow;
    default:
      return errResponse(baseResponse.DB_ERROR);
  }
};

export const selectPlannerbyId = async (connetion, planner_id) => {
  const selectPlannerbyIdQuery = `
  SELECT * FROM planner WHERE id = ?;`;

  const plannerRows = await connetion.query(selectPlannerbyIdQuery, planner_id);
  return plannerRows;
};

export const selectScrapbyId = async (connetion, params) => {
  const selectScrapbyIdQuery = `
  SELECT * FROM planner_scrap 
  WHERE user_id = ? AND planner_id = ?;`;

  const scrapRows = await connetion.query(selectScrapbyIdQuery, params);
  return scrapRows;
};

export const deletePlannerbyId = async (connection, planner_id) => {
  const deletePlannerbyIdQuery = `
  DELETE FROM planner WHERE id = ?;`;

  const deletePlannerRows = await connection.query(
    deletePlannerbyIdQuery,
    planner_id
  );
  return deletePlannerRows;
};

export const deleteScrapbyId = async (connection, params) => {
  const deleteScrapbyIdQuery = `
  DELETE FROM planner_scrap 
  WHERE user_id = ? AND planner_id = ?;`;

  const deleteScrapRows = await connection.query(deleteScrapbyIdQuery, params);
  return deleteScrapRows;
};

export const insertPlanner = async (connection, params, type) => {
  switch (type) {
    case 0:
      const insertPlannerQuery = `
      INSERT INTO planner (title, user_id, memo)
      VALUES (?, ?, ?);`;

      const insertPlannerRows = await connection.query(
        insertPlannerQuery,
        params
      );
      return insertPlannerRows;
    case 1:
      const insertPlannerUploadQuery = `
      INSERT INTO planner (title, user_id, memo, is_uploaded)
      VALUES (?, ?, ?, 1);`;

      const insertPlannerUploadRows = await connection.query(
        insertPlannerUploadQuery,
        params
      );
      return insertPlannerUploadRows;
    default:
      return errResponse(baseResponse.DB_ERROR);
  }
};

export const selectPlannerId = async (connection, user_id) => {
  const selectPlannerIdQuery = `
  SELECT id FROM planner WHERE user_id = ?
  ORDER BY updated_at DESC
  LIMIT 1;`;

  const selectPlannerIdRow = await connection.query(
    selectPlannerIdQuery,
    user_id
  );
  return selectPlannerIdRow;
};

export const selectTimetableId = async (connection, params) => {
  const selectTimetableIdQuery = `
  SELECT id FROM planner_timetable 
  WHERE planner_id = ? AND date = ? 
  AND started_at = ? AND finished_at = ?`;

  const selectTimetableIdRow = await connection.query(
    selectTimetableIdQuery,
    params
  );
  return selectTimetableIdRow;
};

export const insertTimetable = async (connection, params) => {
  const insertTimetableQuery = `
  INSERT INTO planner_timetable 
  (planner_id, place_name, date, started_at, finished_at)
  VALUES (?, ?, ?, ?, ?);`;

  const insertTimetableRows = await connection.query(
    insertTimetableQuery,
    params
  );
  return insertTimetableRows;
};

export const insertChecklist = async (connection, params) => {
  const insertChecklistQuery = `
  INSERT INTO planner_checklist 
  (timetable_id, contents, is_checked)
  VALUES (?, ?, ?);`;

  const insertChecklistRows = await connection.query(
    insertChecklistQuery,
    params
  );
  return insertChecklistRows;
};

export const selectPlannerSearch = async (connection, params) => {
  const search_word = '%' + params[1] + '%';
  const new_params = [
    params[0],
    search_word,
    params[0],
    search_word,
    search_word,
  ];
  const selectPlannerSearchQuery = `
  (SELECT planner.id, title, planner.updated_at, nickname FROM planner JOIN user ON planner.user_id = user.id
    WHERE user_id = ? AND title LIKE ?)
    UNION ALL
    (SELECT planner.id, title, planner_scrap.updated_at, nickname
    FROM planner_scrap JOIN planner
    ON planner_scrap.planner_id = planner.id
    JOIN user ON planner.user_id = user.id
    WHERE planner_scrap.user_id = ? AND (title LIKE ? OR nickname LIKE ?))
    ORDER BY updated_at DESC;`;

  const selectPlannerSearchRows = await connection.query(
    selectPlannerSearchQuery,
    new_params
  );
  return selectPlannerSearchRows;
};

export const updatePlanner = async (connection, params) => {
  const updatePlannerQuery = `
  UPDATE planner
  SET title = ?, memo = ?
  WHERE id = ?;`;

  const updatePlannerRows = await connection.query(updatePlannerQuery, params);
  return updatePlannerRows;
};

export const updateTimetable = async (connection, params) => {
  const updateTimetableQuery = `
  UPDATE planner_timetable 
  SET place_name = ?, date = ?, started_at = ?, finished_at = ?
  WHERE id = ?;`;

  const updateTimetableRows = await connection.query(
    updateTimetableQuery,
    params
  );
  return updateTimetableRows;
};

export const updateChecklist = async (connection, params) => {
  const updateChecklistQuery = `
  UPDATE planner_checklist 
  SET contents = ?, is_checked = ?
  WHERE id = ?;`;

  const updateChecklistRows = await connection.query(
    updateChecklistQuery,
    params
  );
  return updateChecklistRows;
};

export const selectPlannerDetail = async (connection, planner_id) => {
  const selectPlannerDetailQuery = `
  SELECT planner.id, title, nickname, DATE_FORMAT(planner.updated_at, '%Y.%m.%d') AS 'updated_at', memo
  FROM planner JOIN user ON planner.user_id = user.id
  WHERE planner.id = ?;`;

  const selectPlannerDetailRow = await connection.query(
    selectPlannerDetailQuery,
    planner_id
  );
  return selectPlannerDetailRow;
};

export const selectTimetableDetail = async (connection, planner_id) => {
  const selectTimetableDetailQuery = `
  SELECT id, place_name, DATE_FORMAT(started_at, '%H:%i') AS 'started_at', DATE_FORMAT(finished_at, '%H:%i') AS 'finished_at', DATE_FORMAT(planner_timetable.date, '%Y-%m-%d') AS 'date'
  FROM planner_timetable
  WHERE planner_id = ?
  ORDER BY id;`;

  const selectTimetableDetailRows = await connection.query(
    selectTimetableDetailQuery,
    planner_id
  );
  return selectTimetableDetailRows;
};

export const selectChecklistDetail = async (connection, timetable_id) => {
  const selectChecklistDetailQuery = `
  SELECT id, contents, is_checked
  FROM planner_checklist
  WHERE timetable_id = ?
  ORDER BY id;`;

  const selectChecklistDetailRows = await connection.query(
    selectChecklistDetailQuery,
    timetable_id
  );
  return selectChecklistDetailRows;
};

export const deleteTimetable = async (connection, planner_id) => {
  const deleteTimetableQuery = `
  DELETE FROM planner_timetable 
  WHERE planner_id = ?;`;

  const deleteTimetableRows = await connection.query(
    deleteTimetableQuery,
    planner_id
  );
  return deleteTimetableRows;
};

export const insertScrap = async (connection, params) => {
  const insertScrapQuery = `
  INSERT INTO planner_scrap (user_id, planner_id)
  VALUES (?, ?);`;

  const insertScrapRow = await connection.query(insertScrapQuery, params);
  return insertScrapRow;
};

export const selectPlannerReported = async (connection, params) => {
  const selectPlannerReportedQuery = `
  SELECT * FROM planner_report
  WHERE user_id = ? AND planner_id = ?;`;

  const selectPlannerReportedRow = await connection.query(
    selectPlannerReportedQuery,
    params
  );
  return selectPlannerReportedRow;
};

export const insertPlannerReport = async (connection, params) => {
  const insertPlannerReportQuery = `
  INSERT INTO planner_report 
  (planner_id, user_id, reason_1, reason_2, reason_3, reason_4, contents)
  VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const insertPlannerReportRow = await connection.query(
    insertPlannerReportQuery,
    params
  );
  return insertPlannerReportRow;
};

export const insertUserBlock = async (connection, params) => {
  const insertUserBlockQuery = `
  INSERT INTO user_blocked (blocked_user, user_id)
  VALUES (?, ?);`;

  const insertUserBlockRow = await connection.query(
    insertUserBlockQuery,
    params
  );
  return insertUserBlockRow;
};
