# PetPetLove

## 專案介紹

PetPetLove 不僅是一個寵物愛好者的社交平台，更是一個以公益為核心的寵物救助網絡。目標是透過科技與社群力量，提高流浪動物救助與走失寵物尋獲的效率，並建立一個可持續發展的公益生態系統。

平台不僅提供用戶分享寵物日常與社群互動的功能，更專注於 走失寵物通報、受傷動物救助、醫療系統、公益捐助，未來計畫與動保組織、收容所合作，串接動物認養與救助資源，打造全方位的寵物支援網絡。

願景是讓每一隻走失或受傷的動物都能被看見，讓公益捐助與救援行動變得更加透明與高效，最終建立一個結合社群力量與科技的「寵物公益平台」，推動更具規模的動物保護運動。

## 核心功能

### 會員與社交系統

- 會員管理：用戶註冊、登入，並透過 JWT 驗證確保安全性
- 社交互動：
  - 追蹤/取消追蹤其他用戶
  - 查看追蹤列表
  - 封鎖/解除封鎖用戶

### 即時通知與通訊

- WebSocket 即時通知（如新追蹤者通知、走失寵物標記提醒）
- 未來計畫：
  - RabbitMQ，優化即時消息處理
  - 即時訊息系統，讓用戶能直接交流

### 寵物救助

- 走失寵物通報系統
- 受傷動物救助機制
- 未來計畫：公益捐助系統

### 醫療支援與推薦

- 獸醫院推薦：根據距離、營業時間（24 小時）、醫療專長篩選合適的醫院。
- 醫療經驗分享：用戶可上傳醫療經歷，建立 社群型醫療評價。
- 急診通知系統（未來）：當寵物發生緊急情況時，推播 最近 24 小時獸醫院(Line Notify)。

## 技術架構

### 後端技術

- TypeScript + Express.js：提供 API 並確保類型安全
- MongoDB (Mongoose ODM)：管理用戶、貼文與寵物救助數據
- JWT + Bcrypt：強化身份驗證與密碼安全
- WebSocket（計畫整合 RabbitMQ）：即時通知
- Docker：確保可移植性與一致的開發環境
- Morgan + Helmet：加強日誌管理與 API 安全性

### 架構優勢

- 採用 事件驅動架構（Event-Driven Architecture）
- WebSocket 即時推送通知，例如：「你追蹤的用戶發布了一則走失寵物通報」
- RabbitMQ（未來計畫）將提升通知與訊息系統的處理效能
- MongoDB 優勢：
  - 靈活的 Schema 設計，支援快速擴展寵物資料
  - 索引與查詢優化，提高檢索效率（例如查找特定區域內的走失寵物）

## 專案架構

PetPetLove
│── src
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middlewares
│ ├── services
│ ├── config
│ └── utils
│── tests
│── .env
│── docker-compose.yml
│── package.json
│── README.md

## 安裝與運行

### 環境需求

- Node.js v22.14.0 (LTS)
- MongoDB（本機或雲端）

### 安裝步驟

1. Clone 專案

```bash
git clone git@github.com:Kris3131/PetPetLove2.0.git
cd PetPetLove2.0
```

2. 安裝套件

```bash
npm install
```

3. 設定環境變數 .env

```bash
NODE_ENV=development
PORT=5050
MONGO_URL=your_mongo_url
MONGO_DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600
```

4. 啟動開發環境

```bash
npm run dev
```

## 開發進度

- [x] 會員系統（登入/註冊/JWT 驗證）
- [x] 追蹤、封鎖系統
- [x] WebSocket 通知
- [ ] 走失寵物通報系統
- [ ] 受傷動物救助機制
- [ ] 醫療支援與推薦
- [ ] 即時訊息系統
- [ ] RabbitMQ 整合
- [ ] 捐助與支援功能

## 未來發展

為確保 PetPetLove 能夠成為一個真正具影響力的 寵物公益平台，未來發展將從 **功能面** 與 **技術面**兩個層面進行規劃。

### 短期目標

#### 功能優化

- 增加「用戶身份別」（寵物主人、救助者、志工、獸醫），並設置 RBAC 權限。
- 提升走失寵物通報機制，增加 地理定位與進度追蹤功能。
- 強化社交互動，提供 寵物個人檔案與貼文分類。

#### 技術優化

- Redis 快取 最熱門走失通報區域，降低 MongoDB 查詢負擔。
- WebSocket + JWT 身份驗證，確保即時訊息安全。
- RabbitMQ 通知系統，提升可擴展性。

#### 功能擴展

- 即時訊息系統（支援圖片與公益組織專屬頻道）。
- 領養系統 串接政府 API，提供動態更新。

### 中期目標

#### 功能擴展

- 即時訊息系統（支援圖片與公益組織專屬頻道）。
- 領養系統 串接政府 API，提供動態更新。

#### 技術擴展

- REST + GraphQL 並存，讓前端靈活查詢數據。
- API 分頁與快取策略，提升效能。
- CI/CD 自動化部署，透過 GitHub Actions 確保品質。

### 長期目標

#### 功能創新

- AI 影像辨識，輔助尋找走失寵物。
- 企業合作模式：企業贊助救助動物，並提高公益影響力。

#### 技術創新

- 微服務架構（Microservices），獨立 WebSocket、通知與即時訊息。
- Kubernetes 容器化，確保 WebSocket、RabbitMQ 可彈性擴展。
- 監控系統（Prometheus + Grafana），確保 API 穩定性。
