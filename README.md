mevn-frontend

Vue.js front-end for the After School lessons app (CST3144 coursework).
Students and parents can browse after school lessons, add them to a cart and place an order.
All lesson, order and teacher data comes from the Express.js back-end through REST API calls made with fetch.

Links
- GitHub repository: https://github.com/mumoh031/mevn-frontend
- GitHub Pages (run the app): https://mumoh031.github.io/mevn-frontend/
- Back-end GitHub repository: https://github.com/mumoh031/M00688604-Server
- All lessons on render.com: https://m00688604-server.onrender.com/lessons

Features
- Lists every lesson with its subject, location, price, spaces left and image (images are served by the back-end).
- Sort the lessons by subject, location, price or spaces, in ascending or descending order.
- Search box that asks the back-end for lessons matching the text as you type.
- Sidebar of teachers: pick one to see only the lessons they teach.
- Add to Cart button on each lesson, disabled once no spaces are left.
- Cart page where lessons can be removed, and a checkout form with name (letters only) and phone (numbers only) checks.
- Submitting an order saves it with POST and updates each lesson's spaces with PUT.

Files
- index.html: the page layout and Vue template.
- app.js: the Vue app (data, methods and computed properties, including all fetch calls).
- style.css: the styling.
