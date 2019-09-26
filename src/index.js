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

  // Adding a margin to allow IE/EDGE to clamp polling
  const CPU_BUSY_ALLOWED_DEVIATION = 5;

  /**
   * https://developer.akamai.com/tools/boomerang/docs/BOOMR.plugins.Continuity.html#toc10__anchor
   */
  const CPU_IDLE_TTI_WINDOW = 500;

  const MIN_CPU_IDLE_INTERVALS = parseInt(CPU_IDLE_TTI_WINDOW / CPU_BUSY_POLLING_INTERVAL);

  const timing = window.performance.timing;

  const getLoadTime = function () {
    //If load has not happened, the returned value will be negative
    return parseFloat(timing.loadEventEnd - timing.navigationStart).toFixed(0);
  }

  /**
   * Utility to check for how much time CPU is busy
   */
  const getCPUBusyInterval = () => {
    let previousHit = null;
    let noOfCyclesCPUWasBusy = 0;
    let longTaskPollInterval = null;
    let successIntervals = 0;
    let busyIntervals = 0;
    let totalIntervals = 0;
    let busyTime = null;
    return new Promise((resolve, reject) => {
      const checkIfCPUIsBusy = () => {
        totalIntervals++;
        let timeDiff = window.performance.now() - previousHit;
        if (timeDiff > (CPU_BUSY_POLLING_INTERVAL + CPU_BUSY_ALLOWED_DEVIATION)) {
          successIntervals = 0;
          busyIntervals++;
        }
        else {
          //If load has not happened, getLoadTime() will be negative, we need to continue polling 
          if (parseInt(getLoadTime()) > 0) {

            // If CPU busy % is <= 10%, we report success
            if (parseInt(busyIntervals / totalIntervals) * 100 <= 10) {
              successIntervals++;
            }
            else {
              successIntervals = 0;
            }

            if (successIntervals === MIN_CPU_IDLE_INTERVALS) {
              // For last successIntervals, CPU was idle & we need to subtract those intervals
              noOfCyclesCPUWasBusy = totalIntervals - successIntervals;
              clearInterval(longTaskPollInterval);
              busyTime = parseInt(noOfCyclesCPUWasBusy * CPU_BUSY_POLLING_INTERVAL);
              resolve(busyTime);
            }
          }
        }
        previousHit = window.performance.now();
      }
      previousHit = window.performance.now();
      longTaskPollInterval = setInterval(checkIfCPUIsBusy, CPU_BUSY_POLLING_INTERVAL);

      setTimeout(() => {
        clearInterval(longTaskPollInterval);
        if (!busyTime) reject();
      }, TTI_THRESHOLD_TIME);
    });
  }


  /**
   * adding getReferentialTTI to window, if not already present
   */
  if (!window.getReferentialTTI) {
    window.getReferentialTTI = () => {
      return new Promise((resolve, reject) => {
        getCPUBusyInterval().then((busyTime) => {
          resolve(busyTime);
        }).catch(() => {
          reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
        });
      })
    };
  };


  /**
   * adding getPageTTI to window, if not already present
   */
  if (!window.getPageTTI) {
    window.getPageTTI = (() => {
      /*
      * Using LongTask API if supported
      */
      return new Promise((resolve, reject) => {
        if ('PerformanceLongTaskTiming' in window && PerformanceObserver in window) {
          !function () {
            let g = window.__tti = { e: [] };
            g.o = new PerformanceObserver(function (l) { g.e = g.e.concat(l.getEntries()) });
            g.o.observe({ entryTypes: ['longtask'] })
          }();
          ttiPolyfill.getFirstConsistentlyInteractive()
            .then((data) => {
              // This calculation makes sure that TTI can't be lesser than time for load(loadEventEnd)
              resolve(Math.max(data, getLoadTime()));
            }).catch(() => {
              reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
            });;
        }
        else {
          /**
           * Falling back to manually polling for long tasks.
           */
          getCPUBusyInterval().then((busyTime) => {
            // This calculation makes sure that TTI can't be lesser than time for load(loadEventEnd)
            resolve(parseInt(getLoadTime()) + parseInt(busyTime));
          }).catch(() => {
            reject("Could not calculate TTI within " + TTI_THRESHOLD_TIME + "ms");
          });
        }
      });
    }
    )();
  }
})();
