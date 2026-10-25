# THIENTRAN Bypass

> Auto bypass web cho **link4m · link4sub · layma · ontop**  
> by **Trần phi thiên**

Giao diện premium, chạy mượt, chỉ trả link **sau khi** đã vượt xong.

---

## Cấu trúc project

```
thientran-bypass/
├── index.html          # Trang chính
├── css/
│   └── style.css       # Toàn bộ style (glass + neon)
├── js/
│   ├── app.js          # Controller UI + history + stats
│   ├── bypass.js       # Engine nhận diện + progress + hook API
│   └── ticker.js       # Dòng chạy "THIENTRAN đã vượt thành công"
├── assets/             # (để icon / favicon sau)
├── README.md
└── .gitignore
```

---

## Deploy lên GitHub Pages (1 phút)

1. Tạo repo mới trên GitHub (public)
2. Upload toàn bộ thư mục này lên
3. Vào **Settings → Pages**
4. Source: **Deploy from a branch** → chọn `main` / `root`
5. Đợi ~30s → mở link `https://<user>.github.io/<repo>/`

### Netlify / Vercel

- Kéo thả folder hoặc connect GitHub
- Build command: không cần
- Publish directory: `/` (root)

---

## Tính năng

- Tự nhận diện dịch vụ hoặc chọn tay
- Progress mượt 7–14 giây
- **Không bao giờ** trả lại link gốc chưa vượt
- Toast + ticker sống: `THIENTRAN đã vượt thành công`
- Lịch sử + thống kê (localStorage)
- Responsive, dark neon, glassmorphism

---

## Gắn bypass thật

Mở `js/bypass.js` → hàm `tryReal(url, svc)`.

Khi có API / proxy riêng:

```js
const res = await fetch(`https://api.yourdomain.com/bypass?url=${encodeURIComponent(url)}`);
const data = await res.json();
if (data.ok && data.url) return data.url;
```

Hoặc dùng kèm Tampermonkey userscript trên trang shortlink.

---

## License

Free for personal use. Credit: **Trần phi thiên**
