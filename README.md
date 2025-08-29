# Natural Cycles Challenge - Countdown app 
A responsive countdown application built with Angular and TypeScript. The app allows users to set an event name and end date, then displays a live countdown timer with auto-resizing text that always fits the screen width. It also fetches and displays a random "Quote of the Day" from a public API.

## Features
- Define an event name and end date
- Live countdown showing days, hours, minutes, and seconds
- Text-fit solution to dynamically resize and fill the full screen width, with option to reuse
- Works in portrait, landscape, and desktop resolutions
- Persistent storage: event name and end date are saved between reloads  
- Random quote of the day fetched from DummyJSON Quotes API
- Loader for quotes while fetching 
### Bonus features 
- Light error handling: event title and date required to start count down, if selected date is expired (has arrived) or in the past.
- Sneaky reset: Clear the event title and it removed the countdown and allows you to set new event title and change date. 

### Further improvements
- Format day(s) label dynamically (e.g., "1 day" vs "2 days")
- If less than a day remains, display only hours/minutes/seconds
- Support specifying time of day in addition to just the date 

- Add a reset/clear button
- Refine the UX for time unit formatting (e.g., spacing between "15h" vs "15 h") in collaboration with design
- Replace the Quote of the Day API with a more reliable/safe provider to avoid inappropriate quotes for end users

- Possible refactoratory work of the time-fit directive. 

#### Further iteration 
May include additions such as allowing users to set multiple events, keep track of past events, pause/resume events as well as notifications or alerts when the event expires. Further more it would be nice with further design work and a dark/light mode toggle.   

## Watch it live 🤪
https://ceciliaohrn-naturalcycles.netlify.app/

<img width="291" height="639" alt="Screenshot 2025-08-29 at 09 01 05 (2)" src="https://github.com/user-attachments/assets/0418104a-71eb-41b2-b090-afad93508d53" />
<img width="431" height="385" alt="Screenshot 2025-08-29 at 09 01 23 (2)" src="https://github.com/user-attachments/assets/e791ed1a-6a57-491a-a49c-72dace3cd39f" />


## Running the project
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

###  Pre-reqs
Node.js (latest LTS)
Angular

###
Clone repository:  
```
git clone <repo-url>
```

Navigate into the project folder
```
cd countdown-app
```

Install deps
```
npm install
```

To start a local development server, run:
```bash
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. 
The application will automatically reload whenever you modify any of the source files.

## Build 
To build for production 
```
ng build
```
The build artifacts will be stored in the dist/ directory.
