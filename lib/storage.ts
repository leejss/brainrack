import { createStorage } from "unstorage";
import indexedDbDriver from "unstorage/drivers/indexedb";

// IndexedDB 기반 스토리지 생성
// 브라우저 환경에서만 IndexedDB 드라이버 사용
const storage = createStorage({
  driver: indexedDbDriver({
    base: "brainrack:",
    dbName: "brainrack-db",
    storeName: "thoughts",
  }),
});

export { storage };
