# 📊 Sales Dashboard

A dynamic, interactive sales data visualization dashboard built with React and HTML5 Canvas — no external charting libraries.

🔗 **Live Demo:** [https://shabising.github.io/sales-chart](https://shabising.github.io/sales-chart)

---

## ✨ Features

- 📈 **Custom Bar Chart** — built from scratch using HTML5 Canvas API
- 🎛️ **Interactive Filters** — filter by quarter, category, region, and minimum sales
- 🎬 **Smooth Animations** — bar transitions using `requestAnimationFrame` + lerp
- 🖱️ **Hover Tooltips** — detailed data on hover
- 🌗 **Light/Dark Mode** — manual toggle with `localStorage` persistence
- 💾 **CSV Export** — download filtered data using Blob API
- 🔄 **Reset Filters** — one-click filter reset
- 📱 **Responsive Design** — adapts to all screen sizes using `ResizeObserver`

---

## 🏗️ Project Structure

src/
├── components/
│   ├── BarChart.jsx       # Canvas-based bar chart
│   ├── Filters.jsx        # Filter controls
│   ├── MetricCards.jsx    # Summary metric cards
│   ├── Tooltip.jsx        # Hover tooltip
│   └── ErrorBoundary.jsx  # Error handling
├── context/
│   └── FilterContext.js   # Global state with Context API
├── data/
│   └── salesData.js       # Hardcoded sales data
├── hooks/
│   ├── useAnimatedBars.js # Animation hook
│   ├── useCSVExport.js    # CSV export hook
│   ├── useDarkMode.js     # Dark mode hook
│   └── useFilteredData.js # Data filtering hook
├── App.js
└── App.css

---

## ⚙️ Technical Highlights

### No Chart Libraries
All chart rendering is done manually using the **Canvas 2D API** — including bars, grid lines, axis labels, rounded corners, and hover detection.

### Advanced React Patterns
- `useReducer` — centralized state management
- `Context API` — global state without prop drilling
- `React.memo` — prevents unnecessary re-renders
- `useCallback` — memoized event handlers
- Custom hooks — separation of concerns

### Performance
- `useMemo` for filtered data computation
- `cancelAnimationFrame` to cancel stale animations
- `ResizeObserver` for accurate responsive behavior

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- npm >= 6

### Installation

```bash
git clone https://github.com/shabising/sales-chart.git
cd sales-chart
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| React 18 | UI framework |
| HTML5 Canvas | Chart rendering |
| Context API | Global state |
| localStorage | Filter persistence |
| Blob API | CSV export |
| gh-pages | Deployment |

---

## 📸 Screenshots

### Light Mode
![Light Mode](https://shabising.github.io/sales-chart/screenshot-light.png)

### Dark Mode
![Dark Mode](https://shabising.github.io/sales-chart/screenshot-dark.png)

---

## 📄 License

MIT © [shabising](https://github.com/shabising)