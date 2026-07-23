# EndoPredict Run & Test Guide

This guide provides the commands and steps needed to run, test, and verify the EndoPredict application in both web (desktop) and mobile modes.

---

## 🛠️ Step 1: Install Dependencies

Before running the server, make sure all packages are properly installed. Open your command prompt, navigate to the project directory, and run:

```bash
npm install
```

---

## 🚀 Step 2: Run the Development Server

To start the Vite development server, run:

```bash
npm run dev
```

If you want to access the application from a **physical mobile device** connected to the same Wi-Fi network, run the server with the `--host` flag:

```bash
npx vite --host
```
*This will output a local network URL (e.g., `http://192.168.x.x:5173`) that you can open directly on your phone's browser.*

---

## 💻 Step 3: Check Desktop Web Mode

1. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```
2. You should see the full desktop dashboard with:
   - Sidebar navigation panel on the left (with collapsible toggle).
   - Tooth Map, Patient lists, AI Predictor, and Teleconsult tabs.
   - Slid-out tooth detail panel on the right.
   - Light/Dark mode switcher at the bottom of the sidebar.

---

## 📱 Step 4: Check Mobile responsive Mode

You can test the mobile alignment and functionality in two ways:

### Method A: Browser DevTools (Recommended)
1. In your desktop browser (Chrome/Edge/Firefox), press `F12` (or right-click and select **Inspect**).
2. Click the **Device Toggle Toolbar** icon (or press `Ctrl + Shift + M`).
3. Set the device preset to **iPhone 12 Pro**, **Pixel 7**, or resize the width under `400px`.
4. Observe the mobile layout adapt instantly:
   - The desktop sidebar is hidden.
   - The navigation menu transforms into a bottom navigation bar.
   - The Tooth Detail Panel becomes a sliding bottom-sheet modal.
   - Tables and lists align vertically for single-column mobile viewports.

### Method B: Physical Mobile Device
1. Run `npx vite --host`.
2. Look at the terminal output to find the **Network** IP address.
3. Open your mobile phone's web browser and enter the network address (e.g., `http://192.168.1.100:5173`).
4. Interact with the application to experience the native-like mobile flow.

---

## 📦 Step 5: Build for Production

To build the optimized static assets and ensure there are no compilation errors:

```bash
npm run build
```
This runs the TypeScript compiler check (`tsc`) followed by the Vite production bundler.
