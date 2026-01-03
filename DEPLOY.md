# Deploy 手順（Static Export）

## 1. build

```bash
npm run build
```

## 2. out 配下をサーバにアップロード

- アップロードするのは out フォルダの中身
- out フォルダそのものは置かない

```csharp
out/
├─ index.html
├─ _next/
├─ header.png
├─ cat_nobi.png
└─ ...
```

## 3. 公開URL

[https://event.phys.s.u-tokyo.ac.jp/physlab2026/](https://event.phys.s.u-tokyo.ac.jp/physlab2026/)

## 注意

- basePath は使用していない
- HTML / CSS / JS はすべて /\_next/... を参照する

<br><br><br>

### 再びbuildしたい場合

```bash
rm -rf .next out
```

(再帰的に.nextとoutを削除)

からの

```bash
npm run build
```

<br><br><br>

### ローカルでテストしたい場合

```bash
cd out
python3 -m http.server 8000
```

ブラウザで

```
http://localhost:8000/
```
