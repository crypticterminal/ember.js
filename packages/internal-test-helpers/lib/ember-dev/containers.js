import { Container } from 'container';

function ContainersAssert(env) {
  this.env = env;
}

const { _leakTracking: containerLeakTracking } = Container;

ContainersAssert.prototype = {
  reset: function() {},
  inject: function() {},
  assert: function() {
    if (containerLeakTracking === undefined) return;
    let { config } = QUnit;
    let { testName, testId, module: { name: moduleName }, finish: originalFinish } = config.current;
    config.current.finish = function() {
      originalFinish.call(this);
      originalFinish = undefined;
      if (containerLeakTracking.hasContainers()) {
        containerLeakTracking.reset();
        QUnit.test(
          'Leaked Container',
          Object.assign(
            assert => {
              assert.ok(false, `${moduleName}: ${testName} testId=${testId}`);
            },
            { validTest: true }
          )
        );
      }
    };
  },
  restore: function() {},
};

export default ContainersAssert;
