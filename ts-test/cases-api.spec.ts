import { CasesApi } from 'everyqa-client';
import { expect } from 'chai';
import { CASE_ID, defaultConfig, PROJECT_ID, WRONG_API_KEY, WRONG_CASE_ID, WRONG_PROJECT_ID } from '../constants';
import { assertFalse, handleError } from '../handlers';

const casesApi = new CasesApi(defaultConfig);

describe('Cases Api', () => {

  describe('"getCaseList"', () => {

    it('Should return 6 cases if projectId is correct', async () => {
      const { data, status } = await casesApi.getCaseList(PROJECT_ID);
      expect(status).eq(200);
      expect(data.length).eq(6);
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await casesApi.getCaseList('PROJECT_ID')
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await casesApi.getCaseList(WRONG_PROJECT_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if api key is incorrect', async () => {
      await new CasesApi({
        apiKey: WRONG_API_KEY,
      }).getCaseList(PROJECT_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if api key does not exist', async () => {
      await new CasesApi().getCaseList(PROJECT_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

  describe('"getCase"', () => {

    it('Should return correct case', async () => {
      const { data, status } = await casesApi.getCase(PROJECT_ID, CASE_ID);
      expect(status).eq(200);
      expect(data.id).eq(CASE_ID);
      expect(data.project_id).eq(PROJECT_ID);
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await casesApi.getCase('PROJECT_ID', CASE_ID)
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 400 if caseId is incorrect', async () => {
      await casesApi.getCase(PROJECT_ID, -1)
        .then(assertFalse)
        .catch(handleError(400))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await casesApi.getCase(WRONG_PROJECT_ID, CASE_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to case', async () => {
      await casesApi.getCase(PROJECT_ID, WRONG_CASE_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if api key is incorrect', async () => {
      await new CasesApi({
        apiKey: WRONG_API_KEY,
      }).getCase(PROJECT_ID, CASE_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if api key does not exist', async () => {
      await new CasesApi().getCase(PROJECT_ID, CASE_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

})
