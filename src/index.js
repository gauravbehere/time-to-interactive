/**
 * Time to interactive
 * Utility to report time to interactive for Real User Monitoring (RUM)
 * 
 * Usage: 
 * window.getPageTTI.then(data => //data is the TTI value for the page)
 * window.getReferentialTTI().then(data => //data is the TTI value for a section/component)
 * 
 * Referential TTI can be fired from the click event, route navigations when you render a component or an event 
 * after which you want to check how much is the time to interactive for that action
 * 
 * Basic idea is to make use of LongTask API to see if CPU was busy & report time to interactive based on 
 * the number of CPU cycles for which CPU was busy.
 * 
 * Algorithm:
 * 1. First attempt is to see if PerformanceLongTaskTiming is available in window.
 * 2. If it is available we report TTI as max of time to load & TTI reported by tti-polyfill.
 * 3. There are instances where TTI reported by tti-polyfill is less than time for loadEventEnd, thus we return a max of the two.
 * 4. If PerformanceLongTaskTiming is not available we fall back to manual polling to check if CPU is busy.
 * 5. As we get a window of 500ms for which CPU was idle, 
 *    we report TTI based on the number of cycles we had to wait to see a idle 500ms window.
 * 6. We look for the idle window after loadEventEnd has happened so that we are also waiting network idle state.
 */

import Promise from 'promise-polyfill';
const ttiPolyfill = require('tti-polyfill/tti-polyfill');

(function () {

  // Time threshold, if met we declare that we are not able to report TTI
  const TTI_THRESHOLD_TIME = 60000;

  /**
   * https://w3c.github.io/longtasks/#report-long-tasks
   */
  const CPU_BUSY_POLLING_INTERVAL = 50;

  const CPU_BUSY_ALLOWED_DEVIATION = 5;

  /**
   * https://developer.akamai.com/tools/boomerang/docs/BOOMR.plugins.Continuity.html#toc10__anchor
   */
  const CPU_IDLE_TTI_WINDOW = 500;

  const MIN_CPU_IDLE_INTERVALS = CPU_IDLE_TTI_WINDOW / CPU_BUSY_POLLING_INTERVAL;
  const timing = performance.timing;

  const getLoadTime = function () {
    //If load has not happened, the returned value will be negative
    return parseFloat(timing.loadEventEnd - timing.navigationStart).toFixed(0);
  }

  const getCPUBusyInterval = () => {
    let previousHit = null;
    let noOfCyclesCPUWasBusy = 0;
    let longTaskPollInterval = null;
    let successIntervals = 0;
    let tti = null;
    return new Promise((resolve, reject) => {
      const checkIfCPUIsBusy = () => {
        noOfCyclesCPUWasBusy++;
        let timeDiff = performance.now() - previousHit;
        if (timeDiff > (CPU_BUSY_POLLING_INTERVAL + CPU_BUSY_ALLOWED_DEVIATION)) {
          successIntervals = 0;
        }
        else {
          //If load has not happened, getLoadTime() will be negative, we need to continue polling 
          if (parseInt(getLoadTime()) > 0) {
            successIntervals++;
            if (successIntervals === MIN_CPU_IDLE_INTERVALS) {
              // For Last MIN_CPU_IDLE_INTERVALS, CPU was idle & we need to subtract that interval 
              noOfCyclesCPUWasBusy = noOfCyclesCPUWasBusy - MIN_CPU_IDLE_INTERVALS;
              clearInterval(longTaskPollInterval);
              tti = parseInt(noOfCyclesCPUWasBusy * CPU_BUSY_POLLING_INTERVAL);
              resolve(tti);
            }
          }
        }
        previousHit = performance.now();
      }
      previousHit = performance.now();
      longTaskPollInterval = setInterval(checkIfCPUIsBusy, CPU_BUSY_POLLING_INTERVAL);

      setTimeout(() => {
        if (!tti) reject();
      }, TTI_THRESHOLD_TIME);
    });
  }

  window.getReferentialTTI = () => {
    return new Promise((resolve, reject) => {
      getCPUBusyInterval().then((tti) => {
        resolve(tti);
      }).catch(() => {
        reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
      });
    })
  };

  window.getPageTTI = (() => {
    /*
    * Using LongTask API if supported
    */
    return new Promise((resolve, reject) => {
      if ('PerformanceLongTaskTiming' in window) {
        !function () {
          let g = window.__tti = { e: [] };
          g.o = new PerformanceObserver(function (l) { g.e = g.e.concat(l.getEntries()) });
          g.o.observe({ entryTypes: ['longtask'] })
        }();
        ttiPolyfill.getFirstConsistentlyInteractive()
          .then((data) => {
            resolve(Math.max(data, getLoadTime()));
          }).catch(() => {
            reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
          });;
      }
      else {
        /**
         * Falling back to manually polling for long tasks.
         */
        getCPUBusyInterval().then((tti) => {
          // This calculation makes sure that TTI can't be lesser than time for load(loadEventEnd)
          resolve(parseInt(getLoadTime()) + parseInt(tti));
        }).catch(() => {
          reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
        });
      }
    });
  }
  )();
})();
