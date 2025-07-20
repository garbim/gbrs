# Projeto Gestão de Tijolos

## Descrição
Aplicação backend em Java Spring Boot com banco MySQL, e frontend React, rodando via Docker. Gerencia tijolos com cadastro, status, relatórios e muito mais.

---

## Tecnologias

- Java 17, Spring Boot  
- MySQL  
- React + TypeScript  
- Docker, Docker Compose  

---

## Como executar com Docker

1. Certifique-se de ter o [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

2. Clone o repositório do projeto.

3. Na raiz do projeto, execute:

```bash
docker compose up --build
```

Isso vai:

- Construir e iniciar o backend Spring Boot  
- Criar o container do banco MySQL com dados persistidos  
- Iniciar o frontend React  

4. Acesse:

- Backend: `http://localhost:8080`  
- Frontend: `http://localhost:5173`  

---

## Observações

- O banco MySQL será criado e populado com 100 tijolos aleatórios toda vez que o container backend reiniciar.  
- Para resetar o banco, pare os containers e suba eles novamente:

```bash
docker compose down
docker compose up --build -d

- Certifique-se de adaptar as portas no `docker-compose.yml` se necessário.

---

## Contato

Para dúvidas ou sugestões, me envie um e-mail: [garbim7@gmail.com]
