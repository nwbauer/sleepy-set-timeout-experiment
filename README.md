# Does a setTimeout sleep?

The use of JS `setTimeout` is very common in front-end applications. One known behavior of an application's users is that they often just put their machine to sleep (close their laptop) instead of closing the browser. What I will show is that sleep mode is problematic if your application depends on a `setTimeout` firing its callback as soon as its delay elapses.

One might reasonably assume that "If a `setTimeout`'s delay elapses while a machine is hibernating, then upon machine wake, the JS engine will evaluate its event queue, notice it has an event with time that has elapsed, and invoke its callback as soon as possible".  This experiment will show that this behavior does not happen.

This contribution of this repo provides a simple experiment to test whether the following hypothesis is true:

>If a machine is in sleep/hibernate mode when a JS `setTimeout`'s delay elapses, the callback will not be invoked while asleep, and might not be invoked immediately on a machine's wake.

Moreover, the evidence suggests that

```
setTimoutTriggerTime = setTimeoutDelay + timeAsleep
```

where `setTimeoutDelay` is the second argument to `setTimeout` and `timeAsleep` is the length of time the machine is in hibernation/sleep mode. This implies that if the machine is always on, then `timeAsleep=0`, and things go as expected. This is not the case we are interested in here.

The phenomenon is particularly evident when the `setTimeoutDelay` is on the order of minutes.

## Background research

I have failed to find any direct documentation on `setTimeout` and sleep/hibernate.  Here are the indirect ones I have found:

* MDN focuses on the browser-side of JS, and states:

    >There are a number of reasons why a timeout may take longer to fire than anticipated. This section describes the most common reasons. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified)

    It goes on to list browser throttling rules, but does not address sleep/hibernation.

* The Node 9.5.0 docs simply state:

    >The callback will likely not be invoked in precisely delay milliseconds. Node.js makes no guarantees about the exact timing of when callbacks will fire, nor of their ordering. The callback will be called as close as possible to the time specified. [nodejs.org](https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args)

So neither of the above official resources address the sleep issue.

## The code

Here is what the code does:

1. starts a `setTimout` at a 2 minute delay
2. logs the time that the `setTimeout` is invoked (put on the JS event queue)
3. logs the "minutes until that `setTimeout`'s delay elapses" at an interval of 10 seconds (based on an **absolute-time** reference)
4. logs the time that the `setTimeout`'s callback is triggered


## The experiment

The experiment I ran, is the following:

1. Run the code, observe that the `setTimeout` fires as normal with the machine 'on'.
2. Run the code again, but this time, put the machine in sleep/hibernate for longer than the 2 minute `setTimeout` delay. If you have a laptop, this means close your screen and unplug any cables.
3. Upon wake, observe the interval logs and when the `setTimeout`'s callback is invoked.

## How to run it

You can run this code in either a browser, or Node.  They are different environments of course, so it is important to be able to experiment on both.

**Local Browser (webpack)**: `npm install` then `npm start`

**Node**: `node src/app.js`

**Mobile**: On your laptop/desktop, host the site locally by running `npm install` then `npm start -- --host [your laptop's LAN IP]`. Your local LAN IP is probably something like `192.168.1.xxx`. On your mobile device browser go to `http://[your laptop's LAN IP]:8080`.

## The results

### MacOs High Sierra

Below is my result from running the code on MacOs High Sierra v10.13.2, with these properties:

```
>>>uname -v
Darwin Kernel Version 17.3.0: Thu Nov  9 18:09:22 PST 2017; root:xnu-4570.31.3~1/RELEASE_X86_64

>>>bash --version
GNU bash, version 3.2.57(1)-release (x86_64-apple-darwin17)
Copyright (C) 2007 Free Software Foundation, Inc.

>>>node -v
v9.5.0
```

and the result:

![node experiment](https://raw.githubusercontent.com/nwbauer/sleepy-set-timeout-experiment/b07d11b2974e4b7333f711faf30657668fc408a3/images/node.png)

The above image reveals a few things:

1. With only a `setTimeout` on the event queue, it is impossible to know if a `setTimeout`'s delay elapsed during sleep mode.
2. The callback was fired according to the relation `setTimoutTriggerTime = setTimeoutDelay + timeAsleep`.

In other words, as my computer sleeps, the `setTimeout` delay is extended.

A mental model would be "a `setTimeout` stops ticking its clock when a machine is asleep".

I have also done cross-browser testing, and experimental results have confirmed that Chrome, FireFox and Safari all exhibit the same sleep behavior.

###  Windows 10

Below is my observation from running the code on Windows 10 Pro v1709 build:16299.248, with these properties:

```
>>> uname -v
#1-Microsoft Wed Dec 31 14:42:53 PST 2014

>>> bash --version
GNU bash, version 4.3.46(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

>>> node -v
v9.5.0
```
Running this test on a Windows 10 machine under the 'Windows Subsystem for Linux' shell has shown that thesetTimeout does in fact trigger close to the computer's wake event.  So the setTimeout is does not trigger during sleep, but it will trigger soon after the wake event.

Interestingly, the Windows browsers also seem to exhibit the same behavior of triggering just after wake, implying that the behavior connected to the underlying OS.

## A solution

In order to check if your `setTimout`'s delay has elapsed while a user put their computer to sleep, you need (at least) two things:

1. an absolute-time reference to when the `setTimeout` delay elapses (just a time-stamp)
2. a method to check the time remaining

This will allow your application to ask 'did the `setTimeout` delay elapse?' wherever it finds the answer of critical importance.  **With just a `setTimeout`, a set-it-and-forget-it mentality is used, naively hoping the JS engine will trigger it at the right moment (when at least Node makes no such guarantees, as stated in the docs above).**

The number of times you use the method to "check the time remaining" will, of course, depend on your application.

## Related Solutions

* An approach to detecting wake events [blog.alexmaccaw.com](https://blog.alexmaccaw.com/javascript-wake-event)
