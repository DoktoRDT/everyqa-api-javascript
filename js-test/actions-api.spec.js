const { API_KEY, PROJECT_ID, WRONG_PROJECT_ID, CASE_ID, RUN_ID, TEST_ID, WRONG_RUN_ID, WRONG_TEST_ID } = require('../constants');
const PublicApi = require('everyqa-api');
const { expect } = require('chai');
const { assertFalse, handleError } = require('../handlers')

const client = PublicApi.ApiClient.instance

client.authentications['Bearer'].apiKey = API_KEY;
const actionApi = new PublicApi.ResultsApi();


describe('Action Api', () => {

  describe('"addResultToTest"', () => {

    it('Should return correct action if test id is correct', async () => {
      const data = await actionApi.addResultToTest(PROJECT_ID, RUN_ID, TEST_ID, {
        notes: 'notes',
        status_id: 3,
      });
      expect(data.status_id).eq(3);
      expect(data.notes).eq('notes');
      expect(data.test_id).eq(TEST_ID);
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await actionApi.addResultToTest('PROJECT_ID', RUN_ID, CASE_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 404 if runId is incorrect', async () => {
      await actionApi.addResultToTest(PROJECT_ID, -1, CASE_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 404 if testId is incorrect', async () => {
      await actionApi.addResultToTest(PROJECT_ID, RUN_ID, -1, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 400 if statusId is incorrect', async () => {
      await actionApi.addResultToTest(PROJECT_ID, RUN_ID, TEST_ID, {
        notes: 'notes',
        status_id: -1,
      })
        .then(assertFalse)
        .catch(handleError(400))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await actionApi.addResultToTest(PROJECT_ID, RUN_ID, TEST_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await actionApi.addResultToTest(WRONG_PROJECT_ID, RUN_ID, TEST_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to run', async () => {
      await actionApi.addResultToTest(PROJECT_ID, WRONG_RUN_ID, TEST_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })

    it('Should throw 401 if user has no access to test', async () => {
      await actionApi.addResultToTest(PROJECT_ID, RUN_ID, WRONG_TEST_ID, {
        notes: 'notes',
        status_id: 3,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })


  })

})
