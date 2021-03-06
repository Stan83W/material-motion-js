/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import {
  after,
  before,
} from 'mocha-sugar-free';

import {
  SinonStub,
  stub,
} from 'sinon';

import * as createMockRAF from 'mock-raf';

export interface MockRAF {
  now(): number,
  raf: typeof requestAnimationFrame,
  cancel: typeof cancelAnimationFrame,
  step(options?: { time?: number, count?: number, }): void,
}

export type MockedRAFClosure = (mockRAF: MockRAF) => void;

/**
 * Replaces window.requestAnimationFrame with a mock for the duration of a mocha
 * testing suite.
 */
export default function useMockedRAF(closure: MockedRAFClosure) {
  return () => {
    const mockRAF = createMockRAF();

    before(
      () => {
        stub(window, 'requestAnimationFrame').callsFake(mockRAF.raf);
        stub(window, 'cancelAnimationFrame').callsFake(mockRAF.cancel);
      }
    );

    after(
      () => {
        (window.requestAnimationFrame as SinonStub).restore(); // tslint:disable-line: no-unbound-method
        (window.cancelAnimationFrame as SinonStub).restore(); // tslint:disable-line: no-unbound-method
      }
    );

    return closure(mockRAF);
  };
};
