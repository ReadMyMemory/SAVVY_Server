import baseResponse from '../../../config/baseResponseStatus';
import { errResponse } from '../../../config/response';

export const selectPlannerListById = async (connection, user_id, type) => {
  switch (type) {
    case 1:
      const selectPlannerListByIdQuery = `
      SELECT id, title, updated_at FROM planner 
      WHERE user_id = ?
      ORDER BY updated_at DESC;`;
      const plannerListRow = await connection.query(
        selectPlannerListByIdQuery,
        user_id
      );
      return plannerListRow;
    case 2:
      const selectPlannerListScrapByIdQuery = `
      SELECT planner.id, title, scrapped_at, nickname
      FROM planner_scrap JOIN planner 
      ON planner_scrap.planner_id = planner.id
      JOIN user ON planner.user_id = user.id
      WHERE planner_scrap.user_id = ?
      ORDER BY scrapped_at DESC;
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

export const insertPlanner = async (connection, params) => {
  const insertPlannerQuery = `
  INSERT INTO planner (title, user_id, memo)
  VALUES (?, ?, ?);`;

  const insertPlannerRows = await connection.query(insertPlannerQuery, params);
  console.log(result.insertID);
  return insertPlannerRows;
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
