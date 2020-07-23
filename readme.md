Live Occupancy tracker with Browser Monitoring


This is created using; a Pi, 2 ultrasonic modules, WiFI, Pigpiod library, and node.JS/Socket.io for web framework.

Demonstration code is for one entrance with a separate exit. Second code will be for one entrance/exit  and will 
determine direction by checking which US module is passed first. 

Testing/optimizing - changing tripper intervals, pulse bit length, normal distance from US module to opposing wall of entrance/exit
(would need a UI to optimize all these settings in a commercial application, preferrably through web page) 

US module 1 Counts up - trigger is plugged into GPIO 23, echo is plugged into GPIO 24
US module 2 Counts down -  trigger is plugged into GPIO 17, echo is plugged into GPIO 27