FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY ../frontend/index.html /usr/share/nginx/html/index.html
COPY ../frontend/app.js /usr/share/nginx/html/app.js
COPY ../frontend/app-v2.js /usr/share/nginx/html/app-v2.js
COPY ../frontend/styles.css /usr/share/nginx/html/styles.css
COPY ../frontend/admin.html /usr/share/nginx/html/admin.html
COPY ../frontend/admin-styles.css /usr/share/nginx/html/admin-styles.css

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]