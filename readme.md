# time-to-interactive
![alt text](https://www.zauca.com/wp-content/uploads/Why-Webpage-Speed-is-Important-Factor.png)

---

Utility to report time to interactive(tti) for Real User Monitoring (RUM) for web applications

[![npm version](https://badge.fury.io/js/time-to-interactive.svg)](https://badge.fury.io/js/time-to-interactive)

[![Build Status](https://travis-ci.org/gauravbehere/time-to-interactive.svg?branch=master)](https://travis-ci.org/gauravbehere/time-to-interactive)

#### Demo
https://gauravbehere.github.io/time-to-interactive/

###  APIs
#### window.getPageTTI
Contains a promise which on resolution reports the TTI value for the page.
#### window.getReferentialTTI()
Calling this on an event returns a promise which on resolution reports TTI for that event.
> Referential TTI can be fired from the click event, route navigations when you render a component or an event after which you want to check how much is the time to interactive for that action

### Algorithm
Basic idea is to make use of LongTask API to see if CPU was busy & report time to interactive based on 
the number of CPU cycles for which CPU was busy.
##### Steps:
 1. First attempt is to see if PerformanceLongTaskTiming is available in window.
 2. If it is available we report TTI as reported by tti-polyfill.
 3. There are instances where TTI reported by tti-polyfill is less than time for loadEventEnd, thus we return max of the two.
4. If PerformanceLongTaskTiming is not available we fall back to manual polling to check if CPU is busy.
5. As we get a window of 500ms for which CPU was idle, we report TTI based on the number of cycles we had to wait to see an idle 500ms window.
6. We look for the idle window after loadEventEnd has happened so that we are also waiting for network idle state.


### Usage

##### Including the library
___
```javascript
<script src="/path/to/time-to-interactive.min.js"></script>
```
or
```javascript
npm i "time-to-interactive"
require('time-to-interactive');
```
##### Consuming the APIs
___
```javascript
 window.getPageTTI.then(data => //data is the TTI value for the page)
 ```
 ```javascript
 window.getReferentialTTI().then(data => //data is the TTI value for a section/component)
 ```


### A word from the author
The term, time to interactive can be subjective & there could be different ways to approach it.
I have tried to get a balance between how Google Chrome's lighthouse does it & how it is done by Akamai's Boomerang. Research & analysis of statstics reported as TTI suggests that, it can vary drastically between browses & platforms. As the LongTaskAPI is yet to be standardized by the browsers, we rely on manual polling to see if CPU was busy.
I also recommend usage of another metric which is "first-input-delay", which is quite a standard now.

#### Licence
MIT

Author: Gaurav Behere, gaurav.techgeek@gmail.com

Feel free to raise a PR, if you see a scope of improvement :)

