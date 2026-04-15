# Этап 1: сборка приложения
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production=false

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2: формирование финального образа с Nginx
FROM nginx:alpine

# Копируем собранные статические файлы в директорию Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx (опционально)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
