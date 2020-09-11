import { assert, AssertionError, expect } from 'chai';


export function assertFalse(res) {
  assert(false, 'Response has status: ' + res.status);
}

export function handleError(code) {
  return (e) => {
    if (e.constructor !== AssertionError) {
      expect(e.response.status).eq(code, 'Response has status: ' + e.response.status);
      return;
    }
    throw e;
  }
}
