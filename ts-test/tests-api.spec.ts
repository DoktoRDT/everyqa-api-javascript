import { RunsApi, TestsApi } from 'everyqa-client';
import {
  CASE_ID,
  CASE_ID_2,
  CASE_ID_3,
  CASE_ID_4,
  CASE_ID_5,
  CLOSED_RUN_ID,
  defaultConfig,
  PROJECT_ID,
  SPRINT_ID,
  WRONG_CASE_ID,
  WRONG_PROJECT_ID,
  WRONG_RUN_ID,
} from '../constants';
import { expect } from 'chai';
import { assertFalse, handleError } from '../handlers';


const testsApi = new TestsApi(defaultConfig);


describe('Tests Api', () => {

  describe('"addTests"', () => {

    let runId: number;

    before(async () => {
      const { data: { id } } = await new RunsApi(defaultConfig).createRun(PROJECT_ID, {
        name: 'test run',
        sprint_id: SPRINT_ID,
      });
      runId = id;
    })

    it('Should return correct test if case id is correct', async () => {
      const { data: [ test ] } = await testsApi.addTests(PROJECT_ID, runId, { case_ids: [ CASE_ID ] });
      expect(test.case_id).eq(CASE_ID);
      expect(test.project_id).eq(PROJECT_ID);
      expect(test.run_id).eq(runId);
      expect(test.priority).eq('MEDIUM');
      expect(test.estimate).eq(0);
      expect(test.preconditions).eq('мы проверим новый механизировано бла-бла \nhttps://yandex.ru');
      expect(test.steps.length).eq(2);
    })

    it('Should throw 400 if test run is closed', async () => {
      await testsApi.addTests(PROJECT_ID, CLOSED_RUN_ID, { case_ids: [ CASE_ID_2 ] })
        .then(assertFalse)
        .catch(handleError(400))
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await testsApi.addTests('PROJECT_ID', runId, { case_ids: [ CASE_ID_2 ] })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 404 if runId is incorrect', async () => {
      await testsApi.addTests(PROJECT_ID, -1, { case_ids: [ CASE_ID_3 ] })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 404 if caseId is incorrect', async () => {
      await testsApi.addTests(PROJECT_ID, runId, { case_ids: [ -1 ] })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await testsApi.addTests(WRONG_PROJECT_ID, runId, { case_ids: [ CASE_ID_4 ] })
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to run', async () => {
      await testsApi.addTests(PROJECT_ID, WRONG_RUN_ID, { case_ids: [ CASE_ID_5 ] })
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to case', async () => {
      await testsApi.addTests(PROJECT_ID, runId, { case_ids: [ WRONG_CASE_ID ] })
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

})
