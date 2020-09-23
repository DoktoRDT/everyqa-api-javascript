import { RunsApi, UpdateRunDtoStatusEnum } from 'everyqa-client';
import { expect } from 'chai';
import {
  ANOTHER_ASSIGNEE,
  ASSIGNEE,
  defaultConfig,
  PROJECT_ID,
  RUN_ID,
  SPRINT_ID,
  WRONG_PROJECT_ID,
} from '../constants';
import { assertFalse, handleError } from '../handlers';

const testRunName = 'test run';

async function restoreTestRun() {
  await runsApi.updateRun(PROJECT_ID, RUN_ID, {
    name: testRunName,
    assign_to: ASSIGNEE,
    sprint_id: SPRINT_ID,
    status: UpdateRunDtoStatusEnum.OPEN,
  });
}

const runsApi = new RunsApi(defaultConfig);

describe('Runs Api', () => {

  describe('"createRun"', () => {

    it('Should return correct run if body is correct', async () => {
      const name = testRunName;
      const assign_to = ASSIGNEE;
      const { data, status } = await runsApi.createRun(PROJECT_ID, {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
      });
      expect(status).eq(201);
      expect(data.project_id).eq(PROJECT_ID);
      expect(data.name).eq(name);
      expect(data.assigned_to).eq(assign_to);
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      const name = testRunName;
      const assign_to = ASSIGNEE;
      await runsApi.createRun('PROJECT_ID', {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
      })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      const name = testRunName;
      const assign_to = ASSIGNEE;
      await runsApi.createRun(WRONG_PROJECT_ID, {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

  describe('"updateRun"', () => {

    afterEach(restoreTestRun);

    it('Should return correct run if body is correct', async () => {
      const name = 'updated test run';
      const assign_to = ANOTHER_ASSIGNEE;
      const { data, status } = await runsApi.updateRun(PROJECT_ID, RUN_ID, {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
        status: UpdateRunDtoStatusEnum.OPEN,
      });
      expect(status).eq(200);
      expect(data.name).eq(name, 'Wrong assignee');
      expect(data.assigned_to).eq(assign_to, 'Wrong assignee');
      expect(data.project_id).eq(PROJECT_ID, 'Wrong project id');
      expect(data.sprint_id).eq(SPRINT_ID, 'Wrong sprint id');
      expect(data.status).eq(UpdateRunDtoStatusEnum.OPEN, 'Wrong status');
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      const name = 'updated test run';
      const assign_to = ANOTHER_ASSIGNEE;
      await runsApi.updateRun('PROJECT_ID', RUN_ID, {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
        status: UpdateRunDtoStatusEnum.CLOSED,
      })
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      const name = 'updated test run';
      const assign_to = ANOTHER_ASSIGNEE;
      await runsApi.updateRun(WRONG_PROJECT_ID, RUN_ID, {
        name,
        assign_to,
        sprint_id: SPRINT_ID,
        status: UpdateRunDtoStatusEnum.CLOSED,
      })
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

  describe('"getRunList"', () => {

    it(`Should return array contains run with id = ${RUN_ID}`, async () => {
      const { data, status } = await runsApi.getRunList(PROJECT_ID);
      const run = data.find(r => r.id === RUN_ID);
      expect(status).eq(200);
      expect(run).not.undefined;
      expect(run.name).eq(testRunName, 'Wrong name');
      expect(run.assigned_to).eq(ASSIGNEE, 'Wrong assignee');
      expect(run.project_id).eq(PROJECT_ID, 'Wrong project id');
      expect(run.sprint_id).eq(SPRINT_ID, 'Wrong sprint id');
      expect(run.status).eq(UpdateRunDtoStatusEnum.OPEN, 'Wrong status');
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await runsApi.getRunList('PROJECT_ID')
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await runsApi.getRunList(WRONG_PROJECT_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

  describe('"getRun"', () => {

    it(`Should return run with id = ${RUN_ID}`, async () => {
      const { data, status } = await runsApi.getRun(PROJECT_ID, RUN_ID);
      expect(status).eq(200);
      expect(data.id).eq(RUN_ID);
      expect(data.name).eq(testRunName, 'Wrong name');
      expect(data.assigned_to).eq(ASSIGNEE, 'Wrong assignee');
      expect(data.project_id).eq(PROJECT_ID, 'Wrong project id');
      expect(data.sprint_id).eq(SPRINT_ID, 'Wrong sprint id');
      expect(data.status).eq(UpdateRunDtoStatusEnum.OPEN, 'Wrong status');
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await runsApi.getRun('PROJECT_ID', RUN_ID)
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await runsApi.getRun(WRONG_PROJECT_ID, RUN_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

  describe('"closeRun"', () => {

    afterEach(restoreTestRun);

    it('Should change run status to "CLOSED"', async () => {
      const { status } = await runsApi.closeRun(PROJECT_ID, RUN_ID);
      expect(status).eq(200);
      const { data } = await runsApi.getRun(PROJECT_ID, RUN_ID);
      expect(data.status).eq(UpdateRunDtoStatusEnum.CLOSED);
    })

    it('Should throw 404 if projectId is incorrect', async () => {
      await runsApi.closeRun('PROJECT_ID', RUN_ID)
        .then(assertFalse)
        .catch(handleError(404))
    })

    it('Should throw 401 if user has no access to project', async () => {
      await runsApi.closeRun(WRONG_PROJECT_ID, RUN_ID)
        .then(assertFalse)
        .catch(handleError(401))
    })

  })

})
