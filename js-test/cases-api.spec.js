const { API_KEY, PROJECT_ID, WRONG_PROJECT_ID, CASE_ID, WRONG_CASE_ID } = require('../constants');
const PublicApi = require('everyqa-api');
const { expect } = require('chai');
const { assertFalse, handleError } = require('../handlers')

const client = PublicApi.ApiClient.instance

client.authentications['Bearer'].apiKey = API_KEY;

const casesApi = new PublicApi.CasesApi();

describe('Cases Api', () => {

  describe('"getCaseList"', () => {

    it('Should return 6 cases if projectId is correct', async () => {
      const data = await casesApi.getCaseList(PROJECT_ID);
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

  })

  describe('"getCase"', () => {

    it('Should return correct case', async () => {
      const data = await casesApi.getCase(PROJECT_ID, CASE_ID);
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

  })

})
