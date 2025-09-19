Nissan Note Maintenance & Expense Tracker

This repository contains a mobile‑first maintenance and expense tracker for Nissan Note built with Next.js, TypeScript, Tailwind CSS and Dexie. It is designed to be a personal dashboard for keeping track of all aspects of your car’s upkeep – from routine service intervals and parts to fuel fill‑ups, repairs, insurance, taxes and other expenses.

Features
✅ Service & Maintenance Tracking

Custom templates for each maintenance item – engine oil, filters, spark plugs, brake fluid, transmission oil, coolant, battery, tyres, etc. Each template stores the recommended interval in kilometres/miles and months.

Automated due dates – calculates the next service based on last replacement date and mileage; flags tasks as OK, Soon or Overdue based on thresholds (30 days/500 km or equivalent in miles).

Quick entry form – add a new service record in seconds, specifying the component, date, mileage, cost and notes. Records update the vehicle’s mileage and the next due date.

Calendar integration – each maintenance item provides links to create events in Google Calendar or download an .ics file with the next due date and reminders.

🧰 Parts & Supplies

Keep a list of parts and supplies you need (e.g., oil, filters, bulbs, etc.). Each part entry stores the associated maintenance template, specifications, a purchase link, price and status (Need, In Cart, Bought, Installed).

See the total cost of parts yet to be bought and filter the list by status.

⛽ Fuel Logging & Statistics

Track every fill‑up: date, mileage, litres, price per litre, total cost, station and fuel type.

Full‑tank calculations – when filling up completely, record the previous full‑tank mileage to calculate consumption (litres per 100 km or per 100 mi).

Statistics dashboard – average, best and worst fuel consumption; total litres and cost; cost per kilometre/mile; favourite station detection and consumption bar chart.

💸 Expense Management & Reports

Log any other expenses (maintenance, repairs, insurance, taxes, parking, tolls, washing, accessories, fines and more) with date, amount, category and description.

View annual and semi‑annual reports with total expenses, monthly breakdowns, cost per kilometre/mile and category distribution.

Export your data as JSON for backup or import. A basic placeholder for PDF export is included; you can build on it using libraries like pdf-lib or an external service.

🚗 Vehicle Profile

Edit car details: year of manufacture, engine code, transmission type and unit of distance (km/mi).

Set the current mileage, which is used to compute due services.

Modify maintenance intervals per template from the profile page.

📱 Progressive Web App (optional)

The project is PWA‑ready. You can add a manifest and a service worker to enable offline functionality and install the app on your mobile device. Push notifications for upcoming maintenance are not implemented yet but can be added using the Notifications API and background sync.

Tech Stack

Next.js 14 (App Router) – server‑components architecture with client‑side state where needed.

TypeScript – for static typing and reliable code.

Tailwind CSS – utility‑first styling and responsive design. The app uses a neutral palette with monochrome icons.

Dexie – wrapper around IndexedDB for client‑side database storage. All data (vehicle, templates, service records, parts, fuel records and expenses) is stored locally; no backend is required.

date‑fns – date manipulation for calculating next due dates and intervals.

Lucide icons – set of outlined SVG icons.

Installation
Prerequisites

Node.js ≥ 18.x and npm or pnpm.

A modern browser (e.g., Chrome or Firefox) to run the app.

Steps

Clone the repository

git clone <your‑fork‑url>
cd nissan-note-app


Install dependencies

You can use npm, yarn or pnpm. Here is an example with pnpm:

pnpm install
# Or with npm:
# npm install


Run the development server

pnpm dev
