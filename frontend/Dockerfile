# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# คัดลอกเฉพาะ package.json (ไม่เอา package-lock.json เพื่อให้ npm โหลดของ Linux มาใหม่)
COPY package.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สั่งรัน Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]